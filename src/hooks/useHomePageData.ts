import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { StandingRow, PreviousGwStats, PlayerRankItem } from '../data/dummyData';

interface HomePageData {
  previousGwStats: PreviousGwStats;
  nextGwNumber: number;
  nextGwDeadline: Date | null;
  leagueStandings: StandingRow[];
  mostSelected: PlayerRankItem[];
  topCaptains: PlayerRankItem[];
  transferIn: PlayerRankItem[];
  transferOut: PlayerRankItem[];
  loading: boolean;
  error: string | null;
}

const RANKS: Array<'1st' | '2nd' | '3rd'> = ['1st', '2nd', '3rd'];

export function useHomePageData(): HomePageData {
  const [data, setData] = useState<HomePageData>({
    previousGwStats: { averageScore: 0, highestScore: 0, mostCaptained: '-' },
    nextGwNumber: 2,
    nextGwDeadline: null,
    leagueStandings: [],
    mostSelected: [],
    topCaptains: [],
    transferIn: [],
    transferOut: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        // 1. Fetch gameweeks (current/previous/next)
        const { data: gameweeks, error: gwError } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, name, deadline_time, is_current, is_previous, is_next, average_entry_score, highest_score, most_captained')
          .or('is_current.eq.true,is_previous.eq.true,is_next.eq.true')
          .order('gw_number');

        if (gwError) throw gwError;

        const currentOrPrevGw = gameweeks?.find((g) => g.is_current || g.is_previous)
          || gameweeks?.[0];
        const nextGw = gameweeks?.find((g) => g.is_next);

        const previousGwNumber = currentOrPrevGw?.gw_number ?? 1;
        const nextGwNumber = nextGw?.gw_number ?? (previousGwNumber + 1);
        const nextGwDeadline = nextGw?.deadline_time ? new Date(nextGw.deadline_time) : null;

        // 2. Get most captained player name
        let mostCaptainedName = '-';
        if (currentOrPrevGw?.most_captained) {
          const { data: captainPlayer } = await supabase
            .from('fpl_players')
            .select('web_name')
            .eq('player_id', currentOrPrevGw.most_captained)
            .single();
          if (captainPlayer) {
            // Count how many managers captained this player
            const { count: captainCount } = await supabase
              .from('manager_gameweek_picks')
              .select('*', { count: 'exact', head: true })
              .eq('gw_number', previousGwNumber)
              .eq('is_captain', true)
              .eq('player_id', currentOrPrevGw.most_captained);
            const pct = captainCount ? Math.round((captainCount / 40) * 100) : 0;
            mostCaptainedName = `${captainPlayer.web_name} (${pct}%)`;
          }
        } else {
          // Fallback: compute from picks
          const { data: captainPicks } = await supabase
            .from('manager_gameweek_picks')
            .select('player_id')
            .eq('gw_number', previousGwNumber)
            .eq('is_captain', true);
          if (captainPicks && captainPicks.length > 0) {
            const countMap: Record<number, number> = {};
            for (const pick of captainPicks) {
              countMap[pick.player_id] = (countMap[pick.player_id] || 0) + 1;
            }
            const topCaptainId = Number(Object.entries(countMap).sort((a, b) => b[1] - a[1])[0][0]);
            const { data: topPlayer } = await supabase
              .from('fpl_players')
              .select('web_name')
              .eq('player_id', topCaptainId)
              .single();
            const pct = Math.round((countMap[topCaptainId] / 40) * 100);
            mostCaptainedName = topPlayer ? `${topPlayer.web_name} (${pct}%)` : '-';
          }
        }

        const previousGwStats: PreviousGwStats = {
          averageScore: currentOrPrevGw?.average_entry_score ?? 0,
          highestScore: currentOrPrevGw?.highest_score ?? 0,
          mostCaptained: mostCaptainedName,
        };

        // 3. League standings — ambil GW terbaru yang tersedia di manager_gameweek_stats
        //    lalu join manual ke managers (tidak ada FK constraint)
        const { data: latestGwRows } = await supabase
          .from('manager_gameweek_stats')
          .select('gw_number')
          .order('gw_number', { ascending: false })
          .limit(1);

        const latestGwNumber = latestGwRows?.[0]?.gw_number ?? previousGwNumber;

        const { data: standings, error: standingsError } = await supabase
          .from('manager_gameweek_stats')
          .select('manager_id, gw_number, points, total_points, rank')
          .eq('gw_number', latestGwNumber)
          .order('total_points', { ascending: false })
          .limit(10);

        if (standingsError) throw standingsError;

        // Ambil data managers berdasarkan manager_id dari standings
        const managerIds = (standings ?? []).map((s) => s.manager_id);
        const { data: managersData, error: managersError } = await supabase
          .from('managers')
          .select('manager_id, manager_name, team_name')
          .in('manager_id', managerIds);

        if (managersError) throw managersError;

        const managerInfoMap = new Map(
          (managersData ?? []).map((m) => [m.manager_id, m])
        );

        const leagueStandings: StandingRow[] = (standings ?? []).map((row, idx) => {
          const mgr = managerInfoMap.get(row.manager_id);
          return {
            pos: idx + 1,
            team: mgr?.team_name ?? `Manager ${row.manager_id}`,
            manager: mgr?.manager_name ?? '-',
            gw: row.points ?? 0,
            tot: row.total_points ?? 0,
            gwNumber: row.gw_number,
          };
        });


        // Manual aggregation via picks join
        const { data: picks } = await supabase
          .from('manager_gameweek_picks')
          .select('player_id')
          .eq('gw_number', previousGwNumber);

        const selectionCount: Record<number, number> = {};
        if (picks) {
          for (const p of picks) {
            selectionCount[p.player_id] = (selectionCount[p.player_id] || 0) + 1;
          }
        }
        const topSelected = Object.entries(selectionCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([id, count]) => ({ player_id: Number(id), count }));

        // Fetch captain picks
        const { data: captainPicks } = await supabase
          .from('manager_gameweek_picks')
          .select('player_id')
          .eq('gw_number', previousGwNumber)
          .eq('is_captain', true);

        const captainCount: Record<number, number> = {};
        if (captainPicks) {
          for (const p of captainPicks) {
            captainCount[p.player_id] = (captainCount[p.player_id] || 0) + 1;
          }
        }
        const topCaptainsList = Object.entries(captainCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([id, count]) => ({ player_id: Number(id), count }));

        // Fetch transfer data from player_gameweek_snapshot
        const { data: snapshots } = await supabase
          .from('player_gameweek_snapshot')
          .select('player_id, transfers_in_event, transfers_out_event')
          .eq('gw_number', previousGwNumber)
          .order('transfers_in_event', { ascending: false })
          .limit(50);

        const topTransferIn = [...(snapshots ?? [])]
          .sort((a, b) => (b.transfers_in_event ?? 0) - (a.transfers_in_event ?? 0))
          .slice(0, 3)
          .map((s) => ({ player_id: s.player_id, count: s.transfers_in_event ?? 0 }));

        const topTransferOut = [...(snapshots ?? [])]
          .sort((a, b) => (b.transfers_out_event ?? 0) - (a.transfers_out_event ?? 0))
          .slice(0, 3)
          .map((s) => ({ player_id: s.player_id, count: s.transfers_out_event ?? 0 }));

        // Batch fetch player info for all IDs
        const allPlayerIds = [
          ...topSelected.map((p) => p.player_id),
          ...topCaptainsList.map((p) => p.player_id),
          ...topTransferIn.map((p) => p.player_id),
          ...topTransferOut.map((p) => p.player_id),
        ].filter((v, i, a) => a.indexOf(v) === i);

        const { data: players } = await supabase
          .from('fpl_players')
          .select('player_id, web_name, team_id, element_type')
          .in('player_id', allPlayerIds);

        const { data: teams } = await supabase
          .from('fpl_teams')
          .select('team_id, short_name');

        const { data: elementTypes } = await supabase
          .from('fpl_element_types')
          .select('element_type_id, singular_name_short');

        const playerMap = new Map((players ?? []).map((p) => [p.player_id, p]));
        const teamMap = new Map((teams ?? []).map((t) => [t.team_id, t.short_name]));
        const posMap = new Map((elementTypes ?? []).map((et) => [et.element_type_id, et.singular_name_short]));

        function toPlayerRankItem(id: number, count: number, rank: '1st' | '2nd' | '3rd'): PlayerRankItem {
          const player = playerMap.get(id);
          return {
            rank,
            name: player?.web_name ?? `Player ${id}`,
            team: teamMap.get(player?.team_id ?? 0) ?? '???',
            position: posMap.get(player?.element_type ?? 0) ?? '???',
            statValue: count,
          };
        }

        const mostSelected: PlayerRankItem[] = topSelected.map(({ player_id, count }, i) =>
          toPlayerRankItem(player_id, count, RANKS[i])
        );
        const topCaptainsItems: PlayerRankItem[] = topCaptainsList.map(({ player_id, count }, i) =>
          toPlayerRankItem(player_id, count, RANKS[i])
        );
        const transferInItems: PlayerRankItem[] = topTransferIn.map(({ player_id, count }, i) =>
          toPlayerRankItem(player_id, count, RANKS[i])
        );
        const transferOutItems: PlayerRankItem[] = topTransferOut.map(({ player_id, count }, i) =>
          toPlayerRankItem(player_id, count, RANKS[i])
        );

        setData({
          previousGwStats,
          nextGwNumber,
          nextGwDeadline,
          leagueStandings,
          mostSelected,
          topCaptains: topCaptainsItems,
          transferIn: transferInItems,
          transferOut: transferOutItems,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('[useHomePageData] Error:', err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    }

    fetchAll();
  }, []);

  return data;
}

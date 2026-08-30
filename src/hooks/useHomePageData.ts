import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { StandingRow, PreviousGwStats, PlayerRankItem } from '../data/dummyData';

interface GwStatusInfo {
  gwNumber: number | null;
  isLive: boolean;
  isFinished: boolean;
}

interface HomePageData {
  previousGwStats: PreviousGwStats;
  latestFinishedGw: number | null;
  displayGw: number | null;
  nextGwNumber: number | null;
  nextGwDeadline: Date | null;
  leagueStandings: StandingRow[];
  mostSelected: PlayerRankItem[];
  topCaptains: PlayerRankItem[];
  transferIn: PlayerRankItem[];
  transferOut: PlayerRankItem[];
  gwStatus: GwStatusInfo;
  lastUpdatedAt: Date | null;
  loading: boolean;
  error: string | null;
}

const RANKS: Array<'1st' | '2nd' | '3rd'> = ['1st', '2nd', '3rd'];

export function useHomePageData(): HomePageData {
  const [data, setData] = useState<HomePageData>({
    previousGwStats: { averageScore: 0, highestScore: 0, mostCaptained: '-' },
    latestFinishedGw: null,
    displayGw: null,
    nextGwNumber: null,
    nextGwDeadline: null,
    leagueStandings: [],
    mostSelected: [],
    topCaptains: [],
    transferIn: [],
    transferOut: [],
    gwStatus: { gwNumber: null, isLive: false, isFinished: false },
    lastUpdatedAt: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAll(isInitial = true) {
      if (isInitial) {
        setData((prev) => ({ ...prev, loading: true, error: null }));
      }
      try {
        // ── Section 2: Next Deadline ─────────────────────────────────────────
        // WHERE is_next = true
        const { data: nextGwRows, error: nextGwError } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, deadline_time')
          .eq('is_next', true)
          .limit(1);

        if (nextGwError) throw nextGwError;

        const nextGwRow = nextGwRows?.[0] ?? null;
        const nextGwNumber = nextGwRow?.gw_number ?? null;
        const nextGwDeadline = nextGwRow?.deadline_time
          ? new Date(nextGwRow.deadline_time)
          : null;

        // ── Section 8: GW Status Badge ────────────────────────────────────────
        // WHERE is_current = true
        const { data: currentGwRows } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, is_current, finished')
          .eq('is_current', true)
          .limit(1);

        const currentGwRow = currentGwRows?.[0] ?? null;
        const gwStatus: GwStatusInfo = {
          gwNumber: currentGwRow?.gw_number ?? null,
          isLive: currentGwRow
            ? currentGwRow.is_current === true && currentGwRow.finished === false
            : false,
          isFinished: currentGwRow?.finished === true,
        };

        // ── Step 1: Determine effective GW with stats data ───────────────────
        const { data: statsGwRows } = await supabase
          .from('manager_gameweek_stats')
          .select('gw_number')
          .order('gw_number', { ascending: false })
          .limit(1);

        const latestStatsGw: number | null = statsGwRows?.[0]?.gw_number ?? null;

        const { data: finishedGwRows, error: finishedGwError } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number')
          .eq('finished', true)
          .order('gw_number', { ascending: false })
          .limit(1);

        if (finishedGwError) throw finishedGwError;

        const latestFinishedGw: number | null = finishedGwRows?.[0]?.gw_number ?? null;
        const effectiveGw: number | null = latestStatsGw ?? latestFinishedGw;

        // ── Step 1b: Determine display_gw for picks/transfers cards ──────────
        const nowIso = new Date().toISOString();
        const { data: deadlineRows } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, deadline_time')
          .lte('deadline_time', nowIso)
          .order('gw_number', { ascending: false })
          .limit(1);

        const displayGw: number | null = deadlineRows?.[0]?.gw_number ?? effectiveGw;

        let previousGwStats: PreviousGwStats = {
          averageScore: 0,
          highestScore: 0,
          mostCaptained: '-',
        };
        let leagueStandings: StandingRow[] = [];
        let mostSelected: PlayerRankItem[] = [];
        let topCaptains: PlayerRankItem[] = [];
        let transferIn: PlayerRankItem[] = [];
        let transferOut: PlayerRankItem[] = [];

        // ── Section 3: GW Stats from public.v_live_league_gw_stats ─────────
        const { data: liveGwStatsRow, error: liveGwStatsError } = await supabase
          .from('v_live_league_gw_stats')
          .select('*')
          .maybeSingle();

        if (liveGwStatsError) {
          console.error('[useHomePageData] v_live_league_gw_stats error:', liveGwStatsError);
        }

        const gwNum = liveGwStatsRow?.gw_number ?? 2;
        const avgScore = liveGwStatsRow?.average_score ? Number(liveGwStatsRow.average_score) : 0;
        const highScore = liveGwStatsRow?.highest_score ? Number(liveGwStatsRow.highest_score) : 0;
        const captPlayer = liveGwStatsRow?.most_captained_player
          ? liveGwStatsRow.most_captained_player.toUpperCase()
          : '-';
        const captPct = liveGwStatsRow?.captain_percentage ? Number(liveGwStatsRow.captain_percentage) : 0;

        const mostCaptainedFormatted = `${captPlayer} (${captPct}%)`;

        // Fetch highest_team_name from v_live_manager_standings for highest_score
        let highestTeamName: string | undefined = undefined;
        if (highScore > 0) {
          const { data: topGwPointsRow } = await supabase
            .from('v_live_manager_standings')
            .select('team_name, live_gw_points')
            .eq('live_gw_points', highScore)
            .limit(1)
            .maybeSingle();

          if (topGwPointsRow?.team_name) {
            highestTeamName = topGwPointsRow.team_name;
          }
        }

        previousGwStats = {
          gwNumber: gwNum,
          averageScore: avgScore,
          highestScore: highScore,
          highestTeamName: highestTeamName,
          mostCaptained: mostCaptainedFormatted,
        };

        if (effectiveGw !== null) {

          // ── Section 7: League Standings (top 5 preview from public.v_live_manager_standings) ──
          const { data: liveStandingsData, error: liveStandingsError } = await supabase
            .from('v_live_manager_standings')
            .select('live_rank, team_name, manager_name, live_gw_points, live_total_points, gw_number')
            .order('live_rank', { ascending: true })
            .limit(5);

          if (liveStandingsError) throw liveStandingsError;

          leagueStandings = (liveStandingsData ?? []).map((row, idx) => ({
            pos: row.live_rank ?? (idx + 1),
            team: row.team_name ?? '-',
            manager: row.manager_name ?? '-',
            gw: row.live_gw_points ?? 0,
            tot: row.live_total_points ?? 0,
            gwNumber: row.gw_number,
          }));
        }

        // ── Sections 4, 5, 6: Picks & Transfers — gated on displayGw ─────────
        if (displayGw !== null) {
          const { data: allPicks, error: picksError } = await supabase
            .from('manager_gameweek_picks')
            .select('player_id')
            .eq('gw_number', displayGw);

          if (picksError) throw picksError;

          const selectionCount: Record<number, number> = {};
          for (const p of allPicks ?? []) {
            selectionCount[p.player_id] = (selectionCount[p.player_id] || 0) + 1;
          }
          const topSelected = Object.entries(selectionCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id, count]) => ({ player_id: Number(id), count }));

          const { data: captainPicksDisplay } = await supabase
            .from('manager_gameweek_picks')
            .select('player_id')
            .eq('gw_number', displayGw)
            .eq('is_captain', true);

          const captainCountMap: Record<number, number> = {};
          for (const p of captainPicksDisplay ?? []) {
            captainCountMap[p.player_id] = (captainCountMap[p.player_id] || 0) + 1;
          }
          const topCaptainsList = Object.entries(captainCountMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id, count]) => ({ player_id: Number(id), count }));

          let topTransferIn: Array<{ player_id: number; count: number }> = [];
          let topTransferOut: Array<{ player_id: number; count: number }> = [];

          if (displayGw > 1) {
            const { data: transfersIn, error: transferInError } = await supabase
              .from('manager_transfers')
              .select('manager_id, player_in_id')
              .eq('gw_number', displayGw);

            if (transferInError) throw transferInError;

            const { data: transfersOut, error: transferOutError } = await supabase
              .from('manager_transfers')
              .select('manager_id, player_out_id')
              .eq('gw_number', displayGw);

            if (transferOutError) throw transferOutError;

            const inManagerSetMap: Record<number, Set<number>> = {};
            for (const t of transfersIn ?? []) {
              if (!inManagerSetMap[t.player_in_id]) {
                inManagerSetMap[t.player_in_id] = new Set();
              }
              inManagerSetMap[t.player_in_id].add(t.manager_id);
            }
            topTransferIn = Object.entries(inManagerSetMap)
              .map(([id, set]) => ({ player_id: Number(id), count: set.size }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 3);

            const outManagerSetMap: Record<number, Set<number>> = {};
            for (const t of transfersOut ?? []) {
              if (!outManagerSetMap[t.player_out_id]) {
                outManagerSetMap[t.player_out_id] = new Set();
              }
              outManagerSetMap[t.player_out_id].add(t.manager_id);
            }
            topTransferOut = Object.entries(outManagerSetMap)
              .map(([id, set]) => ({ player_id: Number(id), count: set.size }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 3);
          }

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
          const posMap = new Map(
            (elementTypes ?? []).map((et) => [et.element_type_id, et.singular_name_short])
          );

          function toPlayerRankItem(
            id: number,
            count: number,
            rank: '1st' | '2nd' | '3rd'
          ): PlayerRankItem {
            const player = playerMap.get(id);
            return {
              playerId: id,
              rank,
              name: player?.web_name ?? `Player ${id}`,
              team: teamMap.get(player?.team_id ?? 0) ?? '???',
              position: posMap.get(player?.element_type ?? 0) ?? '???',
              statValue: count,
            };
          }

          mostSelected = topSelected.map(({ player_id, count }, i) =>
            toPlayerRankItem(player_id, count, RANKS[i])
          );
          topCaptains = topCaptainsList.map(({ player_id, count }, i) =>
            toPlayerRankItem(player_id, count, RANKS[i])
          );
          transferIn = topTransferIn.map(({ player_id, count }, i) =>
            toPlayerRankItem(player_id, count, RANKS[i])
          );
          transferOut = topTransferOut.map(({ player_id, count }, i) =>
            toPlayerRankItem(player_id, count, RANKS[i])
          );
        }

        // ── Section 9: Last Updated Indicator ────────────────────────────────
        // Sets timestamp to the exact moment of live data fetch
        const lastUpdatedAt = new Date();

        setData({
          previousGwStats,
          latestFinishedGw: effectiveGw,
          displayGw,
          nextGwNumber,
          nextGwDeadline,
          leagueStandings,
          mostSelected,
          topCaptains,
          transferIn,
          transferOut,
          gwStatus,
          lastUpdatedAt,
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

    // Initial fetch (shows loading skeleton on initial mount only)
    fetchAll(true);

    // 1. Polling fallback per 60 detik (auto-refresh tanpa refresh browser)
    const intervalId = setInterval(() => {
      fetchAll(false); // background refetch — preserves existing UI while updating data
    }, 60000);

    // 2. Supabase Realtime channel subscription on live performance tables
    const channel = supabase
      .channel('live-standings-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_gameweek_live' },
        () => {
          fetchAll(false);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'manager_gameweek_stats' },
        () => {
          fetchAll(false);
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}

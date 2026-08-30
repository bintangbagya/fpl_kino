import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface CupTeamInfo {
  pos: number;
  team: string;
  manager?: string;
}

export interface CupMatchup {
  home: CupTeamInfo;
  away: CupTeamInfo;
}

// Fixed R16 seed pairing indices
// Match 1: Seed #1 vs Seed #9
// Match 2: Seed #2 vs Seed #10
// Match 3: Seed #3 vs Seed #11
// Match 4: Seed #4 vs Seed #12
// Match 5: Seed #5 vs Seed #13
// Match 6: Seed #6 vs Seed #14
// Match 7: Seed #7 vs Seed #15
// Match 8: Seed #8 vs Seed #16
const R16_SEED_PAIRS: [number, number][] = [
  [1, 9],
  [2, 10],
  [3, 11],
  [4, 12],
  [5, 13],
  [6, 14],
  [7, 15],
  [8, 16],
];

export function useCupPageData() {
  const [isGw19Finished, setIsGw19Finished] = useState<boolean>(false);
  const [r16Matchups, setR16Matchups] = useState<CupMatchup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCupData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Check if GW19 is finished in fpl_gameweeks
        const { data: gwData, error: gwError } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, finished')
          .eq('gw_number', 19);

        if (gwError) throw gwError;

        const isFinished = gwData && gwData.length > 0 && gwData[0].finished === true;
        setIsGw19Finished(isFinished);

        // 2. If GW19 is NOT finished, use TBD placeholders (without redundant "Seed #" text)
        if (!isFinished) {
          const placeholderMatchups: CupMatchup[] = R16_SEED_PAIRS.map(([homeSeed, awaySeed]) => ({
            home: { pos: homeSeed, team: 'TBD' },
            away: { pos: awaySeed, team: 'TBD' },
          }));

          setR16Matchups(placeholderMatchups);
          setLoading(false);
          return;
        }

        // 3. If GW19 IS finished, query the final GW19 standings for the top 16 managers by total_points
        const { data: stats, error: statsError } = await supabase
          .from('manager_gameweek_stats')
          .select('manager_id, gw_number, points, total_points')
          .eq('gw_number', 19)
          .order('total_points', { ascending: false });

        if (statsError) throw statsError;

        if (!stats || stats.length === 0) {
          const placeholderMatchups: CupMatchup[] = R16_SEED_PAIRS.map(([homeSeed, awaySeed]) => ({
            home: { pos: homeSeed, team: 'TBD' },
            away: { pos: awaySeed, team: 'TBD' },
          }));
          setR16Matchups(placeholderMatchups);
          setLoading(false);
          return;
        }

        const managerIds = stats.map((s) => s.manager_id);
        const { data: managersData, error: managersError } = await supabase
          .from('managers')
          .select('manager_id, manager_name, team_name')
          .in('manager_id', managerIds);

        if (managersError) throw managersError;

        const managerMap = new Map((managersData ?? []).map((m) => [m.manager_id, m]));

        const rawItems = stats.map((s) => {
          const mgr = managerMap.get(s.manager_id);
          return {
            manager_id: s.manager_id,
            team: mgr?.team_name ?? `Manager ${s.manager_id}`,
            manager: mgr?.manager_name ?? '-',
            totalPoints: s.total_points ?? 0,
          };
        });

        // Sort by total_points DESC, team_name ASC
        rawItems.sort((a, b) => {
          if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
          return a.team.localeCompare(b.team);
        });

        // Pick top 16 seeds
        const rankedSeeds = new Map<number, CupTeamInfo>();

        rawItems.slice(0, 16).forEach((item, idx) => {
          const seedNumber = idx + 1; // 1-16 seed slot
          rankedSeeds.set(seedNumber, {
            pos: seedNumber,
            team: item.team,
            manager: item.manager,
          });
        });

        // Map seeds to pairings (Seed #1 vs #9, #2 vs #10, etc.)
        const realMatchups: CupMatchup[] = R16_SEED_PAIRS.map(([homeSeed, awaySeed]) => ({
          home: rankedSeeds.get(homeSeed) ?? { pos: homeSeed, team: 'TBD' },
          away: rankedSeeds.get(awaySeed) ?? { pos: awaySeed, team: 'TBD' },
        }));

        setR16Matchups(realMatchups);
      } catch (err) {
        console.error('[useCupPageData] fetchCupData error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        const fallbackMatchups: CupMatchup[] = R16_SEED_PAIRS.map(([homeSeed, awaySeed]) => ({
          home: { pos: homeSeed, team: 'TBD' },
          away: { pos: awaySeed, team: 'TBD' },
        }));
        setR16Matchups(fallbackMatchups);
      } finally {
        setLoading(false);
      }
    }

    fetchCupData();
  }, []);

  return {
    isGw19Finished,
    r16Matchups,
    loading,
    error,
  };
}

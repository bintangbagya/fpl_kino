import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface WeeklyWinner {
  gw: number;
  team: string;
  manager: string;
  score: number;
}

export interface MonthlyWinner {
  phaseId: number;
  phaseName: string;
  startGw: number;
  stopGw: number;
  team: string;
  manager: string;
  score: number;
}

export function useHallOfFameData() {
  const [weeklyWinners, setWeeklyWinners] = useState<WeeklyWinner[]>([]);
  const [monthlyWinners, setMonthlyWinners] = useState<MonthlyWinner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHofData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch finished gameweeks ordered by gw_number ASC
        const { data: finishedGwsData, error: gwError } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number')
          .eq('finished', true)
          .order('gw_number', { ascending: true });

        if (gwError) throw gwError;

        const finishedGwNumbers = (finishedGwsData ?? []).map((g) => g.gw_number);
        const finishedGwSet = new Set(finishedGwNumbers);

        // Fetch Weekly Winners for each finished GW
        if (finishedGwNumbers.length > 0) {
          const { data: statsData, error: statsError } = await supabase
            .from('manager_gameweek_stats')
            .select('manager_id, gw_number, points')
            .in('gw_number', finishedGwNumbers);

          if (statsError) throw statsError;

          // Collect all manager_ids to fetch manager details
          const managerIds = Array.from(new Set((statsData ?? []).map((s) => s.manager_id)));
          let managerMap = new Map<number, { team_name: string; manager_name: string }>();

          if (managerIds.length > 0) {
            const { data: managersData, error: mgrError } = await supabase
              .from('managers')
              .select('manager_id, team_name, manager_name')
              .in('manager_id', managerIds);

            if (mgrError) throw mgrError;
            managerMap = new Map((managersData ?? []).map((m) => [m.manager_id, m]));
          }

          // Group stats by gw_number and find winner per GW
          const weeklyResult: WeeklyWinner[] = [];

          for (const gw of finishedGwNumbers) {
            const gwStats = (statsData ?? []).filter((s) => s.gw_number === gw);
            if (gwStats.length === 0) continue;

            let maxPoints = -1;
            gwStats.forEach((s) => {
              if (s.points > maxPoints) maxPoints = s.points;
            });

            const topStats = gwStats.filter((s) => s.points === maxPoints);
            const topManagers = topStats.map((s) => {
              const mgr = managerMap.get(s.manager_id);
              return {
                manager_id: s.manager_id,
                team: mgr?.team_name ?? `Manager ${s.manager_id}`,
                manager: mgr?.manager_name ?? '-',
              };
            });

            // Tie-breaker: alphabetical by team_name ASC
            topManagers.sort((a, b) => a.team.localeCompare(b.team));
            const winner = topManagers[0];

            if (winner) {
              weeklyResult.push({
                gw,
                team: winner.team,
                manager: winner.manager,
                score: maxPoints,
              });
            }
          }

          setWeeklyWinners(weeklyResult);
        } else {
          setWeeklyWinners([]);
        }

        // 2. Fetch Monthly Winners
        // Query fpl_phases excluding 'Overall' ordered by start_event ASC
        const { data: phasesData, error: phasesError } = await supabase
          .from('fpl_phases')
          .select('phase_id, name, start_event, stop_event')
          .neq('name', 'Overall')
          .order('start_event', { ascending: true });

        if (phasesError) throw phasesError;

        const finishedPhases = (phasesData ?? []).filter((p) => finishedGwSet.has(p.stop_event));

        if (finishedPhases.length > 0) {
          const allPhaseGws: number[] = [];
          finishedPhases.forEach((p) => {
            for (let g = p.start_event; g <= p.stop_event; g++) {
              allPhaseGws.push(g);
            }
          });

          const { data: phaseStatsData, error: phaseStatsError } = await supabase
            .from('manager_gameweek_stats')
            .select('manager_id, gw_number, points')
            .in('gw_number', Array.from(new Set(allPhaseGws)));

          if (phaseStatsError) throw phaseStatsError;

          const phaseMgrIds = Array.from(new Set((phaseStatsData ?? []).map((s) => s.manager_id)));
          let phaseMgrMap = new Map<number, { team_name: string; manager_name: string }>();

          if (phaseMgrIds.length > 0) {
            const { data: phaseMgrsData, error: phaseMgrErr } = await supabase
              .from('managers')
              .select('manager_id, team_name, manager_name')
              .in('manager_id', phaseMgrIds);

            if (phaseMgrErr) throw phaseMgrErr;
            phaseMgrMap = new Map((phaseMgrsData ?? []).map((m) => [m.manager_id, m]));
          }

          const monthlyResult: MonthlyWinner[] = [];

          for (const p of finishedPhases) {
            const rangeStats = (phaseStatsData ?? []).filter(
              (s) => s.gw_number >= p.start_event && s.gw_number <= p.stop_event
            );

            const totalsMap = new Map<number, number>();
            rangeStats.forEach((s) => {
              totalsMap.set(s.manager_id, (totalsMap.get(s.manager_id) || 0) + (s.points || 0));
            });

            let maxPts = -1;
            totalsMap.forEach((pts) => {
              if (pts > maxPts) maxPts = pts;
            });

            const topMgrs: { manager_id: number; team: string; manager: string }[] = [];
            totalsMap.forEach((pts, mId) => {
              if (pts === maxPts) {
                const mgr = phaseMgrMap.get(mId);
                topMgrs.push({
                  manager_id: mId,
                  team: mgr?.team_name ?? `Manager ${mId}`,
                  manager: mgr?.manager_name ?? '-',
                });
              }
            });

            topMgrs.sort((a, b) => a.team.localeCompare(b.team));
            const winner = topMgrs[0];

            if (winner) {
              monthlyResult.push({
                phaseId: p.phase_id,
                phaseName: p.name,
                startGw: p.start_event,
                stopGw: p.stop_event,
                team: winner.team,
                manager: winner.manager,
                score: maxPts,
              });
            }
          }

          setMonthlyWinners(monthlyResult);
        } else {
          setMonthlyWinners([]);
        }
      } catch (err) {
        console.error('[useHallOfFameData] error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchHofData();
  }, []);

  return {
    weeklyWinners,
    monthlyWinners,
    loading,
    error,
  };
}

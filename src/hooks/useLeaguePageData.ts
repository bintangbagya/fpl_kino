import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { StandingRow } from '../data/dummyData';

export interface PhaseInfo {
  phase_id: number;
  name: string;
  start_event: number;
  stop_event: number;
}

export interface ExtendedStandingRow extends StandingRow {
  isPhaseTotal?: boolean;
}

export function useLeaguePageData() {
  const [phases, setPhases] = useState<PhaseInfo[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [selectedGw, setSelectedGw] = useState<number | 'all' | null>(null);
  const [allGws, setAllGws] = useState<number[]>([]);
  const [activeGwNumber, setActiveGwNumber] = useState<number | null>(null);

  const [standings, setStandings] = useState<ExtendedStandingRow[]>([]);
  const [latestFinishedGw, setLatestFinishedGw] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch metadata on mount (phases & gameweek status)
  useEffect(() => {
    async function initMetadata() {
      try {
        // Query fpl_phases excluding Overall (phase_id = 1)
        const { data: phaseData, error: phaseError } = await supabase
          .from('fpl_phases')
          .select('phase_id, name, start_event, stop_event')
          .neq('phase_id', 1)
          .order('start_event', { ascending: true });

        if (phaseError) throw phaseError;
        setPhases(phaseData ?? []);

        // Query fpl_gameweeks to identify active GW and past finished GWs
        const nowIso = new Date().toISOString();
        const { data: gameweeksData, error: gwError } = await supabase
          .from('fpl_gameweeks')
          .select('gw_number, is_current, finished, deadline_time')
          .lte('deadline_time', nowIso)
          .order('gw_number', { ascending: false });

        if (gwError) throw gwError;

        const gws: number[] = [];
        let actGw: number | null = null;
        let finGw: number | null = null;

        (gameweeksData ?? []).forEach((g) => {
          gws.push(g.gw_number);
          if ((g.is_current === true || g.finished === false) && actGw === null) {
            actGw = g.gw_number;
          }
          if (g.finished === true && finGw === null) {
            finGw = g.gw_number;
          }
        });

        setAllGws(gws);
        setActiveGwNumber(actGw ?? (gws.length > 0 ? gws[0] : null));
        setLatestFinishedGw(finGw);
      } catch (err) {
        console.error('[useLeaguePageData] initMetadata error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    initMetadata();
  }, []);

  // Compute selected phase object
  const selectedPhase = useMemo(() => {
    if (selectedPhaseId === null) return null;
    return phases.find((p) => p.phase_id === selectedPhaseId) ?? null;
  }, [phases, selectedPhaseId]);

  // Compute cascading GW options for the selected phase
  const availableGwsForPhase = useMemo(() => {
    if (!selectedPhase) return [];
    return allGws
      .filter((gw) => gw >= selectedPhase.start_event && gw <= selectedPhase.stop_event)
      .sort((a, b) => a - b);
  }, [selectedPhase, allGws]);

  // Compute showQualificationZone rule
  const showQualificationZone = useMemo(() => {
    if (selectedPhaseId !== null) return false;
    if (selectedGw !== null && selectedGw !== 'all') return false;
    if (latestFinishedGw === null) return true;
    return latestFinishedGw <= 19;
  }, [selectedPhaseId, selectedGw, latestFinishedGw]);

  // Compute active filter label string
  const activeFilterLabel = useMemo(() => {
    if (!selectedPhaseId || !selectedPhase) {
      if (selectedGw && typeof selectedGw === 'number') {
        return `Gameweek ${selectedGw}`;
      }
      return 'Season Overview';
    }

    if (selectedGw === 'all' || selectedGw === null) {
      return `${selectedPhase.name} — Full Month`;
    }

    return `${selectedPhase.name} — GW${selectedGw}`;
  }, [selectedPhaseId, selectedPhase, selectedGw]);

  // 2. Main Standings Query — Refactored to eliminate double counting
  useEffect(() => {
    async function fetchStandings(isInitial = true) {
      if (isInitial) {
        setLoading(true);
      }
      setError(null);
      try {
        // ── STATE 2: Month selected, GW is 'all' or null ("Full Month") ──────
        if (selectedPhase && (selectedGw === 'all' || selectedGw === null)) {
          const startEvt = selectedPhase.start_event;
          const stopEvt = selectedPhase.stop_event;
          const currentActive = activeGwNumber;

          const monthlyPointsMap: Record<number, number> = {};

          // 2A. Query finished GWs strictly in manager_gameweek_stats (gw_number < activeGwNumber)
          // To prevent double counting, exclude any active GW rows from stats
          let statsQuery = supabase
            .from('manager_gameweek_stats')
            .select('manager_id, gw_number, points, event_transfers_cost')
            .gte('gw_number', startEvt)
            .lte('gw_number', stopEvt);

          if (currentActive !== null) {
            statsQuery = statsQuery.lt('gw_number', currentActive);
          }

          const { data: statsData, error: statsErr } = await statsQuery;
          if (statsErr) throw statsErr;

          (statsData ?? []).forEach((s) => {
            const netPts = (s.points ?? 0) - (s.event_transfers_cost ?? 0);
            monthlyPointsMap[s.manager_id] = (monthlyPointsMap[s.manager_id] || 0) + netPts;
          });

          // 2B. If current active GW is within this phase range, add live_gw_points from v_live_manager_standings
          if (
            currentActive !== null &&
            currentActive >= startEvt &&
            currentActive <= stopEvt
          ) {
            const { data: liveData, error: liveErr } = await supabase
              .from('v_live_manager_standings')
              .select('manager_id, live_gw_points, team_name, manager_name');

            if (liveErr) throw liveErr;

            (liveData ?? []).forEach((row) => {
              monthlyPointsMap[row.manager_id] =
                (monthlyPointsMap[row.manager_id] || 0) + (row.live_gw_points ?? 0);
            });
          }

          const managerIds = Object.keys(monthlyPointsMap).map(Number);
          if (managerIds.length === 0) {
            setStandings([]);
            setLoading(false);
            return;
          }

          // Fetch manager profiles (team_name, manager_name)
          const { data: managersData, error: mgrErr } = await supabase
            .from('managers')
            .select('manager_id, manager_name, team_name')
            .in('manager_id', managerIds);

          if (mgrErr) throw mgrErr;

          const managerMap = new Map((managersData ?? []).map((m) => [m.manager_id, m]));

          const rawItems = managerIds.map((id) => {
            const mgr = managerMap.get(id);
            return {
              manager_id: id,
              team: mgr?.team_name ?? `Manager ${id}`,
              manager: mgr?.manager_name ?? '-',
              monthlyTotal: monthlyPointsMap[id] ?? 0,
            };
          });

          // Sort by monthlyTotal DESC, team_name ASC
          rawItems.sort((a, b) => {
            if (b.monthlyTotal !== a.monthlyTotal) return b.monthlyTotal - a.monthlyTotal;
            return a.team.localeCompare(b.team);
          });

          let currentRank = 1;
          const rows: ExtendedStandingRow[] = rawItems.map((item, idx) => {
            if (idx > 0) {
              const prev = rawItems[idx - 1];
              if (item.monthlyTotal !== prev.monthlyTotal) {
                currentRank = idx + 1;
              }
            }
            return {
              pos: currentRank,
              team: item.team,
              manager: item.manager,
              gw: item.monthlyTotal,
              tot: item.monthlyTotal,
              isPhaseTotal: true,
            };
          });

          setStandings(rows);
        }
        // ── STATE 3: Specific single GW selected ────────────────────────────
        else if (selectedGw && typeof selectedGw === 'number') {
          const isTargetActive = activeGwNumber !== null && selectedGw === activeGwNumber;

          // 3A. Single Active GW -> Query public.v_live_manager_standings
          if (isTargetActive) {
            const { data: liveData, error: liveErr } = await supabase
              .from('v_live_manager_standings')
              .select('live_rank, team_name, manager_name, live_gw_points, live_total_points, gw_number');

            if (liveErr) throw liveErr;

            // Sort by live_gw_points DESC, team_name ASC for single active GW view
            const sorted = [...(liveData ?? [])].sort((a, b) => {
              if ((b.live_gw_points ?? 0) !== (a.live_gw_points ?? 0)) {
                return (b.live_gw_points ?? 0) - (a.live_gw_points ?? 0);
              }
              return (a.team_name ?? '').localeCompare(b.team_name ?? '');
            });

            let currentRank = 1;
            const rows: ExtendedStandingRow[] = sorted.map((item, idx) => {
              if (idx > 0) {
                const prev = sorted[idx - 1];
                if ((item.live_gw_points ?? 0) !== (prev.live_gw_points ?? 0)) {
                  currentRank = idx + 1;
                }
              }
              return {
                pos: currentRank,
                team: item.team_name ?? '-',
                manager: item.manager_name ?? '-',
                gw: item.live_gw_points ?? 0,
                tot: item.live_total_points ?? 0,
                gwNumber: selectedGw,
              };
            });

            setStandings(rows);
          }
          // 3B. Single Finished Past GW -> Query manager_gameweek_stats
          else {
            const { data: stats, error: statsError } = await supabase
              .from('manager_gameweek_stats')
              .select('manager_id, gw_number, points, event_transfers_cost, total_points')
              .eq('gw_number', selectedGw);

            if (statsError) throw statsError;

            if (!stats || stats.length === 0) {
              setStandings([]);
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
              const netPts = (s.points ?? 0) - (s.event_transfers_cost ?? 0);
              return {
                manager_id: s.manager_id,
                team: mgr?.team_name ?? `Manager ${s.manager_id}`,
                manager: mgr?.manager_name ?? '-',
                gwPoints: netPts,
                totalPoints: s.total_points ?? 0,
              };
            });

            rawItems.sort((a, b) => {
              if (b.gwPoints !== a.gwPoints) return b.gwPoints - a.gwPoints;
              return a.team.localeCompare(b.team);
            });

            let currentRank = 1;
            const rows: ExtendedStandingRow[] = rawItems.map((item, idx) => {
              if (idx > 0) {
                const prev = rawItems[idx - 1];
                if (item.gwPoints !== prev.gwPoints) {
                  currentRank = idx + 1;
                }
              }
              return {
                pos: currentRank,
                team: item.team,
                manager: item.manager,
                gw: item.gwPoints,
                tot: item.totalPoints,
                gwNumber: selectedGw,
              };
            });

            setStandings(rows);
          }
        }
        // ── STATE 1: Season Overview (No filter) -> Query public.v_live_manager_standings ──
        else {
          const { data: liveData, error: liveErr } = await supabase
            .from('v_live_manager_standings')
            .select('live_rank, team_name, manager_name, live_gw_points, live_total_points, gw_number')
            .order('live_rank', { ascending: true });

          if (liveErr) throw liveErr;

          const rows: ExtendedStandingRow[] = (liveData ?? []).map((row, idx) => ({
            pos: row.live_rank ?? (idx + 1),
            team: row.team_name ?? '-',
            manager: row.manager_name ?? '-',
            gw: row.live_gw_points ?? 0,
            tot: row.live_total_points ?? 0,
            gwNumber: row.gw_number,
          }));

          setStandings(rows);
        }
      } catch (err) {
        console.error('[useLeaguePageData] fetchStandings error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStandings(true);

    // Auto-refresh / polling per 30 detik
    const intervalId = setInterval(() => {
      fetchStandings(false);
    }, 30000);

    // Supabase Realtime channel subscription
    const channel = supabase
      .channel('league-page-standings-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_gameweek_live' },
        () => fetchStandings(false)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'manager_gameweek_stats' },
        () => fetchStandings(false)
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [selectedPhaseId, selectedGw, selectedPhase, latestFinishedGw, allGws, activeGwNumber]);

  // Handler to change Month
  const handleSelectPhase = (phaseId: number | null) => {
    setSelectedPhaseId(phaseId);
    if (phaseId === null) {
      setSelectedGw(null);
    } else {
      setSelectedGw('all');
    }
  };

  // Handler to reset all filters
  const resetFilters = () => {
    setSelectedPhaseId(null);
    setSelectedGw(null);
  };

  return {
    phases,
    selectedPhaseId,
    selectedPhase,
    setSelectedPhaseId: handleSelectPhase,
    availableGwsForPhase,
    selectedGw,
    setSelectedGw,
    allGws,
    activeFilterLabel,
    showQualificationZone,
    latestFinishedGw,
    resetFilters,
    standings,
    loading,
    error,
  };
}

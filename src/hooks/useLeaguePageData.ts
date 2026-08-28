import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { StandingRow } from '../data/dummyData';

export function useLeaguePageData() {
  const [availableGws, setAvailableGws] = useState<number[]>([]);
  const [selectedGw, setSelectedGw] = useState<number | null>(null);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch semua GW yang tersedia di manager_gameweek_stats
  useEffect(() => {
    async function fetchAvailableGws() {
      try {
        const { data, error: gwError } = await supabase
          .from('manager_gameweek_stats')
          .select('gw_number')
          .order('gw_number', { ascending: false });

        if (gwError) throw gwError;

        // Deduplicate
        const uniqueGws = [...new Set((data ?? []).map((r) => r.gw_number))];
        setAvailableGws(uniqueGws);

        // Default ke GW terbaru
        if (uniqueGws.length > 0) {
          setSelectedGw(uniqueGws[0]);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('[useLeaguePageData] fetchAvailableGws error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    fetchAvailableGws();
  }, []);

  // 2. Fetch standings setiap kali selectedGw berubah
  useEffect(() => {
    if (selectedGw === null) return;

    async function fetchStandings() {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats untuk GW yang dipilih
        const { data: stats, error: statsError } = await supabase
          .from('manager_gameweek_stats')
          .select('manager_id, gw_number, points, total_points, rank')
          .eq('gw_number', selectedGw)
          .order('total_points', { ascending: false });

        if (statsError) throw statsError;

        if (!stats || stats.length === 0) {
          setStandings([]);
          setLoading(false);
          return;
        }

        // Fetch managers info
        const managerIds = stats.map((s) => s.manager_id);
        const { data: managersData, error: managersError } = await supabase
          .from('managers')
          .select('manager_id, manager_name, team_name')
          .in('manager_id', managerIds);

        if (managersError) throw managersError;

        const managerMap = new Map(
          (managersData ?? []).map((m) => [m.manager_id, m])
        );

        const rows: StandingRow[] = stats.map((row, idx) => {
          const mgr = managerMap.get(row.manager_id);
          return {
            pos: idx + 1,
            team: mgr?.team_name ?? `Manager ${row.manager_id}`,
            manager: mgr?.manager_name ?? '-',
            gw: row.points ?? 0,
            tot: row.total_points ?? 0,
            gwNumber: row.gw_number,
          };
        });

        setStandings(rows);
      } catch (err) {
        console.error('[useLeaguePageData] fetchStandings error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, [selectedGw]);

  return {
    standings,
    availableGws,
    selectedGw,
    setSelectedGw,
    loading,
    error,
  };
}

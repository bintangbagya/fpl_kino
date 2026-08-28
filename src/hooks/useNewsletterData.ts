import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// ─── Types (re-exported for NewsletterPage) ───────────────────────────────────
export interface NewsletterStory {
  id: number;
  gw_number: number;
  edition_date: string;
  story_order: number;
  story_id: string;
  category: string;
  emoji: string;
  title: string;
  hook: string;
  description: string;
  is_hero: boolean;
  stats: { label: string; value: string }[] | null;
}

export interface NewsletterGwData {
  gwNumber: number;
  editionLabel: string;
  stories: NewsletterStory[];
}

interface UseNewsletterDataReturn {
  availableGws: number[];
  selectedGw: number | null;
  setSelectedGw: (gw: number) => void;
  gwData: NewsletterGwData | null;
  loading: boolean;
  error: string | null;
}

export function useNewsletterData(): UseNewsletterDataReturn {
  const [availableGws, setAvailableGws] = useState<number[]>([]);
  const [selectedGw, setSelectedGw] = useState<number | null>(null);
  const [gwData, setGwData] = useState<NewsletterGwData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Fetch distinct GWs that have editions
  useEffect(() => {
    async function fetchAvailableGws() {
      try {
        const { data, error: edErr } = await supabase
          .from('newsletter_editions')
          .select('gw_number')
          .order('gw_number', { ascending: false });

        if (edErr) throw edErr;

        const uniqueGws = [...new Set((data ?? []).map((e) => e.gw_number as number))];
        setAvailableGws(uniqueGws);

        if (uniqueGws.length > 0) {
          setSelectedGw(uniqueGws[0]);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('[useNewsletterData] fetchAvailableGws error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }
    fetchAvailableGws();
  }, []);

  // Step 2: Fetch stories for the selected GW (latest edition date for this GW)
  useEffect(() => {
    if (selectedGw === null) return;

    async function fetchGwData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch latest edition info for this GW
        const { data: edData } = await supabase
          .from('newsletter_editions')
          .select('edition_date, edition_label')
          .eq('gw_number', selectedGw!)
          .order('edition_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        const latestDate = edData?.edition_date;

        let query = supabase
          .from('newsletter_stories')
          .select('*')
          .eq('gw_number', selectedGw!)
          .order('story_order', { ascending: true });

        if (latestDate) {
          query = query.eq('edition_date', latestDate);
        }

        const { data: storiesData, error: storiesErr } = await query;

        if (storiesErr) throw storiesErr;

        setGwData({
          gwNumber: selectedGw!,
          editionLabel: edData?.edition_label ?? `Gameweek ${selectedGw}`,
          stories: storiesData ?? [],
        });
      } catch (err) {
        console.error('[useNewsletterData] fetchGwData error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchGwData();
  }, [selectedGw]);

  return {
    availableGws,
    selectedGw,
    setSelectedGw,
    gwData,
    loading,
    error,
  };
}

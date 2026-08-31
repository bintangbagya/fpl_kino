import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// ─── Types (re-exported for NewsletterPage) ───────────────────────────────────
export interface NewsletterStory {
  id: number | string;
  gw_number: number;
  update_id?: string;
  matchday_key?: string;
  matchday_label?: string;
  matchday_date?: string;
  status?: 'PROVISIONAL' | 'FINAL';
  edition_date: string;
  story_order: number;
  story_id: string;
  category: string;
  emoji: string;
  title: string;
  hook: string;
  description: string;
  is_hero: boolean;
  image_url?: string | null;
  stats: { label: string; value: string }[] | null;
}

export interface MatchdayOption {
  key: string;          // e.g. "all", "2026-08-29", "final"
  label: string;        // e.g. "All Updates", "Saturday, 29 Aug", "Final Review"
  date?: string;        // e.g. "2026-08-29"
  status?: 'PROVISIONAL' | 'FINAL';
}

export interface NewsletterUpdate {
  updateId: string;
  matchdayKey: string;
  matchdayLabel: string;
  matchdayDate: string;
  status: 'PROVISIONAL' | 'FINAL';
  publishedAt: string;
  summary: string;
  stories: NewsletterStory[];
}

export interface NewsletterGwData {
  gwNumber: number;
  editionLabel: string;
  isGwFinished: boolean;
  availableMatchdays: MatchdayOption[];
  updates: NewsletterUpdate[];
  stories: NewsletterStory[];
}

interface UseNewsletterDataReturn {
  availableGws: number[];
  selectedGw: number | null;
  setSelectedGw: (gw: number) => void;
  selectedMatchday: string;
  setSelectedMatchday: (matchdayKey: string) => void;
  gwData: NewsletterGwData | null;
  filteredUpdates: NewsletterUpdate[];
  filteredStories: NewsletterStory[];
  loading: boolean;
  error: string | null;
}

// ─── Fallback / Rich Mock Data for Multiple Updates per GW ────────────────────
const MOCK_MULTI_UPDATE_DATA: Record<number, NewsletterGwData> = {
  3: {
    gwNumber: 3,
    editionLabel: 'GW3 – Edisi Live & Review Liga FPL Kino',
    isGwFinished: false,
    availableMatchdays: [
      { key: 'all', label: 'All Updates' },
      { key: '2026-08-29', label: 'Saturday, 29 Aug', date: '2026-08-29', status: 'PROVISIONAL' },
      { key: '2026-08-30', label: 'Sunday, 30 Aug', date: '2026-08-30', status: 'PROVISIONAL' },
      { key: '2026-09-01', label: 'Tuesday, 1 Sep', date: '2026-09-01', status: 'PROVISIONAL' },
      { key: 'final', label: 'Final Review', date: '2026-09-02', status: 'FINAL' },
    ],
    updates: [
      {
        updateId: 'GW3_UPD_SAT',
        matchdayKey: '2026-08-29',
        matchdayLabel: 'Saturday, 29 Aug Update',
        matchdayDate: '2026-08-29',
        status: 'PROVISIONAL',
        publishedAt: '29 Aug 2026, 23:30',
        summary: 'Hasil sementara pertandingan Sabtu. Klasemen dan perolehan poin masih dapat berubah seiring sisa pertandingan Gameweek 3.',
        stories: [
          {
            id: 301,
            gw_number: 3,
            update_id: 'GW3_UPD_SAT',
            matchday_key: '2026-08-29',
            matchday_label: 'Saturday, 29 Aug',
            status: 'PROVISIONAL',
            edition_date: '2026-08-29',
            story_order: 1,
            story_id: 'GW3_SAT_HERO',
            category: '🔥 GW3 • SATURDAY LIVE RECAP',
            emoji: '⚔️',
            title: 'SABTU MEMANAS: DOPAMINE MEMIMPIN SEMENTARA',
            hook: 'Performa meledak lini depan Dopamine mengguncang Sabtu malam.',
            description: 'Dopamine memimpin perolehan sementara hari Sabtu dengan 64 poin dari 6 pemain. Namun persaingan masih belum usai karena tim-tim unggulan baru akan bermain di hari Minggu.',
            is_hero: true,
            image_url: null,
            stats: [
              { label: 'Poin Sementara', value: '64 pts' },
              { label: 'Pemain Sisa', value: '5 pemain' },
              { label: 'Status GW', value: 'LIVE' },
            ],
          },
          {
            id: 302,
            gw_number: 3,
            update_id: 'GW3_UPD_SAT',
            matchday_key: '2026-08-29',
            matchday_label: 'Saturday, 29 Aug',
            status: 'PROVISIONAL',
            edition_date: '2026-08-29',
            story_order: 2,
            story_id: 'GW3_SAT_BENCH',
            category: '💀 GW3 • BENCH DRAMA',
            emoji: '🛋️',
            title: '15 POIN BANJIR DI BANGKU CADANGAN ERICK FC',
            hook: 'Dua pemain cadangan panen clean sheet sementara kiper utama kebobolan.',
            description: 'Penyesalan Sabtu malam terjadi ketika Erick FC menyisakan 15 poin di bench, sementara starting XI berjuang keras hanya mengumpulkan 28 poin.',
            is_hero: false,
            image_url: null,
            stats: [
              { label: 'Poin Bench', value: '15 pts' },
              { label: 'Status', value: 'PROVISIONAL' },
            ],
          },
        ],
      },
      {
        updateId: 'GW3_UPD_SUN',
        matchdayKey: '2026-08-30',
        matchdayLabel: 'Sunday, 30 Aug Update',
        matchdayDate: '2026-08-30',
        status: 'PROVISIONAL',
        publishedAt: '30 Aug 2026, 23:45',
        summary: 'Diperbarui setelah pertandingan Minggu selesai. Perubahan peta persaingan papan atas terjadi secara mendadak.',
        stories: [
          {
            id: 303,
            gw_number: 3,
            update_id: 'GW3_UPD_SUN',
            matchday_key: '2026-08-30',
            matchday_label: 'Sunday, 30 Aug',
            status: 'PROVISIONAL',
            edition_date: '2026-08-30',
            story_order: 1,
            story_id: 'GW3_SUN_HERO',
            category: '🎯 GW3 • SUNDAY CAPTAIN IMPACT',
            emoji: '👑',
            title: 'KAPTEN SALAH MENGUBAH TAKHTA SEMENTARA',
            hook: 'Dua gol dan dua bonus poin membawa perubahan signifikan di klasemen sementara.',
            description: 'Hari Minggu menjadi milik manager pembawa kapten Salah. Posisi puncak klasemen sementara berpindah tangan seiring meledaknya performa pemain Liverpool tersebut.',
            is_hero: true,
            image_url: null,
            stats: [
              { label: 'Kapten Poin', value: '32 pts' },
              { label: 'Rank Shift', value: '+4 Posisi' },
            ],
          },
        ],
      },
      {
        updateId: 'GW3_UPD_FINAL',
        matchdayKey: 'final',
        matchdayLabel: 'Final Review',
        matchdayDate: '2026-09-02',
        status: 'FINAL',
        publishedAt: '2 Sep 2026, 08:00',
        summary: 'Ulasan resmi dan hasil akhir Gameweek 3 setelah seluruh pertandingan disahkan.',
        stories: [
          {
            id: 304,
            gw_number: 3,
            update_id: 'GW3_UPD_FINAL',
            matchday_key: 'final',
            matchday_label: 'Final Review',
            status: 'FINAL',
            edition_date: '2026-09-02',
            story_order: 1,
            story_id: 'GW3_FINAL_HERO',
            category: '🏆 GW3 • FINAL REVIEW & CHAMPION',
            emoji: '🥇',
            title: 'FAZLUN RESMI KUNCI TAKHTA GAMEWEEK 3',
            hook: 'Kemenangan dramatis dengan keunggulan 3 poin di menit akhir.',
            description: 'Setelah seluruh pertandingan Gameweek 3 resmi berakhir, Fazlun Febriansyah mengamankan posisi #1 dengan total 98 poin. Ini mengonfirmasi gelar Manager of the Week Gameweek 3.',
            is_hero: true,
            image_url: null,
            stats: [
              { label: 'Poin Akhir', value: '98 pts' },
              { label: 'Juara GW', value: 'Fazlun Febriansyah' },
              { label: 'Status', value: 'FINAL' },
            ],
          },
        ],
      },
    ],
    stories: [],
  },
  2: {
    gwNumber: 2,
    editionLabel: 'GW2 – Edisi Resmi Liga FPL Kino',
    isGwFinished: false,
    availableMatchdays: [
      { key: 'all', label: 'All Updates' },
      { key: '2026-08-29', label: 'Saturday, 29 Aug', date: '2026-08-29', status: 'PROVISIONAL' },
      { key: 'final', label: 'Final Review', date: '2026-08-30', status: 'PROVISIONAL' },
    ],
    updates: [
      {
        updateId: 'GW2_UPD_LIVE',
        matchdayKey: '2026-08-29',
        matchdayLabel: 'Saturday, 29 Aug Update',
        matchdayDate: '2026-08-29',
        status: 'PROVISIONAL',
        publishedAt: '29 Aug 2026, 22:00',
        summary: 'Pembaruan sementara Gameweek 2. Posisi klasemen bersifat sementara dan masih dapat berubah.',
        stories: [
          {
            id: 201,
            gw_number: 2,
            update_id: 'GW2_UPD_LIVE',
            matchday_key: '2026-08-29',
            matchday_label: 'Saturday, 29 Aug',
            status: 'PROVISIONAL',
            edition_date: '2026-08-29',
            story_order: 1,
            story_id: 'GW2_TITLE_SHIFT',
            category: '🏆 GW2 • TITLE RACE SHIFT',
            emoji: '👑',
            title: 'FAZLUN FEBRIANSYAH SEMENTARA REBUT TAKHTA KLASEMEN',
            hook: 'Pergeseran pimpinan liga terjadi di Gameweek 2 dengan keunggulan +24 poin.',
            description: 'Fazlun Febriansyah sementara menduduki posisi #1 klasemen liga dengan total 98 poin, menggeser Desta Arya Nugraha. Posisi ini masih dapat berubah karena beberapa pertandingan belum selesai.',
            is_hero: true,
            image_url: null,
            stats: [
              { label: 'Leader Baru', value: 'Fazlun Febriansyah' },
              { label: 'Total Poin', value: '98 pts' },
              { label: 'Selisih', value: '+24 pts' },
              { label: 'Status', value: 'PROVISIONAL' },
            ],
          },
        ],
      },
    ],
    stories: [],
  },
  1: {
    gwNumber: 1,
    editionLabel: 'GW1 – Edisi Pembuka Liga FPL Kino',
    isGwFinished: true,
    availableMatchdays: [
      { key: 'all', label: 'All Updates' },
      { key: 'final', label: 'Final Review', date: '2026-08-22', status: 'FINAL' },
    ],
    updates: [
      {
        updateId: 'GW1_UPD_FINAL',
        matchdayKey: 'final',
        matchdayLabel: 'Final Review',
        matchdayDate: '2026-08-22',
        status: 'FINAL',
        publishedAt: '22 Aug 2026, 10:00',
        summary: 'Hasil resmi Gameweek 1 pembuka musim FPL Kino Hub.',
        stories: [
          {
            id: 101,
            gw_number: 1,
            update_id: 'GW1_UPD_FINAL',
            matchday_key: 'final',
            matchday_label: 'Final Review',
            status: 'FINAL',
            edition_date: '2026-08-22',
            story_order: 1,
            story_id: 'GW1_CHAMPION',
            category: '🏆 GW1 • SEASON OPENER CHAMPION',
            emoji: '🥇',
            title: 'DESTA ARYA NUGRAHA MEREBUT MAHKOTA GAMEWEEK 1',
            hook: 'Performa impresif 74 poin menjadi tolok ukur tertinggi pembuka musim.',
            description: 'Desta Arya Nugraha dengan tim "tarikmang" resmi menjadi Manager of the Week pembuka musim dengan perolehan 74 poin.',
            is_hero: true,
            image_url: null,
            stats: [
              { label: 'GW Points', value: '74 pts' },
              { label: 'Juara GW', value: 'Desta Arya Nugraha' },
              { label: 'Status', value: 'FINAL' },
            ],
          },
        ],
      },
    ],
    stories: [],
  },
};

// Fill `stories` array on MOCK_MULTI_UPDATE_DATA for convenience
Object.values(MOCK_MULTI_UPDATE_DATA).forEach((gwObj) => {
  gwObj.stories = gwObj.updates.flatMap((u) => u.stories);
});

export function useNewsletterData(): UseNewsletterDataReturn {
  const [availableGws, setAvailableGws] = useState<number[]>([2, 1]);
  const [selectedGw, setSelectedGw] = useState<number | null>(2);
  const [selectedMatchday, setSelectedMatchday] = useState<string>('all');
  const [gwData, setGwData] = useState<NewsletterGwData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync selectedGw & selectedMatchday with URL search params if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const gwParam = params.get('gw');
      const mdParam = params.get('matchday');

      if (gwParam && !isNaN(Number(gwParam))) {
        const parsedGw = Number(gwParam);
        setSelectedGw(parsedGw);
      }
      if (mdParam) {
        setSelectedMatchday(mdParam);
      }
    }
  }, []);

  // Helper to sync URL search params when state changes
  const updateUrlParams = (gw: number | null, matchday: string) => {
    if (typeof window !== 'undefined' && gw !== null) {
      const url = new URL(window.location.href);
      url.searchParams.set('gw', String(gw));
      url.searchParams.set('matchday', matchday);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Step 1: Fetch distinct GWs from database (or fallback)
  useEffect(() => {
    async function fetchAvailableGws() {
      try {
        const { data, error: edErr } = await supabase
          .from('newsletters')
          .select('gw_number')
          .order('gw_number', { ascending: false });

        if (edErr) throw edErr;

        let uniqueGws = [...new Set((data ?? []).map((e) => e.gw_number as number))];
        if (uniqueGws.length === 0) {
          uniqueGws = [2, 1];
        }

        // Include 0 (Semua GW) at beginning, followed by GW numbers descending (2, 1)
        const gwNums = [...new Set([...uniqueGws, 2, 1])].sort((a, b) => b - a);
        const sortedGws = [0, ...gwNums];
        setAvailableGws(sortedGws);

        if (selectedGw === null && sortedGws.length > 0) {
          setSelectedGw(sortedGws[1] || 2);
        }
      } catch (err) {
        console.error('[useNewsletterData] fetchAvailableGws error:', err);
        setAvailableGws([0, 2, 1]);
        if (selectedGw === null) setSelectedGw(2);
      }
    }
    fetchAvailableGws();
  }, []);

  // Step 2: Fetch GW Data for selected GW (or 0 for Semua GW)
  useEffect(() => {
    if (selectedGw === null) return;

    async function fetchGwData() {
      setLoading(true);
      setError(null);
      try {
        // Query database newsletters table
        let query = supabase.from('newsletters').select('*');
        if (selectedGw && selectedGw > 0) {
          query = query.eq('gw_number', selectedGw);
        }
        const { data: newslettersData } = await query
          .order('gw_number', { ascending: false })
          .order('created_at', { ascending: false });

        let isFinished = true;
        if (selectedGw && selectedGw > 0) {
          const { data: gwInfo } = await supabase
            .from('fpl_gameweeks')
            .select('finished')
            .eq('gw_number', selectedGw)
            .maybeSingle();
          isFinished = gwInfo?.finished ?? (selectedGw === 1);
        }

        if (newslettersData && newslettersData.length > 0) {
          // Map public.newsletters records into NewsletterStory items
          const mappedStories: NewsletterStory[] = newslettersData.map((row, idx) => {
            const tagList = Array.isArray(row.tags) ? row.tags : [];
            const primaryTag = tagList.length > 0 ? tagList[0] : 'RECAP';
            const createdDate = row.created_at ? row.created_at.split('T')[0] : '2026-08-30';

            let emoji = '📰';
            if (tagList.includes('MVP') || tagList.includes('Top Scorer') || row.title.toLowerCase().includes('bruno') || row.title.toLowerCase().includes('cherki')) emoji = '⚡';
            else if (tagList.includes('Captain') || tagList.includes('Strategy') || row.title.toLowerCase().includes('kudeta')) emoji = '🎯';
            else if (tagList.includes('Banter') || tagList.includes('Transfer') || tagList.includes('ChipReview') || row.title.toLowerCase().includes('transfer') || row.title.toLowerCase().includes('chip')) emoji = '🎭';
            else if (tagList.includes('Preview') || tagList.includes('Watchlist')) emoji = '🔮';
            else if (tagList.includes('Recap') || tagList.includes('Standings') || row.title.toLowerCase().includes('klasemen') || row.title.toLowerCase().includes('kuasai')) emoji = '🏆';

            return {
              id: row.id,
              gw_number: row.gw_number,
              update_id: `GW${row.gw_number}_MD${row.matchday_number ?? 1}`,
              matchday_key: `MD${row.matchday_number ?? 1}`,
              matchday_label: `Matchday ${row.matchday_number ?? 1}`,
              status: isFinished ? 'FINAL' : 'PROVISIONAL',
              edition_date: createdDate,
              story_order: idx + 1,
              story_id: `news_${row.id}`,
              category: `GW${row.gw_number} • ${primaryTag.toUpperCase()}`,
              emoji,
              title: row.title,
              hook: row.summary || '',
              description: row.content,
              is_hero: idx === 0,
              stats: null,
            };
          });

          const uniqueMatchdays = [...new Set(mappedStories.map((s) => s.matchday_key || 'MD1'))].sort((a, b) => {
            const numA = Number(a.replace('MD', '')) || 0;
            const numB = Number(b.replace('MD', '')) || 0;
            return numA - numB;
          });
          const availableMatchdaysOpts: MatchdayOption[] = [{ key: 'all', label: 'All Updates' }];

          uniqueMatchdays.forEach((key) => {
            const mdNum = key.replace('MD', '');
            availableMatchdaysOpts.push({
              key,
              label: `MD${mdNum}`,
              status: isFinished ? 'FINAL' : 'PROVISIONAL',
            });
          });

          const singleUpdate: NewsletterUpdate = {
            updateId: `GW${selectedGw}_UPD_1`,
            matchdayKey: 'MD1',
            matchdayLabel: 'Matchday 1',
            matchdayDate: '2026-08-30',
            status: isFinished ? 'FINAL' : 'PROVISIONAL',
            publishedAt: new Date().toLocaleDateString('id-ID'),
            summary: 'Publikasi artikel resmi Liga FPL Kino.',
            stories: mappedStories,
          };

          setGwData({
            gwNumber: selectedGw || 0,
            editionLabel: selectedGw === 0 ? 'Semua Gameweek – Edisi Lengkap FPL Kino' : `GW${selectedGw} – Edisi Resmi Liga FPL Kino`,
            isGwFinished: isFinished,
            availableMatchdays: availableMatchdaysOpts,
            updates: [singleUpdate],
            stories: mappedStories,
          });
        } else {
          // Empty Data
          setGwData({
            gwNumber: selectedGw || 0,
            editionLabel: selectedGw === 0 ? 'Semua Gameweek – Edisi Lengkap FPL Kino' : `GW${selectedGw} – Edisi Liga FPL Kino`,
            isGwFinished: isFinished,
            availableMatchdays: [{ key: 'all', label: 'All Updates' }],
            updates: [],
            stories: [],
          });
        }
      } catch (err) {
        console.error('[useNewsletterData] fetchGwData error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setGwData({
          gwNumber: selectedGw || 0,
          editionLabel: selectedGw === 0 ? 'Semua Gameweek – Edisi Lengkap FPL Kino' : `GW${selectedGw} – Edisi Liga FPL Kino`,
          isGwFinished: true,
          availableMatchdays: [{ key: 'all', label: 'All Updates' }],
          updates: [],
          stories: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGwData();
  }, [selectedGw]);

  // Handle GW Change: Auto-reset Matchday selection to 'all' if invalid
  const handleSetSelectedGw = (gw: number) => {
    setSelectedGw(gw);
    const targetGwData = MOCK_MULTI_UPDATE_DATA[gw] || gwData;
    const validMatchdays = targetGwData?.availableMatchdays?.map((m) => m.key) || ['all'];

    if (!validMatchdays.includes(selectedMatchday)) {
      setSelectedMatchday('all');
      updateUrlParams(gw, 'all');
    } else {
      updateUrlParams(gw, selectedMatchday);
    }
  };

  // Handle Matchday Change
  const handleSetSelectedMatchday = (matchdayKey: string) => {
    setSelectedMatchday(matchdayKey);
    updateUrlParams(selectedGw, matchdayKey);
  };

  // Compute Filtered Updates & Stories based on selectedMatchday
  const filteredStories = (gwData?.stories ?? []).filter((story) => {
    if (!selectedMatchday || selectedMatchday === 'all') return true;
    return (
      story.matchday_key === selectedMatchday ||
      story.matchday_key === `MD${selectedMatchday}` ||
      story.matchday_key === selectedMatchday.replace('MD', '')
    );
  });

  const filteredUpdates = (gwData?.updates ?? []).filter((u) => {
    if (!selectedMatchday || selectedMatchday === 'all') return true;
    return u.matchdayKey === selectedMatchday;
  });

  return {
    availableGws,
    selectedGw,
    setSelectedGw: handleSetSelectedGw,
    selectedMatchday,
    setSelectedMatchday: handleSetSelectedMatchday,
    gwData,
    filteredUpdates,
    filteredStories,
    loading,
    error,
  };
}

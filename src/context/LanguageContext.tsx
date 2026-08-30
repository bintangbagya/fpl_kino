import React, { createContext, useContext, useState } from 'react';

export type Language = 'id' | 'en';

export interface Translations {
  // Sidebar & Navigation
  navHome: string;
  navLeague: string;
  navCup: string;
  navPrizePool: string;
  navHallOfFame: string;
  navNewsletter: string;

  // GW Stats Card
  averageScore: string;
  highestScore: string;
  mostCaptained: string;
  nextDeadline: string;
  gwStats: string;

  // Standings Table & Filters
  rank: string;
  teamAndManager: string;
  gwPts: string;
  totalPts: string;
  monthPts: string;
  viewFullStandings: string;
  loadingStandings: string;
  seasonOverview: string;
  selectMonth: string;
  gameweekIn: string;
  resetFilters: string;
  allMonth: string;

  // Analytics Quad Grid / Homepage Cards
  mostSelected: string;
  mostCaptainedTitle: string;
  transferIn: string;
  transferOut: string;
  managers: string;
  transfers: string;
  fetchingManagers: string;
  close: string;

  // Newsletter Page
  selectGameweek: string;
  selectMatchday: string;
  readMore: string;
  noArticles: string;
  allUpdates: string;
  publishedBy: string;

  // General Header & Status
  lastUpdated: string;
  justNow: string;
  live: string;
}

const DICTIONARY: Record<Language, Translations> = {
  id: {
    navHome: 'HOME',
    navLeague: 'FPL KINO LEAGUE',
    navCup: 'FPL KINO CUP',
    navPrizePool: 'PRIZE POOL',
    navHallOfFame: 'HALL OF FAME',
    navNewsletter: 'NEWSLETTER',

    averageScore: 'Rata-Rata Skor',
    highestScore: 'Skor Tertinggi',
    mostCaptained: 'Kapten Terbanyak',
    nextDeadline: 'DEADLINE BERIKUTNYA',
    gwStats: 'STATS GW',

    rank: 'RNK',
    teamAndManager: 'TIM & MANAJER',
    gwPts: 'GW PTS',
    totalPts: 'TOTAL',
    monthPts: 'POIN BULAN',
    viewFullStandings: 'LIHAT KLASEMEN LENGKAP',
    loadingStandings: 'Memuat klasemen...',
    seasonOverview: 'Ikhtisar Musim',
    selectMonth: 'Pilih Bulan',
    gameweekIn: 'Gameweek di',
    resetFilters: 'Reset ke Musim Utuh',
    allMonth: 'Full Bulan',

    mostSelected: 'MOST SELECTED',
    mostCaptainedTitle: 'MOST CAPTAINED',
    transferIn: 'TRANSFER IN',
    transferOut: 'TRANSFER OUT',
    managers: 'Manajer',
    transfers: 'Transfer',
    fetchingManagers: 'Memuat data manajer...',
    close: 'Tutup',

    selectGameweek: 'Pilih Gameweek',
    selectMatchday: 'Pilih Matchday',
    readMore: 'Baca Selengkapnya',
    noArticles: 'Tidak ada artikel ditemukan untuk filter ini',
    allUpdates: 'Semua Pembaruan',
    publishedBy: 'Diterbitkan oleh FPL Kino Hub Editorial',

    lastUpdated: 'Terakhir diperbarui',
    justNow: 'baru saja',
    live: 'LIVE',
  },
  en: {
    navHome: 'HOME',
    navLeague: 'FPL KINO LEAGUE',
    navCup: 'FPL KINO CUP',
    navPrizePool: 'PRIZE POOL',
    navHallOfFame: 'HALL OF FAME',
    navNewsletter: 'NEWSLETTER',

    averageScore: 'Average Score',
    highestScore: 'Highest Score',
    mostCaptained: 'Most Captained',
    nextDeadline: 'NEXT DEADLINE',
    gwStats: 'GW STATS',

    rank: 'POS',
    teamAndManager: 'TEAM & MANAGER',
    gwPts: 'GW PTS',
    totalPts: 'TOTAL',
    monthPts: 'MONTH PTS',
    viewFullStandings: 'VIEW FULL STANDINGS',
    loadingStandings: 'Loading standings...',
    seasonOverview: 'Season Overview',
    selectMonth: 'Select Month',
    gameweekIn: 'Gameweek in',
    resetFilters: 'Reset to Season View',
    allMonth: 'Full Month',

    mostSelected: 'MOST SELECTED',
    mostCaptainedTitle: 'MOST CAPTAINED',
    transferIn: 'TRANSFER IN',
    transferOut: 'TRANSFER OUT',
    managers: 'Managers',
    transfers: 'Transfers',
    fetchingManagers: 'Fetching manager data...',
    close: 'Close',

    selectGameweek: 'Select Gameweek',
    selectMatchday: 'Select Matchday',
    readMore: 'Read More',
    noArticles: 'No articles found for this filter',
    allUpdates: 'All Updates',
    publishedBy: 'Published by FPL Kino Hub Editorial',

    lastUpdated: 'Last updated',
    justNow: 'just now',
    live: 'LIVE',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fpl_kino_lang') as Language;
      if (saved === 'id' || saved === 'en') return saved;
    }
    return 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fpl_kino_lang', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: DICTIONARY[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

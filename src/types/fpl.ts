export interface Manager {
  id: string;
  name: string;
  division: string;
  teamName: string;
  avatarUrl?: string;
  rank: number;
  previousRank: number;
  totalPoints: number;
  gwPoints: number;
  overallRank: number;
  chipsUsed: string[];
  badgesCount: number;
  bestGwRank: number;
  form: ('W' | 'D' | 'L' | 'HOT')[];
}

export interface StandingItem {
  rank: number;
  previousRank: number;
  managerName: string;
  division: string;
  teamName: string;
  gwPoints: number;
  totalPoints: number;
  chipPlayed?: 'TC' | 'BB' | 'FH' | 'WC' | null;
  form: string;
}

export interface GameweekInfo {
  currentGw: number;
  deadlineString: string;
  deadlineCountdown: {
    days: number;
    hours: number;
    minutes: number;
  };
  highestGwScore: number;
  highestGwManager: {
    name: string;
    team: string;
  };
  averageGwScore: number;
  totalManagers: number;
  activeChipCount: number;
  isLive: boolean;
}

export interface TopPerformer {
  id: string;
  name: string;
  team: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  points: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  bonus: number;
  ownershipPercent: number;
  price: string;
  photoUrl?: string;
  selectedByKinoPercent: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'transfer' | 'chip' | 'rank_jump' | 'badge_unlocked' | 'banter';
  managerName: string;
  teamName: string;
  description: string;
  detail?: string;
  timestamp: string;
  highlight?: boolean;
}

export interface HeadToHeadFixture {
  id: string;
  managerA: {
    name: string;
    team: string;
    rank: number;
    gwScore?: number;
  };
  managerB: {
    name: string;
    team: string;
    rank: number;
    gwScore?: number;
  };
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  gameweek: number;
}

export interface UpcomingDeadline {
  gameweek: number;
  deadlineDate: string;
  deadlineTimeWib: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  keyFixture: string;
  isDoubleGameweek?: boolean;
  isBlankGameweek?: boolean;
  recommendedCaptain: {
    name: string;
    team: string;
    fixture: string;
  };
}

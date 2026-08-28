export interface StandingRow {
  pos: number;
  team: string;
  manager: string;
  gw: number;
  tot: number;
  gwNumber?: number;
}

export interface PlayerRankItem {
  rank: '1st' | '2nd' | '3rd';
  name: string;
  team: string;
  position: string;
  statValue: number;
}

export interface PreviousGwStats {
  averageScore: number;
  highestScore: number;
  mostCaptained: string;
}

export const mockPreviousGwStats: PreviousGwStats = {
  averageScore: 58,
  highestScore: 112,
  mostCaptained: 'Haaland (48%)'
};

export const mockLeagueStandings: StandingRow[] = [
  { pos: 1, team: 'Dopamine', manager: 'Budi Santoso', gw: 82, tot: 234 },
  { pos: 2, team: 'Hipo FC', manager: 'Andi Wijaya', gw: 75, tot: 223 },
  { pos: 3, team: 'BOLAAANG', manager: 'Reza Pratama', gw: 68, tot: 192 },
  { pos: 4, team: 'Kino All Stars', manager: 'Dimas A.', gw: 54, tot: 188 },
  { pos: 5, team: 'Jakarta Blues', manager: 'Kevin K.', gw: 61, tot: 175 }
];

export interface LeagueStandingsData {
  [gameweek: string]: StandingRow[];
}

export const mockLeagueStandingsByGw: LeagueStandingsData = {
  'GW6': [
    { pos: 1, team: 'DOPAMINE', manager: 'Budi Santoso', gw: 82, tot: 234 },
    { pos: 2, team: 'HIPO FC', manager: 'Andi Wijaya', gw: 75, tot: 223 },
    { pos: 3, team: 'BOLAAANG', manager: 'Reza Pratama', gw: 68, tot: 192 },
    { pos: 4, team: 'KINO ALL STARS', manager: 'Dimas A.', gw: 54, tot: 188 },
    { pos: 5, team: 'JAKARTA BLUES', manager: 'Kevin K.', gw: 61, tot: 175 },
    { pos: 6, team: 'NAGABOMB FC', manager: 'Rian H.', gw: 59, tot: 172 },
    { pos: 7, team: 'KINO UNITED', manager: 'Taufik R.', gw: 52, tot: 170 },
    { pos: 8, team: 'TANGERANG CITY', manager: 'Eko P.', gw: 49, tot: 168 },
    { pos: 9, team: 'VORTEX FC', manager: 'Fajar A.', gw: 55, tot: 165 },
    { pos: 10, team: 'BINTANG INDO', manager: 'Bintang A.', gw: 60, tot: 162 },
    { pos: 11, team: 'GARUDA ROVERS', manager: 'Bagus S.', gw: 47, tot: 160 },
    { pos: 12, team: 'KINO WARRIORS', manager: 'Hendry L.', gw: 50, tot: 158 },
    { pos: 13, team: 'JAVA EAGLES', manager: 'Aditya W.', gw: 45, tot: 155 },
    { pos: 14, team: 'SUNDA EMPIRE FC', manager: 'Cecep H.', gw: 53, tot: 153 },
    { pos: 15, team: 'BALI BREEZE', manager: 'I Wayan S.', gw: 41, tot: 151 },
    { pos: 16, team: 'KINO LEGENDS', manager: 'Alex M.', gw: 42, tot: 150 },
    { pos: 17, team: 'MID TABLE FC', manager: 'John D.', gw: 38, tot: 148 },
    { pos: 18, team: 'RELEGATION SCRAP', manager: 'Sarah P.', gw: 35, tot: 142 },
    { pos: 19, team: 'RED DEVILS KINO', manager: 'Dani C.', gw: 40, tot: 139 },
    { pos: 20, team: 'KINO CITY', manager: 'Hadi T.', gw: 30, tot: 135 },
    { pos: 21, team: 'GUNNERS KINO', manager: 'Yusuf R.', gw: 44, tot: 132 },
    { pos: 22, team: 'LIONS FC', manager: 'Haris K.', gw: 33, tot: 130 },
    { pos: 23, team: 'FANTASY BEASTS', manager: 'Sony D.', gw: 37, tot: 128 },
    { pos: 24, team: 'KINO KINGS', manager: 'Guntur P.', gw: 29, tot: 125 },
    { pos: 25, team: 'SUMATRA TIGERS', manager: 'Zulfikar L.', gw: 36, tot: 122 },
    { pos: 26, team: 'BORNEO WILDS', manager: 'Rudy O.', gw: 25, tot: 120 },
    { pos: 27, team: 'SULAWESI SHARKS', manager: 'Akbar T.', gw: 31, tot: 118 },
    { pos: 28, team: 'KINO ELITE', manager: 'Daniel S.', gw: 22, tot: 115 },
    { pos: 29, team: 'KINO ACADEMY', manager: 'Michael G.', gw: 28, tot: 112 },
    { pos: 30, team: 'PACIFIC WAVE', manager: 'Kurniawan E.', gw: 26, tot: 110 },
    { pos: 31, team: 'KINO STARS', manager: 'Ramon K.', gw: 30, tot: 108 },
    { pos: 32, team: 'FALCON FC', manager: 'Erick H.', gw: 24, tot: 105 },
    { pos: 33, team: 'BLACK EAGLES', manager: 'Dicky W.', gw: 20, tot: 102 },
    { pos: 34, team: 'KINO SPURS', manager: 'Willy T.', gw: 27, tot: 99 },
    { pos: 35, team: 'KINO BLUES', manager: 'Frans Y.', gw: 19, tot: 96 },
    { pos: 36, team: 'KINO WOLVES', manager: 'Gandi R.', gw: 21, tot: 93 },
    { pos: 37, team: 'KINO FORESTS', manager: 'Tomi B.', gw: 15, tot: 90 },
    { pos: 38, team: 'KINO SEAHAWKS', manager: 'Agus N.', gw: 18, tot: 88 },
    { pos: 39, team: 'BOTTOM ROW FC', manager: 'Rio F.', gw: 14, tot: 87 },
    { pos: 40, team: 'WOODEN SPOON', manager: 'Last Place', gw: 12, tot: 85 }
  ],
  'GW5': [
    { pos: 1, team: 'HIPO FC', manager: 'Andi Wijaya', gw: 65, tot: 148 },
    { pos: 2, team: 'DOPAMINE', manager: 'Budi Santoso', gw: 52, tot: 152 },
    { pos: 3, team: 'KINO ALL STARS', manager: 'Dimas A.', gw: 70, tot: 134 },
    { pos: 4, team: 'BOLAAANG', manager: 'Reza Pratama', gw: 48, tot: 124 },
    { pos: 5, team: 'JAKARTA BLUES', manager: 'Kevin K.', gw: 50, tot: 114 },
    { pos: 6, team: 'NAGABOMB FC', manager: 'Rian H.', gw: 45, tot: 113 },
    { pos: 7, team: 'KINO UNITED', manager: 'Taufik R.', gw: 55, tot: 118 },
    { pos: 8, team: 'TANGERANG CITY', manager: 'Eko P.', gw: 40, tot: 119 },
    { pos: 9, team: 'VORTEX FC', manager: 'Fajar A.', gw: 42, tot: 110 },
    { pos: 10, team: 'BINTANG INDO', manager: 'Bintang A.', gw: 51, tot: 102 },
    { pos: 11, team: 'GARUDA ROVERS', manager: 'Bagus S.', gw: 39, tot: 113 },
    { pos: 12, team: 'KINO WARRIORS', manager: 'Hendry L.', gw: 48, tot: 108 },
    { pos: 13, team: 'JAVA EAGLES', manager: 'Aditya W.', gw: 35, tot: 110 },
    { pos: 14, team: 'SUNDA EMPIRE FC', manager: 'Cecep H.', gw: 41, tot: 100 },
    { pos: 15, team: 'BALI BREEZE', manager: 'I Wayan S.', gw: 38, tot: 110 },
    { pos: 16, team: 'KINO LEGENDS', manager: 'Alex M.', gw: 32, tot: 108 },
    { pos: 17, team: 'MID TABLE FC', manager: 'John D.', gw: 45, tot: 110 },
    { pos: 18, team: 'RELEGATION SCRAP', manager: 'Sarah P.', gw: 31, tot: 107 },
    { pos: 19, team: 'RED DEVILS KINO', manager: 'Dani C.', gw: 33, tot: 99 },
    { pos: 20, team: 'KINO CITY', manager: 'Hadi T.', gw: 28, tot: 105 },
    { pos: 21, team: 'GUNNERS KINO', manager: 'Yusuf R.', gw: 35, tot: 88 },
    { pos: 22, team: 'LIONS FC', manager: 'Haris K.', gw: 29, tot: 97 },
    { pos: 23, team: 'FANTASY BEASTS', manager: 'Sony D.', gw: 30, tot: 91 },
    { pos: 24, team: 'KINO KINGS', manager: 'Guntur P.', gw: 32, tot: 96 },
    { pos: 25, team: 'SUMATRA TIGERS', manager: 'Zulfikar L.', gw: 26, tot: 86 },
    { pos: 26, team: 'BORNEO WILDS', manager: 'Rudy O.', gw: 27, tot: 95 },
    { pos: 27, team: 'SULAWESI SHARKS', manager: 'Akbar T.', gw: 28, tot: 87 },
    { pos: 28, team: 'KINO ELITE', manager: 'Daniel S.', gw: 30, tot: 93 },
    { pos: 29, team: 'KINO ACADEMY', manager: 'Michael G.', gw: 22, tot: 84 },
    { pos: 30, team: 'PACIFIC WAVE', manager: 'Kurniawan E.', gw: 25, tot: 84 },
    { pos: 31, team: 'KINO STARS', manager: 'Ramon K.', gw: 29, tot: 78 },
    { pos: 32, team: 'FALCON FC', manager: 'Erick H.', gw: 20, tot: 81 },
    { pos: 33, team: 'BLACK EAGLES', manager: 'Dicky W.', gw: 18, tot: 82 },
    { pos: 34, team: 'KINO SPURS', manager: 'Willy T.', gw: 21, tot: 72 },
    { pos: 35, team: 'KINO BLUES', manager: 'Frans Y.', gw: 15, tot: 77 },
    { pos: 36, team: 'KINO WOLVES', manager: 'Gandi R.', gw: 19, tot: 72 },
    { pos: 37, team: 'KINO FORESTS', manager: 'Tomi B.', gw: 12, tot: 75 },
    { pos: 38, team: 'KINO SEAHAWKS', manager: 'Agus N.', gw: 16, tot: 70 },
    { pos: 39, team: 'BOTTOM ROW FC', manager: 'Rio F.', gw: 10, tot: 73 },
    { pos: 40, team: 'WOODEN SPOON', manager: 'Last Place', gw: 8, tot: 73 }
  ],
  'GW4': [
    { pos: 1, team: 'DOPAMINE', manager: 'Budi Santoso', gw: 60, tot: 100 },
    { pos: 2, team: 'HIPO FC', manager: 'Andi Wijaya', gw: 58, tot: 83 },
    { pos: 3, team: 'BOLAAANG', manager: 'Reza Pratama', gw: 50, tot: 76 },
    { pos: 4, team: 'KINO ALL STARS', manager: 'Dimas A.', gw: 45, tot: 64 },
    { pos: 5, team: 'JAKARTA BLUES', manager: 'Kevin K.', gw: 48, tot: 64 },
    { pos: 6, team: 'NAGABOMB FC', manager: 'Rian H.', gw: 52, tot: 68 },
    { pos: 7, team: 'KINO UNITED', manager: 'Taufik R.', gw: 40, tot: 63 },
    { pos: 8, team: 'TANGERANG CITY', manager: 'Eko P.', gw: 42, tot: 79 },
    { pos: 9, team: 'VORTEX FC', manager: 'Fajar A.', gw: 44, tot: 68 },
    { pos: 10, team: 'BINTANG INDO', manager: 'Bintang A.', gw: 38, tot: 51 },
    { pos: 11, team: 'GARUDA ROVERS', manager: 'Bagus S.', gw: 41, tot: 74 },
    { pos: 12, team: 'KINO WARRIORS', manager: 'Hendry L.', gw: 39, tot: 60 },
    { pos: 13, team: 'JAVA EAGLES', manager: 'Aditya W.', gw: 37, tot: 75 },
    { pos: 14, team: 'SUNDA EMPIRE FC', manager: 'Cecep H.', gw: 36, tot: 59 },
    { pos: 15, team: 'BALI BREEZE', manager: 'I Wayan S.', gw: 35, tot: 72 },
    { pos: 16, team: 'KINO LEGENDS', manager: 'Alex M.', gw: 34, tot: 76 },
    { pos: 17, team: 'MID TABLE FC', manager: 'John D.', gw: 33, tot: 65 },
    { pos: 18, team: 'RELEGATION SCRAP', manager: 'Sarah P.', gw: 32, tot: 76 },
    { pos: 19, team: 'RED DEVILS KINO', manager: 'Dani C.', gw: 31, tot: 66 },
    { pos: 20, team: 'KINO CITY', manager: 'Hadi T.', gw: 30, tot: 77 },
    { pos: 21, team: 'GUNNERS KINO', manager: 'Yusuf R.', gw: 29, tot: 53 },
    { pos: 22, team: 'LIONS FC', manager: 'Haris K.', gw: 28, tot: 68 },
    { pos: 23, team: 'FANTASY BEASTS', manager: 'Sony D.', gw: 27, tot: 61 },
    { pos: 24, team: 'KINO KINGS', manager: 'Guntur P.', gw: 26, tot: 64 },
    { pos: 25, team: 'SUMATRA TIGERS', manager: 'Zulfikar L.', gw: 25, tot: 60 },
    { pos: 26, team: 'BORNEO WILDS', manager: 'Rudy O.', gw: 24, tot: 68 },
    { pos: 27, team: 'SULAWESI SHARKS', manager: 'Akbar T.', gw: 23, tot: 59 },
    { pos: 28, team: 'KINO ELITE', manager: 'Daniel S.', gw: 22, tot: 63 },
    { pos: 29, team: 'KINO ACADEMY', manager: 'Michael G.', gw: 21, tot: 62 },
    { pos: 30, team: 'PACIFIC WAVE', manager: 'Kurniawan E.', gw: 20, tot: 59 },
    { pos: 31, team: 'KINO STARS', manager: 'Ramon K.', gw: 19, tot: 49 },
    { pos: 32, team: 'FALCON FC', manager: 'Erick H.', gw: 18, tot: 61 },
    { pos: 33, team: 'BLACK EAGLES', manager: 'Dicky W.', gw: 17, tot: 64 },
    { pos: 34, team: 'KINO SPURS', manager: 'Willy T.', gw: 16, tot: 51 },
    { pos: 35, team: 'KINO BLUES', manager: 'Frans Y.', gw: 15, tot: 62 },
    { pos: 36, team: 'KINO WOLVES', manager: 'Gandi R.', gw: 14, tot: 53 },
    { pos: 37, team: 'KINO FORESTS', manager: 'Tomi B.', gw: 13, tot: 63 },
    { pos: 38, team: 'KINO SEAHAWKS', manager: 'Agus N.', gw: 12, tot: 54 },
    { pos: 39, team: 'BOTTOM ROW FC', manager: 'Rio F.', gw: 11, tot: 63 },
    { pos: 40, team: 'WOODEN SPOON', manager: 'Last Place', gw: 10, tot: 65 }
  ]
};

export const mockMostSelected: PlayerRankItem[] = [
  { rank: '1st', name: 'HAALAND', team: 'MCI', position: 'FWD', statValue: 31 },
  { rank: '2nd', name: 'B. FERNANDES', team: 'MUN', position: 'FWD', statValue: 25 },
  { rank: '3rd', name: 'JOAO PEDRO', team: 'BHA', position: 'FWD', statValue: 21 }
];

export const mockTopCaptains: PlayerRankItem[] = [
  { rank: '1st', name: 'SALAH', team: 'LIV', position: 'MID', statValue: 34 },
  { rank: '2nd', name: 'HAALAND', team: 'MCI', position: 'FWD', statValue: 25 },
  { rank: '3rd', name: 'PALMER', team: 'CHE', position: 'MID', statValue: 18 }
];

export const mockTransferIn: PlayerRankItem[] = [
  { rank: '1st', name: 'JACKSON', team: 'CHE', position: 'FWD', statValue: 22 },
  { rank: '2nd', name: 'DIAZ', team: 'LIV', position: 'MID', statValue: 19 },
  { rank: '3rd', name: 'WATKINS', team: 'AVL', position: 'FWD', statValue: 15 }
];

export const mockTransferOut: PlayerRankItem[] = [
  { rank: '1st', name: 'ISAK', team: 'NEW', position: 'FWD', statValue: 20 },
  { rank: '2nd', name: 'SAKA', team: 'ARS', position: 'MID', statValue: 17 },
  { rank: '3rd', name: 'SON', team: 'TOT', position: 'MID', statValue: 14 }
];

export interface WeeklyWinner {
  gw: number;
  team: string;
  manager: string;
  score: number;
}

export const mockWeeklyWinners: WeeklyWinner[] = [
  { gw: 5, team: 'Gunnersaurus Rex', manager: 'Alex Mercer', score: 112 },
  { gw: 4, team: 'Saka Potatoes', manager: 'Sarah Jenkins', score: 98 },
  { gw: 3, team: 'Expected Toulouse', manager: 'Marcus Rash', score: 105 },
  { gw: 2, team: 'Haaland Oates', manager: 'Elena Rostov', score: 88 },
  { gw: 1, team: 'Bowen Arrows', manager: 'David Chen', score: 121 },
];


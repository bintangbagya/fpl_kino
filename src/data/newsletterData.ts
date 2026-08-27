export interface NewsletterStory {
  category: string;
  title: string;
  hook: string;
  description: string;
}

export interface GameweekNewsletter {
  gameweek: string;
  stories: NewsletterStory[];
}

export const mockNewsletters: GameweekNewsletter[] = [
  {
    gameweek: 'GW12',
    stories: [
      {
        category: '🔥 GW12 • BIGGEST STORY',
        title: 'DOPAMINE IS COOKING',
        hook: 'The title race suddenly looks very different.',
        description: 'Dopamine just dropped 87 points this Gameweek and is now only 6 points behind the leader. At this point, everyone else might want to start checking their rear-view mirror.',
      },
      {
        category: '💀 GW12 • BENCH DISASTER',
        title: 'BENCH POINTS FC STRIKES AGAIN',
        hook: '14 points. Sitting there. Doing absolutely nothing.',
        description: 'Martin FC somehow managed to leave 14 points on the bench this week. The starting XI clearly had other plans, because apparently scoring points is optional.',
      },
      {
        category: '🎯 GW12 • CAPTAIN FAIL',
        title: 'CAPTAINCY CRIME',
        hook: '11 managers. One decision. Two points.',
        description: "Eleven managers trusted the same captain this week and got just 2 points from him. That's not a captain pick anymore, that's a group project gone wrong.",
      },
      {
        category: '📉 GW12 • BIGGEST FALL',
        title: 'WHAT HAPPENED TO ERICK FC?',
        hook: 'Down 8 places in a single Gameweek.',
        description: 'Erick FC entered the Gameweek looking comfortable and came out looking like they had forgotten to submit a team. Eight places gone in one week. Someone check if the manager is still online.',
      },
      {
        category: '📈 GW12 • BIGGEST RIDER',
        title: 'THE COMEBACK NOBODY SAW COMING',
        hook: '+9 places in one Gameweek.',
        description: 'After spending most of the season somewhere near the bottom, Hipo FC suddenly exploded with 104 points and jumped nine places. The comeback is officially getting annoying.',
      },
    ],
  },
  {
    gameweek: 'GW11',
    stories: [
      {
        category: '🔥 GW11 • BIGGEST STORY',
        title: 'HAALAND TRIPLE CAPTAIN MASTERCLASS',
        hook: 'A massive gamble pays off handsomely.',
        description: 'Two managers pulled the trigger on the Triple Captain chip on Haaland this week. His hat-trick against Everton rewarded them with a whopping 51 points from just one player, catapulting them into the top 10.',
      },
      {
        category: '💀 GW11 • BENCH DISASTER',
        title: '21 POINTS TRAPPED IN COLD STORAGE',
        hook: 'A sub-goalkeeper and a defender outscore the entire starting XI.',
        description: 'Kino All Stars manager left a clean-sheet defender and a penalty-saving goalkeeper on the bench. The starting squad gathered a combined total of 32 points, making the bench output look like a comedy show.',
      },
      {
        category: '🎯 GW11 • CAPTAIN WIN',
        title: 'SALAH SAVES THE DAY',
        hook: 'Anfield king delivers when others faltered.',
        description: 'While Haaland captains cried, Mohamed Salah managers rejoiced. A brace and two bonus points gave captainers a sweet 32 points, rescuing what would have been a catastrophic gameweek.',
      },
      {
        category: '📉 GW11 • BIGGEST FALL',
        title: 'NAGABOMB FC DEMOLISHED',
        hook: 'From 3rd to 11th in 90 minutes.',
        description: 'Nagabomb FC suffered from a series of unfortunate events: red cards, own goals, and a captain blank. A total score of 29 points saw them crash out of the title contender group.',
      },
    ],
  },
  {
    gameweek: 'GW10',
    stories: [
      {
        category: '🔥 GW10 • BIGGEST STORY',
        title: 'THE MITOMA SHOW',
        hook: 'A single differential changes everything.',
        description: 'Kaoru Mitoma scored and assisted twice in a shocking Brighton win, proving to be the ultimate differential of the week. Only 4% of managers own him in FPL Kino Hub, and they are celebrating big.',
      },
      {
        category: '💀 GW10 • RED CARD NIGHTMARE',
        title: 'DOUBLE RED CARD CARNAGE',
        hook: 'Two defenders sent off, leaving the manager in negative points.',
        description: 'Jakarta Blues manager had both of his premium defenders sent off in separate games. Combined with conceding multiple goals, their defensive line finished with a painful -4 points.',
      },
      {
        category: '🎯 GW10 • CAPTAIN FAIL',
        title: 'PALMER POCKETED',
        hook: 'Cole Palmer goes missing at Stamford Bridge.',
        description: 'Over 60% of FPL Kino Hub managers captained Cole Palmer expecting a feast. Instead, he walked away with a single yellow card and a blank, leaving the majority with a meager 2-point captain contribution.',
      },
    ],
  },
  {
    gameweek: 'GW09',
    stories: [
      {
        category: '🔥 GW09 • BIGGEST STORY',
        title: 'BOLAAANG REGAINS THE LEAD',
        hook: 'Consistency beats short-term hype.',
        description: 'With three consecutive green arrows, BOLAAANG has retaken the top spot in the FPL Kino League. A solid midfield template and patient transfer policy have finally paid dividends.',
      },
      {
        category: '💀 GW09 • BENCH DISASTER',
        title: 'SNEAKY BENCH BOOST FAILURE',
        hook: 'Using a chip for a combined total of 4 bench points.',
        description: 'Tangerang City manager activated the Bench Boost chip this week. With two players not playing at all and the other two scoring 2 points each, it goes down as one of the least successful chip activations of the season.',
      },
      {
        category: '📈 GW09 • BIGGEST RIDER',
        title: 'VORTEX FC IS SURGING',
        hook: 'Jumped 12 places after a massive 95-point haul.',
        description: 'Vortex FC was the highest scorer of the week, powered by a double Arsenal defense and a captained Bukayo Saka. The manager’s bold double-transfer during the midweek paid off beautifully.',
      },
    ],
  },
  {
    gameweek: 'GW08',
    stories: [
      {
        category: '🔥 GW08 • BIGGEST STORY',
        title: 'WILD WILD WILDCARD WEEK',
        hook: 'Half the league triggers the Wildcard chip.',
        description: 'A massive shift in player pricing and fixture runs prompted 20 out of 40 managers to activate their Wildcards. Early results are highly mixed, with some managers immediately regretting their choices.',
      },
      {
        category: '💀 GW08 • OWN GOAL CRIME',
        title: 'DEFENDER OWN GOAL BONANZA',
        hook: 'Three own goals from starting defenders.',
        description: 'In an unprecedented turn of events, three different managers had starting defenders who scored own goals this Gameweek. Combined with losing clean sheets, these managers took heavy hits.',
      },
      {
        category: '🎯 GW08 • CAPTAIN WIN',
        title: 'SON HEUNG-MIN SHINES',
        hook: 'Spurs captain delivers a massive 15-point haul.',
        description: 'For the few brave managers who opted to captain Son instead of Haaland, their faith was rewarded with a 15-point haul (30 points total), proving that going against the template can sometimes win gameweeks.',
      },
    ],
  },
];

# Newsletter System Thinking Inventory & Editorial Reasoning Framework (`newsletter_logic.md`)

## 1. Executive Overview & System Architecture

This document serves as the permanent **Thinking Inventory** and **Editorial Reasoning Framework** for the FPL Kino Hub Newsletter System. It defines **WHAT** the system must evaluate and analyze for every Fantasy Premier League (FPL) Gameweek.

### 1.1 Architectural Layering

The FPL Newsletter System is organized into four distinct, non-overlapping architectural layers:

```
┌────────────────────────────────────────────────────────┐
│ 1. Detector Engine (Supabase Edge Function)            │
│    - Scans raw Supabase database tables                 │
│    - Emits objective facts without editorial opinion   │
└──────────────────────────┬─────────────────────────────┘
                           │ Outputs Fact Candidates
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. newsletter_logic.md (This Document)                 │
│    - Permanent thinking inventory & reasoning rules    │
│    - Defines what angle/pattern is editorially valid   │
└──────────────────────────┬─────────────────────────────┘
                           │ Defines Evaluation Scope
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. AI Editor Layer                                     │
│    - Ranks, filters, and clusters fact candidates     │
│    - Selects the most compelling stories per GW        │
└──────────────────────────┬─────────────────────────────┘
                           │ Approved Story Blueprints
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. AI Writer Layer                                     │
│    - Generates reader-facing Indonesian newsletter      │
│    - Strictly adheres to temporal & privacy rules      │
└────────────────────────────────────────────────────────┘
```

- **Detector Engine**: Responsible ONLY for detecting objective, deterministic facts from data.
- **`newsletter_logic.md`**: Tells the system what patterns, decisions, and anomalies it should think about.
- **AI Editor**: Evaluates detected facts against this logic inventory to pick the most entertaining narrative angles.
- **AI Writer**: Transforms selected facts into human-grade narrative prose.

---

## 2. Mandatory Editorial Governance & Safety Rules

### 2.1 Critical Temporal Rule: Live/Provisional vs. Final States

A Gameweek consists of multiple matches played across several days. The presence of a Gameweek index (e.g., "Gameweek 2") **NEVER** implies that the Gameweek is complete.

The system MUST verify the Gameweek state before making any editorial assertion:

1. **PROVISIONAL / LIVE State** (Gameweek is active / matches still remaining):
   - All rankings, lead changes, floor scores, and points are explicitly framed as **temporary**.
   - Mandatory Indonesian phrasing templates:
     - *"Fazlun sementara berada di posisi #1..."*
     - *"Untuk sementara, posisi puncak diduduki oleh..."*
     - *"Posisi ini masih dapat berubah karena beberapa pertandingan belum selesai..."*
     - *"Klasemen sementara menunjukkan..."*

2. **FINAL / COMPLETED State** (Gameweek is finished and finalized):
   - Definitive language may be used.
   - Mandatory Indonesian phrasing templates:
     - *"Fazlun resmi merebut posisi #1..."*
     - *"Pada akhir GW2, perolehan poin mengonfirmasi..."*
     - *"Hasil akhir Gameweek ini mengunci..."*

> **CRITICAL DIRECTIVE**: Never present a provisional or live state as a final result.

---

### 2.2 Internal System Metadata Isolation Rule

The public newsletter is meant for end-user readers. **Internal system implementation details, technical schemas, database keys, and debug metrics MUST NEVER appear in public newsletter outputs.**

#### Forbidden Metadata List (Internal Only - Do NOT render):
- `detector_id` (e.g., `DET_PERF_WEEKLY_CHAMPION`)
- `cluster_key` (e.g., `GW2_DET_PERF_WEEKLY_CHAMPION_12345`)
- `readiness_status`
- `editorial_angle`
- `objective_score`
- `verified_fact_sheet_json`
- `triggered_detectors` / `triggered_detectors_json`
- Internal scoring thresholds, raw JSON dumps, or database table identifiers

*These metadata fields are strictly for internal routing, clustering, and AI prompt context, but must be fully translated into clean natural language before reaching the reader.*

---

## 3. Detector Engine Baseline & Status Mapping

To prevent architectural hallucinations, this framework references the official 28 Canonical Detectors defined in the Detector Engine:

- **11 MVP_ENABLED Detectors**: Currently active in code and producing fact sheets.
- **17 FUTURE_DISABLED Detectors**: Standardized in the registry but disabled in the current engine release.
- **DETECTION GAP**: Any editorial concept in this document not covered by an MVP_ENABLED or FUTURE_DISABLED detector.

---

## 4. Editorial Thinking Inventory (Logic Items)

Every item below defines an editorial angle the system must consider when reviewing a Gameweek.

---

### Category 1: Gameweek Performance & Standings Context

#### 4.1 Gameweek Champion / High-Score Benchmark
- **What should we check?**: Identify which manager scored the highest total points in the current Gameweek across the Kino league.
- **Why can this be interesting?**: Highlight top performance, crown the Manager of the Week, and celebrate tactical success.
- **What data/fact would be needed?**: `points` per manager in current GW, manager name, team name, tie count.
- **Is this covered by existing detector?**: Yes (`DET_PERF_WEEKLY_CHAMPION` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 4.2 Gameweek Disaster / Floor Score Benchmark
- **What should we check?**: Identify the lowest scoring manager in the current Gameweek.
- **Why can this be interesting?**: Creates dramatic contrast and lighthearted bantering opportunities ("lowest floor score of the week").
- **What data/fact would be needed?**: `points` per manager, manager name, team name, tie count.
- **Is this covered by existing detector?**: Yes (`DET_PERF_WEEKLY_FLOOR` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 4.3 League Outlier Performance
- **What should we check?**: Managers whose GW points exceed the overall league average by a significant margin (e.g., ≥ 25 points above average).
- **Why can this be interesting?**: Distinguishes between a routine good week and an exceptional blowout performance.
- **What data/fact would be needed?**: Manager GW points, calculated overall league average points, calculated delta.
- **Is this covered by existing detector?**: Yes (`DET_PERF_LEAGUE_OUTLIER` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 4.4 Temporary vs. Final Standings Assessment
- **What should we check?**: Whether the current overall standings evaluation is occurring while matches are ongoing or after GW finalization.
- **Why can this be interesting?**: Enforces temporal accuracy and adds suspense for live, in-progress Gameweeks.
- **What data/fact would be needed?**: GW completion flag, active match status, live overall points vs finalized overall points.
- **Is this covered by existing detector?**: Partially (Detector Engine processes latest available DB snapshot, but temporal state tagging must be explicitly checked during editorial assembly).
- **Detection Status**: **POTENTIAL DETECTION GAP** (Requires explicit temporal metadata flag in fact candidates).

---

### Category 2: Ranking Movement & League Standings

#### 2.1 Title Race Shift / Leader Changes
- **What should we check?**: Did the manager at rank #1 in the overall Kino league change compared to the previous Gameweek?
- **Why can this be interesting?**: Captures the headline story of league leadership changing hands.
- **What data/fact would be needed?**: Current #1 manager ID, previous GW #1 manager ID, total point gap.
- **Is this covered by existing detector?**: Yes (`DET_RANK_TITLE_CHANGE` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 2.2 Freefall Warning / Biggest Rank Drop
- **What should we check?**: Managers who suffered a massive drop in overall league rank (e.g., dropping 5 or more positions).
- **Why can this be interesting?**: Highlights sudden collapses in league standings, prompting inquiry into what went wrong.
- **What data/fact would be needed?**: Previous GW rank, current GW rank, positions dropped, total points.
- **Is this covered by existing detector?**: Yes (`DET_RANK_FREEFALL` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 2.3 Climber of the Week / Biggest Rank Gain
- **What should we check?**: Managers who climbed the highest number of places in overall league rank (e.g., gaining 5 or more positions).
- **Why can this be interesting?**: Celebrates rapid upward momentum and surge up the leaderboard.
- **What data/fact would be needed?**: Previous GW rank, current GW rank, positions gained, GW points.
- **Is this covered by existing detector?**: Yes (`DET_RANK_CLIMBER` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 2.4 Cup Cutoff & Qualification Danger Zone
- **What should we check?**: Managers hovering right around critical qualification thresholds (e.g., top 16 cup cutoff, mini-league playoff boundaries).
- **Why can this be interesting?**: Adds tension for bubble teams fighting for knockout qualification.
- **What data/fact would be needed?**: Overall rank, distance to cutoff boundary, point difference to cutoff rank.
- **Is this covered by existing detector?**: Yes (`DET_RANK_CUTOFF_DANGER` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

---

### Category 3: Transfers & Points Hits

#### 3.1 Points Hit Gambit & ROI
- **What should we check?**: Managers who took transfer hits (`event_transfers_cost > 0`) and whether the players brought in outscored the players sold plus the hit cost.
- **Why can this be interesting?**: Evaluates whether aggressive transfer gambling paid off or backfired.
- **What data/fact would be needed?**: `event_transfers_cost`, list of players transferred in, list of players transferred out, GW points of in vs out players, net calculation.
- **Is this covered by existing detector?**: Yes (`DET_XFER_HIT_GAMBIT` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 3.2 Immediate Transfer Success / Masterstroke
- **What should we check?**: Transferred-in player scores double-digit points (≥ 10 points) in their debut GW for the manager.
- **Why can this be interesting?**: Praises brilliant managerial foresight and instant tactical payoff.
- **What data/fact would be needed?: `player_in_id`, player web name, GW points scored by incoming player.
- **Is this covered by existing detector?**: Yes (`DET_XFER_MASTERSTROKE` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 3.3 Immediate Transfer Failure / Transfer Nightmare
- **What should we check?**: Transferred-in player gets a red card, scores negative points, or records zero points with an own goal/penalty miss.
- **Why can this be interesting?**: Classic nightmare scenario for fantasy managers; instant comedy and sympathy.
- **What data/fact would be needed?**: `player_in_id`, minutes played, red cards, own goals, penalties missed, total GW points.
- **Is this covered by existing detector?**: Yes (`DET_XFER_NIGHTMARE` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 3.4 Transfer Regret: Players Sold Who Later Performed Well
- **What should we check?**: A player sold by a manager in the current GW who went on to haul (score ≥ 10 points) in that same GW for their real-life club.
- **Why can this be interesting?**: Highlight the pain of premature selling ("seller's remorse").
- **What data/fact would be needed?**: `player_out_id`, player performance points in current GW, manager ID who sold them.
- **Is this covered by existing detector?**: No. (Existing `DET_XFER_HIT_GAMBIT` checks net transfers, but doesn't explicitly flag the specific "Sold Player Hauled Elsewhere" regret metric standalone).
- **Detection Status**: **POTENTIAL DETECTION GAP**.

#### 3.5 Transfer Regret: Players Bought Who Performed Badly vs. Sold Player Who Hauled
- **What should we check?**: Direct comparison where Player A (bought) blanks (≤ 2 pts) AND Player B (sold in same move) hauls (≥ 8 pts).
- **Why can this be interesting?**: The ultimate transfer swing penalty (e.g., -10 net point loss on a single transfer move).
- **What data/fact would be needed?**: `player_in_id`, `player_out_id`, points of both players in current GW, point differential.
- **Is this covered by existing detector?**: No.
- **Detection Status**: **POTENTIAL DETECTION GAP**.

---

### Category 4: Captaincy & Vice-Captain Decisions

#### 4.1 Captain Masterclass / Explosive Captain
- **What should we check?**: Captain choice delivers massive points (e.g., captain raw points ≥ 12, yielding 24+ doubled points).
- **Why can this be interesting?**: Highlights successful captaincy picks that anchored a manager's Gameweek.
- **What data/fact would be needed?**: Captain player ID, captain raw points, multiplier, total captain contribution.
- **Is this covered by existing detector?**: Yes (`DET_CAPT_MASTERCLASS` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 4.2 Captain Blank vs. Vice-Captain Rescue / Betrayal
- **What should we check?**: Captain blanks (raw points ≤ 2) while Vice-Captain scores double digits (raw points ≥ 10) on the bench or vice spot.
- **Why can this be interesting?**: The agony of picking the wrong armband recipient when the backup exploded.
- **What data/fact would be needed?**: Captain ID, Captain raw points, Vice-Captain ID, Vice-Captain raw points.
- **Is this covered by existing detector?**: Yes (`DET_CAPT_BLANK_DISASTER` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 4.3 Differential Captain Hero
- **What should we check?**: A captain selected by low league ownership (< 15% of Kino managers) who scores double digits.
- **Why can this be interesting?**: Celebrates bold, unconventional captaincy choices that paid off big.
- **What data/fact would be needed?**: Captain ID, league ownership percentage, captain GW points.
- **Is this covered by existing detector?**: Yes (`DET_CAPT_DIFFERENTIAL_HERO` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 4.4 Vice-Captain Activation Outcomes
- **What should we check?**: Instances where the Captain played 0 minutes, triggering the Vice-Captain multiplier to activate.
- **Why can this be interesting?**: Analyze whether the emergency vice-captain saved the day or compounded the captain ghosting.
- **What data/fact would be needed?**: Captain minutes (=0), Vice-Captain minutes, Vice-Captain points, effective points gained.
- **Is this covered by existing detector?**: No.
- **Detection Status**: **POTENTIAL DETECTION GAP**.

---

### Category 5: Lineup & Bench Management

#### 5.1 Benched Points Explosion
- **What should we check?**: A player left on the bench (multiplier = 0) who scores double-digit points (≥ 10 points).
- **Why can this be interesting?**: Exposes benching agony and wasted points left on the pine.
- **What data/fact would be needed?**: `player_id`, bench position (12, 13, 14, 15), multiplier (=0), player GW points.
- **Is this covered by existing detector?**: Yes (`DET_BENCH_EXPLOSION` — `MVP_ENABLED`).
- **Detection Status**: Fully Covered.

#### 5.2 Bench Outscoring Starters / Sub-Optimal Lineup
- **What should we check?**: Total points accumulated on the bench exceed the total points of starting players, or individual bench players outscoring starting counterparts.
- **Why can this be interesting?**: Highlights major selection mistakes and misjudged starting XI lineups.
- **What data/fact would be needed?**: Sum of bench player points vs sum of starting XI points, bench vs starting position map.
- **Is this covered by existing detector?**: Yes (`DET_BENCH_OUTSCORES_STARTERS` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 5.3 Goalkeeper Bench Regret
- **What should we check?**: Benched goalkeeper outscores starting goalkeeper by 5+ points (e.g., benched GK gets 11 pts with penalty save, starting GK gets 1 pt).
- **Why can this be interesting?**: Goalkeeper rotation is one of the most frustrating managerial dilemmas.
- **What data/fact would be needed?**: Starting GK ID & points, Benched GK ID & points, point delta.
- **Is this covered by existing detector?**: Yes (`DET_BENCH_GK_DILEMMA` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 5.4 Tactical Lineup & Formation Oddities
- **What should we check?**: Managers using rare or extreme formations (e.g., 5-2-3, 5-4-1, 3-4-3) or benching premium assets.
- **Why can this be interesting?**: Explores unusual tactical setups and manager playstyles.
- **What data/fact would be needed?**: Formation string derived from starting XI player positions, list of benched premium assets.
- **Is this covered by existing detector?**: Yes (`DET_FUN_UNUSUAL_FORMATION` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

---

### Category 6: Chip Usage & Strategic Impact

#### 6.1 Bench Boost Activation & Impact
- **What should we check?**: Manager activates Bench Boost chip; calculate total extra points contributed specifically by the 4 bench players.
- **Why can this be interesting?**: Evaluates whether the Bench Boost chip was a masterclass (> 25 pts) or a flop (< 10 pts).
- **What data/fact would be needed?**: Active chip = `bboost`, points of players in positions 12, 13, 14, 15.
- **Is this covered by existing detector?**: Yes (`DET_CHIP_BENCH_BOOST_RESULT` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 6.2 Free Hit Delta & Score Differential
- **What should we check?**: Manager activates Free Hit chip; calculate net points delta between the Free Hit team score and the hypothetical score of their prior week's squad.
- **Why can this be interesting?**: Determines exact net gain/loss produced by the Free Hit intervention.
- **What data/fact would be needed?**: Active chip = `freehit`, actual FH score, projected non-FH squad score, calculated net delta.
- **Is this covered by existing detector?**: Yes (`DET_CHIP_FREE_HIT_DELTA` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 6.3 Wildcard Debut & Squad Transformation
- **What should we check?**: Manager activates Wildcard chip; evaluate immediate GW points scored by the new squad and rank movement post-wildcard.
- **Why can this be interesting?**: Tracks the immediate impact of a manager completely rebuilding their team.
- **What data/fact would be needed?**: Active chip = `wildcard`, count of new players, total GW score, rank change post-wildcard.
- **Is this covered by existing detector?**: Yes (`DET_CHIP_WILDCARD_IMPACT` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

---

### Category 7: Ownership, Differential Impact & Unexpected Outcomes

#### 7.1 Differential Player Impact & Rank Drivers
- **What should we check?**: High-performing players owned by < 20% of managers in the Kino league who propelled their owners up the rank table.
- **Why can this be interesting?**: Identifies unique differential picks that made the difference between average and elite Gameweeks.
- **What data/fact would be needed?**: Player ID, league ownership percentage, player GW score, manager IDs who own the player.
- **Is this covered by existing detector?**: No.
- **Detection Status**: **POTENTIAL DETECTION GAP**.

#### 7.2 Template Flops & League-Wide Repercussions
- **What should we check?**: Highly-owned players in the league (> 70% ownership) who blanked or got red cards/injured in the GW.
- **Why can this be interesting?**: Analyzes how "essential" assets failing impacted the collective league scoring floor.
- **What data/fact would be needed?**: Player ID, league ownership percentage, player score, average impact on league points.
- **Is this covered by existing detector?**: No.
- **Detection Status**: **POTENTIAL DETECTION GAP**.

#### 7.3 Auto-Sub Miracles & Heartbreaks
- **What should we check?**: Auto-subs coming off the bench to replace unplayed starters, bringing unexpected points into the starting XI.
- **Why can this be interesting?**: Narrative of luck saving a manager's week at the last minute.
- **What data/fact would be needed?**: Unplayed starter (0 mins), substituted bench player, points added by auto-sub.
- **Is this covered by existing detector?**: Yes (`DET_FUN_AUTOSUB_MIRACLE` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

---

### Category 8: Anomalies, Extreme Events & Trash-Talk Opportunities

#### 8.1 Clean Sheet Wall & Defensive Sweeps
- **What should we check?**: Managers who achieved 3+ clean sheets in their defensive line (GK + Defenders) in a single Gameweek.
- **Why can this be interesting?**: Celebrates defensive masterclasses and impenetrable backlines.
- **What data/fact would be needed?**: Count of clean sheets recorded by starting defenders and GK for a manager.
- **Is this covered by existing detector?**: Yes (`DET_RARE_CLEANSHEET_SWEEP` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 8.2 Red Card Catastrophes & Disciplinary Chaos
- **What should we check?**: Gameweeks where multiple red cards were received across a manager's team or across the league.
- **Why can this be interesting?**: Chaotic, dramatic events that destroy Gameweek plans.
- **What data/fact would be needed?**: Red card counts per manager team, negative disciplinary points.
- **Is this covered by existing detector?**: Yes (`DET_RARE_RED_CARD_PARTY` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 8.3 Mirror Scores & Statistical Coincidences
- **What should we check?**: Two or more managers scoring the exact same GW points, or identical starting XI scores across rival managers.
- **Why can this be interesting?**: Statistical oddities that create natural banter between matched rivals.
- **What data/fact would be needed?: Manager GW scores, score equality checks, squad overlap percentages.
- **Is this covered by existing detector?**: Yes (`DET_RARE_MIRROR_SCORE` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 8.4 Trash-Talk Worthy Situations & Humorous Misfortunes
- **What should we check?**: Embarrassing scenarios (e.g., taking a -8 hit only to score fewer points than the hit cost, or starting 3 defenders from a team that conceded 5 goals).
- **Why can this be interesting?**: Fuel for friendly league banter and entertaining commentary.
- **What data/fact would be needed?**: Combined fact sheet metrics (Hits taken, defensive points lost, captain blanks).
- **Is this covered by existing detector?**: Combination of `DET_XFER_HIT_GAMBIT`, `DET_PERF_WEEKLY_FLOOR`, and `DET_CAPT_BLANK_DISASTER`.
- **Detection Status**: Covered via Multi-Detector Clustering.

---

### Category 9: Rivalries & Historical/Contextual Patterns

#### 9.1 Head-to-Head Derby Clashes & Rivalry Grudges
- **What should we check?**: Direct comparisons between rival managers or H2H league matchups where the margin of victory was decided by late bonus points or captain choices.
- **Why can this be interesting?**: Drives local community engagement and league rivalries.
- **What data/fact would be needed?**: H2H fixture pairings, manager scores, point margins, key head-to-head player differentials.
- **Is this covered by existing detector?**: Yes (`DET_RIVAL_DERBY_CLASH` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 9.2 Photo Finish / 1-Point Margins
- **What should we check?**: GW score or overall rank differences decided by a single point (1-point margin).
- **Why can this be interesting?**: Heartbreak vs triumph determined by the thinnest possible margin.
- **What data/fact would be needed?**: Point difference between two managers = 1 point.
- **Is this covered by existing detector?**: Yes (`DET_RIVAL_PHOTO_FINISH` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 9.3 All-Time League High Score & Record Breakers
- **What should we check?**: A manager breaking the historical single-GW score record across the entire history of the Kino league.
- **Why can this be interesting?**: Milestone achievement that rewrites league history.
- **What data/fact would be needed?**: Current GW score, historical maximum GW score record in DB, comparison check.
- **Is this covered by existing detector?**: Yes (`DET_HIST_ALLTIME_HIGH` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

#### 9.4 Consistency Streaks & Multi-GW Trend Analysis
- **What should we check?**: Managers maintaining 3+ consecutive weeks of top 3 GW scores, or 3+ consecutive weeks of rank gains.
- **Why can this be interesting?**: Highlights sustained form rather than one-week luck.
- **What data/fact would be needed?**: Historical GW rank/score trajectories over N consecutive Gameweeks.
- **Is this covered by existing detector?**: Yes (`DET_HIST_STREAK_MASTER` — `FUTURE_DISABLED`).
- **Detection Status**: Registered in Engine Schema, needs activation.

---

## 5. Potential Detection Gaps Summary Table

The following table summarizes all identified **Detection Gaps** (concepts defined in this thinking inventory that are not yet covered by MVP or FUTURE_DISABLED detectors in the engine registry):

| Gap ID | Concept Title | Category | Description / Required Engine Enhancement |
| :--- | :--- | :--- | :--- |
| **GAP-01** | Temporal State Flagging | Governance | Engine needs to pass explicit `is_gw_finished` boolean in fact sheet context so Editor/Writer can apply live vs final phrasing rules deterministically. |
| **GAP-02** | Sold Player Haul Regret | Transfers | Explicit detection when a player transferred out by a manager scores ≥ 10 pts in the same GW. |
| **GAP-03** | Asymmetric Transfer Swap Disaster | Transfers | Direct pairing detector when Player In blanks (≤2 pts) AND Player Out hauls (≥8 pts) in the same transfer move. |
| **GAP-04** | Vice-Captain Activation Outcome | Captaincy | Tracking when Captain plays 0 minutes and measuring the net impact of the Vice-Captain taking the 2x multiplier. |
| **GAP-05** | Differential Ownership Rank Drivers | Ownership | Scanning low-owned players (<20% Kino ownership) who drove significant rank gains for their owners. |
| **GAP-06** | Template Flop Impact Analysis | Ownership | Scanning high-owned players (>70% Kino ownership) who blanked, measuring collective league floor depression. |

---

## 6. Guidelines for Future System Evolution

1. **No Logic Without Data**: Do not invent new database columns, API parameters, or synthetic metrics in this inventory. All logic must map to realizable data from the Supabase tables (`manager_gameweek_stats`, `manager_gameweek_picks`, `manager_transfers`, `bootstrap_static_cache`).
2. **Detector Decoupling**: When addressing a Detection Gap, update the Edge Function registry schema cleanly without modifying existing MVP logic.
3. **Editorial Priority**: The AI Editor must use `recommended_tier` and objective delta scores to prioritize stories. Tier 1 stories (Weekly Champion, Title Change) take narrative precedence, while Tier 2/3 stories provide supporting flavor.

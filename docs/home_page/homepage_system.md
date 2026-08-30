# FPL Kino Hub — Home Page Logic & Data Documentation

This document defines the display logic, data sources, and query behavior for every
feature/section on the Home Page of FPL Kino Hub.

---

## Tables Referenced on This Page

| Table | Purpose |
|---|---|
| `fpl_gameweeks` | Global gameweek metadata (deadlines, current/next/finished flags) |
| `manager_gameweek_picks` | Per-manager pick snapshot per GW (captain, vice-captain, squad) |
| `manager_gameweek_stats` | Per-manager score/rank stats per GW |
| `manager_transfers` | Explicit transfer log (player in/out per manager per GW) |
| `managers` | Master data of FPL Kino Indonesia league participants (41 managers) |
| `fpl_players` | Master player data (name, position, cost, etc.) |
| `fpl_teams` | Master EPL team data (short names, strength ratings) |
| `fpl_element_types` | Master position data (GK/DEF/MID/FWD labels) |
| `fpl_sync_logs` | Sync job run history (used for "Last Updated" indicator) |

**Important scoping note:** All stats on this page (GW Stats, Most Selected, Top
Captains, Transfer In/Out, League Standings) are **scoped to the 41 managers in FPL
Kino Indonesia**, not global FPL statistics. `fpl_gameweeks` contains global FPL
aggregate columns (`average_entry_score`, `most_selected`, etc.) but these are
**intentionally not used** for this page — they reflect all ~11M FPL managers
worldwide, not our league.

---

## 1. Hero Banner

**Purpose:** Static branding banner ("UNOFFICIAL LEAGUE — FPL KINO INDONESIA 2026/27").

**Data Source:** None. Hardcoded content.

**Logic:** Static text/season label, valid for the entire 2026/27 season. No DB
dependency. Update manually in code if/when the season changes.

---

## 2. Next Deadline Countdown

**Purpose:** Shows a live countdown to the next GW deadline the league hasn't passed yet.

**Data Source:** `fpl_gameweeks`

**Query:**
```sql
SELECT gw_number, deadline_time
FROM fpl_gameweeks
WHERE is_next = true
LIMIT 1
```

**Logic:**
- `is_next = true` marks the upcoming gameweek whose deadline has not yet passed.
- Frontend computes `deadline_time - now()` and renders Days / Hours / Minutes.
- Recompute every interval (e.g. every 60s) to keep the countdown live.
- When a GW's deadline passes, the sync job should flip that GW's `is_next` to
  `false` and set the next GW's `is_next` to `true` — e.g. once GW2's deadline
  passes, GW2 becomes `is_current = true, is_next = false`, and GW3 becomes
  `is_next = true`. The countdown then automatically targets GW3.

**Dependency / Known Limitation:**
This card's accuracy is entirely dependent on how recently the sync job updated
`is_current`/`is_next` in `fpl_gameweeks`. Since syncing is on-demand (no cron),
if no one opens the app around the time a deadline passes, the flags can go stale
until the next sync trigger — potentially showing a countdown at 0 or negative
until data refreshes.

---

## 3. GW{n} Stats (formerly "Previous GW Stats")

**Purpose:** Shows Average Score, Highest Score, and Most Captained player for the
most recently **completed** gameweek in the league.

**Data Source:** `fpl_gameweeks`, `manager_gameweek_stats`, `manager_gameweek_picks`,
`fpl_players`

**Step 1 — Determine target GW ("latest_gw"):**
```sql
SELECT gw_number
FROM fpl_gameweeks
WHERE finished = true
ORDER BY gw_number DESC
LIMIT 1
```
- Always the most recent **finished** GW — never a live/in-progress GW, since live
  scores may still be partial/provisional.
- **Expected behavior, not a bug:** while a new GW is live (`is_current = true`,
  `finished = false`), this card continues showing the *previous* finished GW's
  stats. The label reflects this explicitly (see below) so it's not mistaken for
  live data.

**Label:** Displayed explicitly as `"GW{latest_gw} STATS"` (e.g. "GW1 STATS"),
never as generic "Previous" or "Latest" — avoids ambiguity with the "Next Deadline"
card showing a different, later GW number.

**Step 2 — Average Score & Highest Score:**
```sql
SELECT
  ROUND(AVG(points)) AS average_score,
  MAX(points) AS highest_score
FROM manager_gameweek_stats
WHERE gw_number = :latest_gw
```
- `points` = GW-specific score (not `total_points`, which is cumulative).
- Scoped to the 41 league managers only (all rows in this table are league members).

**Step 3 — Most Captained (top 1):**
```sql
SELECT
  player_id,
  COUNT(*) AS captain_count,
  ROUND(
    COUNT(*) * 100.0 / (
      SELECT COUNT(DISTINCT manager_id)
      FROM manager_gameweek_stats
      WHERE gw_number = :latest_gw
    ), 0
  ) AS captain_pct
FROM manager_gameweek_picks
WHERE gw_number = :latest_gw AND is_captain = true
GROUP BY player_id
ORDER BY captain_count DESC
LIMIT 1
```
- Divisor is `COUNT(DISTINCT manager_id)` from the stats table for that GW (not a
  hardcoded 41), to stay accurate if a manager hasn't set a team yet.
- Join `player_id` → `fpl_players.web_name` for display name.

---

## 4. Most Selected (Top 3)

**Purpose:** Top 3 most-owned players among the 41 league managers for the latest
finished GW.

**Data Source:** `manager_gameweek_picks`, `fpl_players`, `fpl_teams`, `fpl_element_types`

**Query:**
```sql
SELECT
  p.player_id,
  fp.web_name,
  ft.short_name AS team_short,
  et.singular_name_short AS position,
  COUNT(*) AS owner_count
FROM manager_gameweek_picks p
JOIN fpl_players fp ON p.player_id = fp.player_id
JOIN fpl_teams ft ON fp.team_id = ft.team_id
JOIN fpl_element_types et ON fp.element_type = et.element_type_id
WHERE p.gw_number = :latest_gw
GROUP BY p.player_id, fp.web_name, ft.short_name, et.singular_name_short
ORDER BY owner_count DESC
LIMIT 3
```

**Logic:**
- Counts **all picks** (starting XI + bench) — not filtered to starting 11.
- Display value is an **absolute count** (e.g. "31"), not a percentage.
- Position label (e.g. "FWD") comes from `fpl_element_types.singular_name_short` via
  join on `fpl_players.element_type` — do not hardcode the 1–4 → GK/DEF/MID/FWD
  mapping in application code; always resolve it through this table.

---

## 5. Top Captains (Top 3)

**Purpose:** Top 3 most-captained players for the latest finished GW.

**Data Source:** `manager_gameweek_picks`, `fpl_players`, `fpl_teams`, `fpl_element_types`

**Query:**
```sql
SELECT
  p.player_id,
  fp.web_name,
  ft.short_name AS team_short,
  et.singular_name_short AS position,
  COUNT(*) AS captain_count
FROM manager_gameweek_picks p
JOIN fpl_players fp ON p.player_id = fp.player_id
JOIN fpl_teams ft ON fp.team_id = ft.team_id
JOIN fpl_element_types et ON fp.element_type = et.element_type_id
WHERE p.gw_number = :latest_gw AND p.is_captain = true
GROUP BY p.player_id, fp.web_name, ft.short_name, et.singular_name_short
ORDER BY captain_count DESC
LIMIT 3
```

**Note:** This query is logically identical to the "Most Captained" calculation in
Section 3 (Step 3), differing only in `LIMIT 1` vs `LIMIT 3`. **By design decision,
these remain two independent queries** (not a shared/derived single query) — Section
3 acts as a quick single-stat summary, this section as the full top-3 detail view.

---

## 6. Transfer In / Transfer Out (Top 3 each)

**Purpose:** Top 3 most-transferred-in and most-transferred-out players for the
latest finished GW.

**Data Source:** `manager_transfers`, `fpl_players`, `fpl_teams`

**Query — Transfer In:**
```sql
SELECT
  mt.player_in_id AS player_id,
  fp.web_name,
  ft.short_name AS team_short,
  fp.element_type,
  COUNT(*) AS transfer_in_count
FROM manager_transfers mt
JOIN fpl_players fp ON mt.player_in_id = fp.player_id
JOIN fpl_teams ft ON fp.team_id = ft.team_id
WHERE mt.gw_number = :latest_gw AND :latest_gw > 1
GROUP BY mt.player_in_id, fp.web_name, ft.short_name, fp.element_type
ORDER BY transfer_in_count DESC
LIMIT 3
```

**Query — Transfer Out:** identical, but grouped on `mt.player_out_id`.

**Logic:**
- Uses the explicit `manager_transfers` log — **not** derived by diffing picks
  between GWs. This is authoritative and avoids reconstruction errors.
- **GW1 excluded**: no transfer data is meaningful for the season's opening GW
  (initial squad selection isn't a "transfer"). If `latest_gw = 1`, render an
  empty/"N/A — first gameweek of the season" state instead of running this query.
- **Wildcard / Free Hit chips are intentionally included, not excluded.** Per FPL
  rules, each player can only be transferred in or out once per GW regardless of
  the mechanism (normal transfer or chip), so the count remains mathematically
  valid without special-casing chip usage.
- `transfer_time` (available in `manager_transfers`) is not used for this
  aggregation but is available for potential future features (e.g. deadline-day
  activity timelines).

---

## 7. League Standings (Preview, Top 5)

**Purpose:** Shows the top 5 ranked teams in the league by cumulative total points,
with a "View Full" link to the complete standings page.

**Data Source:** `manager_gameweek_stats`, `managers`

**Query:**
```sql
SELECT
  RANK() OVER (ORDER BY s.total_points DESC, m.team_name ASC) AS pos,
  m.team_name,
  m.manager_name,
  s.points AS gw_score,
  s.total_points AS tot
FROM manager_gameweek_stats s
JOIN managers m ON s.manager_id = m.manager_id
WHERE s.gw_number = :latest_gw
ORDER BY s.total_points DESC, m.team_name ASC
LIMIT 5
```

**Logic:**
- Ranking is computed from `total_points` (cumulative season total) — **not** the
  GW-specific `points`, and **not** the `rank`/`overall_rank` columns in
  `manager_gameweek_stats` (those reflect global FPL ranks, not league-internal
  ranks).
- **Tie-breaker:** when `total_points` is equal, sort alphabetically by
  `team_name` (not by GW score).
- **Ranking behavior on ties:** standard competition ranking (`RANK()`, skip-style)
  — tied teams share the same rank number, and the next distinct rank skips
  accordingly. Example:
  ```
  Rank 3 — Dopamine FC   — GW 54 — Total 203
  Rank 3 — Korakora FC   — GW 73 — Total 203
  Rank 5 — Zubi FC       — GW 53 — Total 198   (rank 4 is skipped)
  ```
- "View Full" navigates to the League page, which reuses this same query without
  `LIMIT 5` (plus pagination).

---

## 8. GW Status Badge (Sidebar)

**Purpose:** Shows the live/current gameweek status at the bottom of the sidebar
(e.g. "GW1 STATUS ● LIVE NOW").

**Data Source:** `fpl_gameweeks`

**Query:**
```sql
SELECT gw_number, is_current, finished
FROM fpl_gameweeks
WHERE is_current = true
LIMIT 1
```

**Status label logic:**
```
IF is_current = true AND finished = false → "LIVE NOW"
IF finished = true                        → "FINISHED"
IF is_next = true                         → "UPCOMING"
```

**Implementation note:** The label must always reflect the actual
`gw_number` returned by the `is_current = true` query — it must never be
hardcoded. (Earlier screenshots/mockups showed "GW38" here while "Next Deadline"
showed GW2; this was confirmed to be leftover dummy/test data, not intentional
behavior, and must not be replicated in the real implementation.)

---

## 9. Last Updated Indicator

**Purpose:** Small transparency indicator (e.g. footer/sidebar text: "Last updated
12 minutes ago") showing when data was last synced, so users aren't confused by
staleness in time-sensitive cards like Next Deadline or GW Status.

**Data Source:** `fpl_sync_logs`

**Query:**
```sql
SELECT completed_at
FROM fpl_sync_logs
WHERE status = 'success'
ORDER BY completed_at DESC
LIMIT 1
```

**Logic:**
- Frontend computes relative time (`now() - completed_at`) and renders as
  "X minutes/hours ago".
- Only considers successful syncs (`status = 'success'`) — a failed sync run
  shouldn't be reported as the "last update" since its data may be incomplete
  or invalid.
- Directly addresses the staleness/on-demand-sync limitation noted in Sections 2
  and 8 — gives users visibility into data freshness without needing to guess.

---

## Open Items / Future Considerations

- Consider whether `manager_transfers.transfer_time` should power a future
  "deadline day activity" feature.
- League Standings "View Full" page should reuse the Section 7 query pattern with
  pagination instead of `LIMIT 5`.
- **Deliberately excluded from Home Page, reserved for other pages:**
  - Chip usage context (`manager_chips` — e.g. "Wildcard used by X managers this
    GW", Triple Captain indicators) → planned for the Newsletter page instead.
  - Manager avatars (`manager_photos`) → not used in the Home Page League
    Standings preview (kept text-only since it's just a 5-row preview); may be
    used on the full League page.
  - `fixtures` table (per-match `started`/`finished` flags) → not needed for the
    Home Page GW Status Badge, which only checks GW-level `is_current`. May be
    relevant for a more granular live-match view elsewhere.
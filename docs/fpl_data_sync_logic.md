# FPL DATA SYNC LOGIC v1.0

## 1. Purpose

This document is the authoritative **Single Source of Truth** for the FPL Data Synchronization System within **FPL Kino Hub**. It defines the deterministic rules, algorithms, data structures, state machine lifecycles, and synchronization governance governing how raw data from the official Fantasy Premier League (FPL) API is ingested, processed, and persisted in Supabase Postgres.

It serves as the mandatory specification for:
- Supabase `pg_cron` Automation Layer & Schedulers
- Supabase Edge Functions Data Synchronization Layer
- Fixture Clustering & Matchday Snapshot Engine
- Live Player Performance Ingestion (`player_gameweek_live`)
- Live Manager Score & Ranking Engine (`manager_gameweek_stats`)
- Matchday Completion & Final Sync Passes
- Gameweek Lock & Finalization Routines

---

## 2. Core Principles

1. **GAMEWEEK ≠ MATCHDAY**: A Gameweek consists of multiple fixtures played across several days. A single Gameweek may contain multiple distinct Matchdays.
2. **MATCHDAY CLUSTERING**: A Matchday is defined algorithmically as a logical cluster of fixtures inside the same Gameweek separated by less than or equal to 6 hours between consecutive kickoffs.
3. **NO CALENDAR DATE ASSUMPTIONS**: Matchday clustering MUST NOT use `DATE(kickoff_time)` or rely on fixed calendar day names (Friday, Saturday, etc.).
4. **TIMEZONE BOUNDARY**: `kickoff_time` is stored and calculated in UTC. WIB (`Asia/Jakarta`, UTC+7) is used for display formatting and daily operational check windows.
5. **INDEPENDENT MATCHDAY LIFECYCLE**: Each Matchday undergoes its own lifecycle (`UPCOMING` → `ACTIVE` → `COMPLETED` → `FINAL SYNC`) independently of remaining Matchdays in the same Gameweek.
6. **PROVISIONAL GAMEWEEK STATE**: As long as a Gameweek contains uncompleted Matchdays, all Gameweek-level standings and statistics remain `PROVISIONAL`.
7. **REAL-TIME LIVE AGGREGATION**: During active matches, live player scores must immediately recalculate live manager scores and internal Kino league standings.
8. **IDEMPOTENT EXECUTIONS**: All synchronization routines must be 100% idempotent. Repeated calls with the same payload must not duplicate or corrupt database state.

---

## 3. Terminology

- **Fixture**: A single football match between a home team (`team_h`) and away team (`team_a`) scheduled at a specific UTC `kickoff_time`.
- **Gameweek (GW)**: The official FPL competition scoring period (GW1 through GW38).
- **Matchday**: A logical cluster of fixtures within the same Gameweek where consecutive kickoff gaps are $\le 6\text{ hours}$.
- **Live State**: The transient, real-time performance state of players and managers while matches are actively being played.
- **Provisional State**: Standings or scores for a Gameweek that is still ongoing (matches remaining).
- **Final State**: Locked historical records for a Matchday or Gameweek after all assigned fixtures are finished and verified.
- **Matchday Completion**: The state reached when 100% of fixtures in a specific Matchday cluster have `started = true AND finished = true`.
- **Gameweek Completion**: The state reached when 100% of fixtures across ALL Matchdays in a Gameweek have `finished = true`.
- **Final Sync**: The authoritative final data ingestion pass executed immediately after all matches in a Matchday or Gameweek finish.

---

## 4. Gameweek Model

The system enforces a hierarchical 3-level data hierarchy:

```
┌──────────────────────────────────────────────────────────┐
│                      GAMEWEEK (GW N)                     │
│    Official FPL scoring period (e.g. GW3)                │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼  1-to-Many
┌──────────────────────────────────────────────────────────┐
│                     MATCHDAY CLUSTER                      │
│    Logical session of fixtures (Gap ≤ 6 hrs)              │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼  1-to-Many
┌──────────────────────────────────────────────────────────┐
│                      INDIVIDUAL FIXTURE                  │
│    Single match (e.g., ARS vs CHE @ 15:30 UTC)           │
└──────────────────────────────────────────────────────────┘
```

A Gameweek is **NOT** a single event. It is a container for 1 or more Matchday clusters.

---

## 5. Matchday Definition (Session-Gap Algorithm)

Matchdays are identified deterministically using the **Session-Gap Matchday Clustering Algorithm**:

### Algorithm Rules:
1. Filter all fixtures belonging to a target `gw_number`.
2. Sort fixtures chronologically by `kickoff_time ASC`, using `fixture_id ASC` as a tie-breaker.
3. Assign the first fixture to `Matchday Index = 1`.
4. For each subsequent fixture ($i$), calculate the gap in hours to the previous fixture ($i-1$):
   $$\Delta T = \frac{\text{kickoff\_time}_i - \text{kickoff\_time}_{i-1}}{3600 \text{ seconds}}$$
5. **Clustering Threshold ($T_{\text{gap}} = 6.0\text{ hours}$)**:
   - If $\Delta T > 6.0\text{ hours}$ $\longrightarrow$ Start a **NEW Matchday cluster** (`Matchday Index = Matchday Index + 1`).
   - If $\Delta T \le 6.0\text{ hours}$ $\longrightarrow$ Assign to the **CURRENT Matchday cluster**.

### Pseudocode:
```typescript
function clusterGameweekMatchdays(fixtures: Fixture[]): MatchdayCluster[] {
  // Step 1: Sort fixtures chronologically
  const sorted = [...fixtures].sort((a, b) => {
    const diff = new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime();
    return diff !== 0 ? diff : a.fixture_id - b.fixture_id;
  });

  const clusters: MatchdayCluster[] = [];
  let currentCluster: Fixture[] = [];
  let currentClusterIndex = 1;

  for (let i = 0; i < sorted.length; i++) {
    const fixture = sorted[i];
    if (i === 0) {
      currentCluster.push(fixture);
    } else {
      const prevFixture = sorted[i - 1];
      const gapMs = new Date(fixture.kickoff_time).getTime() - new Date(prevFixture.kickoff_time).getTime();
      const gapHours = gapMs / (1000 * 60 * 60);

      if (gapHours > 6.0) {
        // Gap > 6 hours -> Save current cluster and start new one
        clusters.push({
          matchdayIndex: currentClusterIndex,
          fixtures: currentCluster,
        });
        currentClusterIndex++;
        currentCluster = [fixture];
      } else {
        // Gap <= 6 hours -> Add to current cluster
        currentCluster.push(fixture);
      }
    }
  }

  if (currentCluster.length > 0) {
    clusters.push({
      matchdayIndex: currentClusterIndex,
      fixtures: currentCluster,
    });
  }

  return clusters;
}
```

---

## 6. Matchday Examples (Verified Real Data)

### Gameweek 1 Example
- **Matchday 1**: `ARS vs COV` (Sat 02:00 WIB / Fri 19:00 UTC) — *1 fixture* (Gap to next: 16.5 hrs)
- **Matchday 2**: `HUL vs MUN`, `NFO vs LEE`, `EVE vs CRY`, `IPS vs SUN`, `BRE vs TOT` (Sat 18:30–23:30 WIB) — *5 fixtures* (Gap to next: 20.5 hrs)
- **Matchday 3**: `MCI vs BOU`, `BHA vs AVL`, `NEW vs LIV` (Sun 20:00–22:30 WIB) — *3 fixtures* (Gap to next: 27.5 hrs)
- **Matchday 4**: `FUL vs CHE` (Tue 02:00 WIB / Mon 19:00 UTC) — *1 fixture*

### Gameweek 2 Example
- **Matchday 1**: `CRY vs MCI` (Sat 02:00 WIB) — *1 fixture* (Gap: 16.5 hrs)
- **Matchday 2**: `LIV vs NFO`, `BOU vs EVE`, `COV vs HUL`, `TOT vs NEW` (Sat 18:30–23:30 WIB) — *4 fixtures* (Gap: 20.5 hrs)
- **Matchday 3**: `CHE vs BHA`, `LEE vs BRE`, `SUN vs FUL`, `MUN vs IPS` (Sun 20:00–22:30 WIB) — *4 fixtures* (Gap: 27.5 hrs)
- **Matchday 4**: `AVL vs ARS` (Tue 02:00 WIB) — *1 fixture*

### Gameweek 3 Example
- **Matchday 1**: `IPS vs LIV` (Sat 02:00 WIB) — *1 fixture*
- **Matchday 2**: `NEW vs BOU`, `BRE vs SUN`, `BHA vs LEE`, `FUL vs CRY`, `MCI vs COV`, `NFO vs TOT`, `HUL vs AVL` (Sat 18:30–23:30 WIB) — *7 fixtures*
- **Matchday 3**: `EVE vs MUN`, `ARS vs CHE` (Sun 20:00–22:30 WIB) — *2 fixtures*

### Gameweek 14 (Mid-Week Gameweek Example)
- **Matchday 1**: All 10 matches kickoff on Sat 2026-12-05 22:00 WIB — *10 fixtures (Single Matchday cluster)*

---

## 7. Fixture States

A fixture in `public.fixtures` exists in one of six operational states:

| State | DB Conditions | Description |
| :--- | :--- | :--- |
| `UPCOMING` | `started = false AND finished = false` | Match has not kicked off yet. |
| `STARTED` | `started = true AND finished = false` | Match is currently active (live). |
| `LIVE` | `started = true AND finished = false AND minutes > 0` | Match actively in progress with live events. |
| `FINISHED` | `started = true AND finished = true` | Match officially concluded and verified. |
| `POSTPONED` | `kickoff_time` updated to TBD / future date | Match moved outside current match window. |
| `RESCHEDULED` | `kickoff_time` assigned new timestamp | Match reassigned to new date/time slot. |

---

## 8. Matchday States

A Matchday cluster exists in one of three operational states:

```
┌─────────────────┐       Kickoff of 1st fixture       ┌─────────────────┐
│    UPCOMING     │ ─────────────────────────────────> │     ACTIVE      │
└─────────────────┘                                    └────────┬────────┘
                                                                │
                                                                │ 100% fixtures finished
                                                                ▼
                                                       ┌─────────────────┐
                                                       │    COMPLETED    │
                                                       └─────────────────┘
```

- **`UPCOMING`**: 0% of fixtures in the Matchday cluster have started (`started = false`).
- **`ACTIVE`**: At least 1 fixture has `started = true` AND at least 1 fixture has `finished = false`.
- **`COMPLETED`**: 100% of fixtures in the Matchday cluster have `started = true AND finished = true`.

---

## 9. Gameweek States

A Gameweek in `fpl_gameweeks` exists in one of three operational states:

- **`UPCOMING`**: `is_current = false AND finished = false`.
- **`ACTIVE / PROVISIONAL`**: `is_current = true AND finished = false` (Matchdays still active or remaining).
- **`FINAL`**: `finished = true AND data_checked = true` (All Matchdays 100% completed and locked).

---

## 10. Daily Scheduler Logic (07:00 WIB Operational Check)

The daily scheduler (`fpl-daily-scheduler`) runs at **07:00 WIB** (`0 0 * * *` UTC).

### Purpose:
1. Sync master static reference tables (`fpl_teams`, `fpl_element_types`, `fpl_phases`, `fpl_chips`, `fpl_players`).
2. Sync updated fixture schedules (`fixtures`).
3. Check whether today's WIB date contains any active or upcoming Matchdays.

### Operational Window Rule:
- Convert fixture `kickoff_time` to WIB date (`kickoff_time AT TIME ZONE 'Asia/Jakarta'`).
- If today's WIB date contains **NO fixtures**:
  $\longrightarrow$ Mark system state as **`NO FIXTURE TODAY`**. No heavy live sync required.
- If today's WIB date contains **fixtures**:
  $\longrightarrow$ Mark system state as **`ACTIVE MATCHDAY WINDOW`**. Active live sync cron is enabled to monitor kickoff times.

---

## 11. Active Live Sync Logic (`fpl-live-sync`)

The active live sync function runs on a **1-minute cron schedule** (`* * * * *`).

### Self-Gating Fast-Exit Algorithm:
To prevent unnecessary API requests when no matches are being played:
1. Query `fixtures` for current `gw_number` where `is_current = true`.
2. Check if any fixture satisfies:
   - `started = true AND finished = false` (Active Live Match), OR
   - `started = false AND kickoff_time <= NOW() + INTERVAL '15 minutes'` (Imminent Kickoff).
3. If **NO active or imminent fixture exists**:
   $\longrightarrow$ **FAST EXIT (< 50ms execution time)**. Return `{ active_matches: 0, status: "idle" }`.
4. If **active fixture exists**:
   $\longrightarrow$ Proceed with Live Sync Routine.

### Live Sync Routine Execution Steps:
1. Fetch live player stats from FPL API: `GET /api/event/{gw_number}/live/`.
2. Upsert raw live stats into `player_gameweek_live` keyed by `(player_id, gw_number, fixture_id)`.
3. Fetch manager starting picks from `manager_gameweek_picks`.
4. Calculate Live Manager Scores (Section 12).
5. Upsert live total points into `manager_gameweek_stats.points` and `total_points`.
6. Recalculate internal Kino league rankings.
7. Record execution log in `fpl_sync_logs` with `sync_type = 'live'`.

---

## 12. Manager Live Points Calculation

During live matches, manager Gameweek scores are calculated dynamically by aggregating live player scores:

$$\text{Manager Live GW Points} = \sum_{p \in \text{Starting XI}} \left( \text{pick\_multiplier}_p \times \text{player\_live\_points}_p \right) - \text{event\_transfers\_cost}$$

### Captain & Vice-Captain Rules:
- **Normal Captain**: `pick_multiplier = 2` (or `3` if Triple Captain active).
- **Captain Ghosting (0 Minutes)**:
  - If Captain `minutes == 0` AND Captain fixture `finished == true`:
    - Captain multiplier becomes `0`.
    - Vice-Captain multiplier becomes `2` (or `3`).
- **Bench Players**: `pick_multiplier = 0` (unless Bench Boost active, where `multiplier = 1`).

---

## 13. Database Synchronization Responsibilities

| Data Category | Target Table | Stage | Source Endpoint | Function |
| :--- | :--- | :--- | :--- | :--- |
| Master Reference | `fpl_teams`, `fpl_element_types`, `fpl_chips` | Daily | `/api/bootstrap-static/` | `sync-fpl-reference-data` |
| Master Players | `fpl_players` | Daily | `/api/bootstrap-static/` | `sync-fpl-current-state` |
| Fixtures | `fixtures` | Daily & Live | `/api/fixtures/` | `sync-fpl-fixtures` |
| Player Live Points | `player_gameweek_live` | **LIVE** | `/api/event/{gw}/live/` | `fpl-live-sync` |
| Manager Live Points | `manager_gameweek_stats` | **LIVE** | Calculated in DB | `fpl-live-sync` |
| Manager Squad Picks | `manager_gameweek_picks` | Post-Deadline | `/api/entry/{id}/event/{gw}/picks/` | `sync-manager-gameweek-picks` |
| Manager Transfers | `manager_transfers` | Post-Deadline | `/api/entry/{id}/transfers/` | `sync-manager-transfers` |
| Player Final Stats | `player_gameweek_stats` | **Matchday Final** | `player_gameweek_live` | `finalize-matchday` |
| Player Snapshots | `player_gameweek_snapshot` | **Matchday Final** | `/api/bootstrap-static/` | `finalize-matchday` |
| Gameweek Lock | `fpl_gameweeks.data_checked` | **GW Final** | Master Check | `finalize-gameweek` |

---

## 14. Matchday Completion & Final Sync

When the last unfinished fixture in a Matchday cluster reaches `finished = true`:

1. **Detection**: `fpl-live-sync` detects that 100% of fixtures in `Matchday Index N` have `finished = true`.
2. **Execute Matchday Final Sync**:
   - Perform one final fetch of `GET /api/event/{gw}/live/` to ensure final bonus points (BPS) and clean sheet points are ingested.
   - Copy final records from `player_gameweek_live` into `player_gameweek_stats` for that Matchday's fixtures.
   - Recalculate final manager scores for Matchday $N$.
3. **Persist Matchday Completion**: Mark Matchday cluster state as **`COMPLETED`**.
4. **Trigger Story Generator**: Notify AI Editor/Writer pipeline that a Matchday snapshot issue is ready for publication.

---

## 15. Gameweek Finalization

Gameweek Finalization occurs **ONLY** when all Matchdays in a Gameweek are complete:

```sql
-- Gameweek Finalization Condition:
fpl_gameweeks.finished = true
AND
NOT EXISTS (
  SELECT 1 FROM public.fixtures 
  WHERE gw_number = current_gw AND finished = false
)
```

### Execution Steps:
1. Lock all player snapshots in `player_gameweek_snapshot` for `gw_number`.
2. Set `fpl_gameweeks.data_checked = true`.
3. Set `fpl_gameweeks.is_current = false` and set `gw_number + 1` to `is_current = true`.
4. Mark Gameweek state as **`FINAL`**.

---

## 16. Scheduler Architecture

```
                    DAILY SCHEDULER (07:00 WIB)
                                 │
                 Sync master static data & fixtures
               Check WIB fixture schedule for today
                                 │
                   Any fixture scheduled today?
                      /                 \
                    NO                   YES
                    │                     │
              IDLE FOR DAY      ACTIVE MATCHDAY WINDOW
                                          │
                              SELF-GATING ACTIVE SYNC
                                (Every 1 min cron)
                                          │
                               Are matches live / starting?
                                   /             \
                                 NO               YES
                                 │                 │
                            EXIT (Fast)     1. Sync player live pts
                                            2. Calculate manager live pts
                                            3. Recalculate Kino rank
                                                   │
                                           All Matchday fixtures finished?
                                               /               \
                                             NO                 YES
                                             │                   │
                                        CONTINUE           MATCHDAY FINAL SYNC
                                                                 │
                                                          Lock Matchday Stats
                                                                 │
                                                          Is GW completed?
                                                             /       \
                                                           NO         YES
                                                           │           │
                                                       MATCHDAY     GAMEWEEK
                                                       COMPLETE     FINALIZED
```

---

## 17. Failure & Recovery Rules

- **FPL API Failure (503 / 429)**: Edge function catches error, logs `status = 'failed'` in `fpl_sync_logs`, and exits cleanly. Next cron tick retries after 1 minute.
- **Database Write Failure**: Transaction rolls back; logged as error.
- **Function Crash / Timeout**: Idempotent design allows the next minute's cron tick to safely resume where the crashed execution left off.
- **Postponed Fixture**: Automatically assigned a gap $> 6\text{ hrs}$ when rescheduled, creating an isolated future Matchday cluster.
- **Midnight WIB Crossing**: Handled naturally by UTC gap threshold without date boundary truncation.

---

## 18. Idempotency Rules

All sync operations use `UPSERT` with explicit primary key conflict resolution:
- `fixtures` $\longrightarrow$ `ON CONFLICT (fixture_id)`
- `player_gameweek_live` $\longrightarrow$ `ON CONFLICT (player_id, gw_number, fixture_id)`
- `manager_gameweek_stats` $\longrightarrow$ `ON CONFLICT (manager_id, gw_number)`

Running any sync function 100 times produces identical database state as running it once.

---

## 19. Data Freshness Model

| State | Freshness Level | Standings Label |
| :--- | :--- | :--- |
| **LIVE** | Real-Time (1-minute latency) | `LIVE · PROVISIONAL` |
| **MATCHDAY FINAL** | Verified (End of Matchday) | `PROVISIONAL` (If GW has future matches) |
| **GAMEWEEK FINAL** | Authoritative Locked Record | `FINAL` |

---

## 20. Critical Invariants

- **INVARIANT 1**: A Gameweek may contain multiple Matchdays.
- **INVARIANT 2**: Matchday clustering is determined by a 6-hour kickoff gap threshold, NOT calendar dates.
- **INVARIANT 3**: A completed Matchday does NOT imply a completed Gameweek.
- **INVARIANT 4**: A Gameweek cannot be `FINAL` while any of its assigned fixtures remain unfinished.
- **INVARIANT 5**: Live manager standings MUST be derived in real-time from `player_gameweek_live` and `manager_gameweek_picks`.
- **INVARIANT 6**: Final performance stats MUST be locked independently upon each Matchday completion.
- **INVARIANT 7**: All data ingestion routines MUST be strictly idempotent.

---

## 21. Implementation Notes

- **LOCKED**: 6-hour gap clustering algorithm, live manager score calculation formula, self-gating fast-exit logic, Matchday vs Gameweek state separation.
- **NOT YET LOCKED**: Specific edge function folder naming refactoring, custom RPC helper optimization.

---

## 22. Future Extension Points

- Support for dynamic Double Gameweek (DGW) multi-fixture tracking per player.
- Support for Blank Gameweek (BGW) automatic idle scheduling.
- Integration of FPL official fixture delay Webhooks (if made available).

---

## 23. v1.0 Locked Decisions

1. Gameweek $\neq$ Matchday.
2. Matchday is defined using the **Session-Gap Clustering Algorithm with a 6-Hour Threshold ($T_{\text{gap}} = 6.0\text{ hours}$)**.
3. No calendar-date or fixed weekday grouping logic.
4. `player_gameweek_live` updates MUST recalculate live manager points in real-time.
5. Matchdays complete and finalize independently of remaining Gameweek fixtures.
6. Gameweek status remains `PROVISIONAL` until all Gameweek fixtures are finished.

---

STATUS:
FPL DATA SYNC LOGIC v1.0 — READY FOR IMPLEMENTATION

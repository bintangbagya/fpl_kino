# FPL KINO — CRON & SCHEDULER ARCHITECTURE

## Source of Truth — Automation Layer

### Season 2026/27

> Dokumen ini mengatur kapan Edge Function FPL KINO dijalankan, bagaimana scheduler menentukan kondisi Gameweek, dan bagaimana cron jobs bekerja.
>
> **Business logic tetap berada di masing-masing Edge Function. Cron hanya bertugas menjalankan function pada interval tertentu.**

---

# 1. OBJECTIVE

Automation system harus:

* menjaga data Supabase tetap sinkron dengan FPL API
* menangani Gameweek yang sedang berjalan
* melakukan live player sync ketika pertandingan berlangsung
* menyimpan snapshot player secara berkala
* mendeteksi Gameweek yang sudah benar-benar selesai
* melakukan finalization satu kali
* aman jika function dijalankan berulang
* tidak melakukan request FPL API yang tidak diperlukan

---

# 2. ARCHITECTURE

```text
                    SUPABASE CRON
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
       DAILY           LIVE          FINALIZE
          │              │              │
          ▼              ▼              ▼
   daily scheduler   live sync     finalize GW
          │
          ▼
    sync functions
```

Cron menentukan:

```text
WHEN
```

Edge Function menentukan:

```text
WHAT
```

---

# 3. EDGE FUNCTIONS

Current functions:

```text
sync-fpl-current-state
sync-fpl-fixtures

sync-manager-gameweek-history
sync-manager-transfers
sync-manager-gameweek-picks

sync-player-gameweek-stats
sync-player-gameweek-snapshot
sync-player-gameweek-live

finalize-gameweek
```

---

# 4. CRON JOBS

Initial production schedule:

| Job                             | Cron           | Frequency               |
| ------------------------------- | -------------- | ----------------------- |
| `fpl-daily-scheduler`           | `0 0 * * *`    | Daily                   |
| `sync-player-gameweek-snapshot` | `*/30 * * * *` | Every 30 minutes        |
| `sync-player-gameweek-live`     | `* * * * *`    | Every minute            |
| `finalize-gameweek`             | `30 * * * *`   | Every hour at minute 30 |

Timezone:

```text
UTC
```

Supabase cron schedules should be interpreted in UTC unless explicitly configured otherwise.

---

# 5. DAILY SCHEDULER

## Function

```text
fpl-daily-scheduler
```

## Cron

```text
0 0 * * *
```

Runs once per day.

---

# 6. DAILY SCHEDULER RESPONSIBILITY

The daily scheduler orchestrates daily data synchronization.

Expected flow:

```text
fpl-daily-scheduler
        │
        ├── sync-fpl-current-state
        │
        ├── sync-fpl-fixtures
        │
        ├── sync-manager-gameweek-history
        │
        ├── sync-manager-transfers
        │
        └── sync-manager-gameweek-picks
```

The scheduler should execute these functions in a logical order.

Recommended order:

```text
1. sync-fpl-current-state
2. sync-fpl-fixtures
3. sync-manager-gameweek-history
4. sync-manager-transfers
5. sync-manager-gameweek-picks
```

Reason:

```text
master/current state
        ↓
fixtures
        ↓
manager data
```

---

# 7. DAILY PLAYER STATS

`sync-player-gameweek-stats` should NOT be treated as the live player updater.

Its purpose is historical/player Gameweek data synchronization.

Recommended behavior:

```text
Current GW:
    sync only if required

Finished GW:
    historical sync / correction if needed
```

The definitive historical record is created by:

```text
finalize-gameweek
```

Therefore the daily scheduler must not blindly overwrite finalized historical data.

---

# 8. PLAYER SNAPSHOT CRON

## Function

```text
sync-player-gameweek-snapshot
```

## Cron

```text
*/30 * * * *
```

Runs every 30 minutes.

---

# 9. SNAPSHOT CONDITION

The function itself determines whether a snapshot should be synced.

It should:

```text
1. Find fpl_gameweeks.is_current = true
2. Check data_checked
3. If finalized → skip
4. If not finalized → sync snapshot
```

Therefore cron can safely run continuously.

Example:

```text
GW2
is_current = true
data_checked = false

→ sync
```

After finalization:

```text
GW2
data_checked = true

→ skip
```

---

# 10. WHY SNAPSHOT IS EVERY 30 MINUTES

Snapshot data is not true live match-performance data.

It is used for:

```text
price
ownership
transfers
form
ICT
expected metrics
player availability
```

Therefore:

```text
1 minute
```

is unnecessary.

30 minutes provides reasonable historical state resolution without excessive API requests.

---

# 11. PLAYER LIVE CRON

## Function

```text
sync-player-gameweek-live
```

## Cron

```text
* * * * *
```

Runs every minute.

---

# 12. LIVE SYNC MUST BE CONDITION-AWARE

The function must NOT blindly sync FPL live data every minute when no match is happening.

Before requesting:

```text
/api/event/{gw}/live/
```

it should determine whether there is an active fixture window.

Use:

```text
fixtures
```

as the local source of truth.

Relevant fields:

```text
gw_number
kickoff_time
started
finished
```

---

# 13. LIVE MATCH CONDITION

For current Gameweek:

```text
There is at least one fixture where:

started = true
AND
finished = false
```

Then:

```text
sync-player-gameweek-live
```

should run.

If there are no such fixtures:

```text
SKIP
```

This prevents unnecessary API requests.

---

# 14. EXAMPLE LIVE CONDITION

Example:

```text
GW2

Fixture A
started = true
finished = false

Fixture B
started = true
finished = true

Fixture C
started = false
finished = false
```

Result:

```text
ACTIVE MATCH EXISTS
        ↓
RUN LIVE SYNC
```

---

# 15. BEFORE MATCH STARTS

Example:

```text
All fixtures:

started = false
finished = false
```

Result:

```text
NO ACTIVE MATCH
        ↓
SKIP LIVE SYNC
```

---

# 16. AFTER ALL MATCHES FINISH

Example:

```text
All fixtures:

started = true
finished = true
```

Result:

```text
NO ACTIVE MATCH
        ↓
SKIP LIVE SYNC
```

Final historical processing is handled separately by:

```text
finalize-gameweek
```

---

# 17. FINALIZE CRON

## Function

```text
finalize-gameweek
```

## Cron

```text
30 * * * *
```

Runs hourly at minute 30.

Examples:

```text
00:30
01:30
02:30
03:30
...
```

---

# 18. FINALIZE CONDITION

The function looks for:

```text
fpl_gameweeks.finished = true
AND
fpl_gameweeks.data_checked = false
```

Then checks:

```text
ALL fixtures.finished = true
```

Only then can the Gameweek be finalized.

---

# 19. FINALIZE FLOW

```text
finished = true?
       │
       ├── NO → WAIT
       │
       └── YES
             │
             ▼
     all fixtures finished?
             │
       ┌─────┴─────┐
       │           │
      NO          YES
       │           │
      WAIT         ▼
              live → stats
                   │
                   ▼
             final snapshot
                   │
                   ▼
             data_checked=true
```

---

# 20. FINALIZE IS IDEMPOTENT

Once:

```text
data_checked = true
```

the Gameweek must not be finalized again.

Example:

```text
GW1
finished = true
data_checked = true
```

Next cron run:

```text
GW1 not selected
```

This prevents duplicate processing.

---

# 21. CRON DEPENDENCY

Logical order:

```text
DAILY
│
├── current state
│
├── fixtures
│
└── manager data
│
│
LIVE
│
└── player live
│
│
SNAPSHOT
│
└── player market snapshot
│
│
FINALIZE
│
└── final historical data
```

---

# 22. CRON DOES NOT DETERMINE GAMEWEEK STATE

Do NOT hardcode:

```text
GW2 is live
GW3 is live
```

The functions must dynamically determine the state from:

```text
fpl_gameweeks
fixtures
```

This allows the system to continue working throughout the season.

---

# 23. NO HARD-CODED GAMEWEEK NUMBER

Avoid logic such as:

```ts
if (gwNumber === 2) {
   ...
}
```

Use:

```text
fpl_gameweeks.is_current
```

or other database state.

The system must automatically move:

```text
GW2
↓
GW3
↓
GW4
↓
...
↓
GW38
```

without code changes.

---

# 24. OVERLAPPING CRON SAFETY

Because jobs may overlap, every Edge Function must be safe to run repeatedly.

Use:

```text
upsert
```

where appropriate.

Primary keys prevent duplicate historical records.

Examples:

```text
player_gameweek_live
(player_id, gw_number, fixture_id)

player_gameweek_stats
(player_id, gw_number, fixture_id)

player_gameweek_snapshot
(player_id, gw_number)

manager_gameweek_stats
(manager_id, gw_number)
```

---

# 25. API REQUEST EFFICIENCY

Do not call FPL API unnecessarily.

Examples:

```text
No active fixture
→ don't fetch /event/{gw}/live/

Finished + finalized GW
→ don't snapshot again

No unfinished GW
→ finalize function returns immediately
```

---

# 26. CURRENT GAMEWEEK EXAMPLE

Current database state:

```text
GW1
finished = true
data_checked = true

GW2
finished = false
data_checked = false
is_current = true

GW3
is_next = true
```

Expected behavior:

### Daily scheduler

```text
RUN
→ current state
→ fixtures
→ manager sync
```

### Snapshot

```text
GW2 current
GW2 not finalized

→ RUN
```

### Live

If active fixture exists:

```text
→ RUN
```

If no active fixture:

```text
→ SKIP
```

### Finalize

```text
No finished + unchecked GW

→ NO ACTION
```

---

# 27. WHEN GW2 FINISHES

FPL eventually changes:

```text
GW2
finished = true
```

Fixtures become:

```text
finished = true
```

Then:

```text
finalize-gameweek
```

detects:

```text
finished = true
data_checked = false
all fixtures finished = true
```

Then:

```text
player_gameweek_live
        ↓
player_gameweek_stats

bootstrap-static
        ↓
player_gameweek_snapshot

data_checked = true
```

---

# 28. AFTER GW2 FINALIZATION

State becomes:

```text
GW2
finished = true
data_checked = true
```

Future finalize runs:

```text
SKIP
```

Future snapshot runs:

```text
SKIP for GW2
```

Live sync moves naturally to the next active Gameweek.

---

# 29. CRON TABLE — FINAL REFERENCE

| Function                        | Cron           | Condition                                              |
| ------------------------------- | -------------- | ------------------------------------------------------ |
| `fpl-daily-scheduler`           | `0 0 * * *`    | Always daily                                           |
| `sync-player-gameweek-snapshot` | `*/30 * * * *` | Current GW not finalized                               |
| `sync-player-gameweek-live`     | `* * * * *`    | Active fixture exists                                  |
| `finalize-gameweek`             | `30 * * * *`   | Finished GW + all fixtures finished + not data_checked |

---

# 30. IMPORTANT: MANAGER SYNC FREQUENCY

Manager data does not need minute-level syncing.

Manager functions are intended for periodic/daily synchronization:

```text
sync-manager-gameweek-history
sync-manager-transfers
sync-manager-gameweek-picks
```

Primary daily execution:

```text
fpl-daily-scheduler
```

If later the dashboard requires more frequent manager updates, the schedule can be increased without changing the data architecture.

---

# 31. IMPORTANT: FUNCTION VS SCHEDULER

Do not duplicate business logic.

Bad:

```text
Cron:
if fixture exists
   call API
```

Better:

```text
Cron:
run sync-player-gameweek-live

Function:
check current GW
check active fixture
decide whether API call is needed
sync data
```

This allows manual invocation and automated invocation to behave identically.

---

# 32. FAILURE BEHAVIOR

If a function fails:

```text
success = false
```

The next scheduled run should retry naturally.

Do not mark data as finalized when any required step fails.

Especially:

```text
player stats sync failed
snapshot failed
```

must prevent:

```text
data_checked = true
```

---

# 33. FINALIZATION SAFETY

`data_checked = true` must be the LAST important database state change.

Conceptually:

```text
1. Validate GW
2. Read live data
3. Save final stats
4. Save final snapshot
5. Only then:
      data_checked = true
```

Never:

```text
data_checked = true
```

before final data has successfully been written.

---

# 34. PRODUCTION DEPLOYMENT ORDER

When setting up production automation:

```text
1. Deploy all Edge Functions
2. Test each function manually
3. Deploy scheduler
4. Create cron jobs
5. Verify cron execution
6. Monitor logs
7. Confirm database updates
```

Do not enable all production cron jobs before the functions have been manually tested.

---

# 35. CURRENT TEST STATUS

Already successfully tested:

```text
sync-fpl-current-state       ✅
sync-fpl-fixtures             ✅
sync-manager-gameweek-history ✅
sync-manager-transfers        ✅
sync-player-gameweek-stats    ✅
sync-player-gameweek-snapshot ✅
sync-player-gameweek-live     ✅
finalize-gameweek             ✅ no eligible GW
```

`sync-manager-gameweek-picks` should also be verified before production automation is considered complete.

---

# 36. FINAL PRINCIPLE

The system must remain:

```text
AUTOMATED
+
IDEMPOTENT
+
STATE-DRIVEN
+
API-EFFICIENT
```

The database determines the state.

The scheduler determines when to check.

The Edge Function determines what action is required.

The finalization lock determines when historical data becomes immutable.

---

# 37. GOLDEN FLOW

```text
                    DAILY
                      │
                      ▼
             fpl-daily-scheduler
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
 current state     fixtures      manager data
       │              │
       └───────┬──────┘
               │
               ▼
          CURRENT GW
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   SNAPSHOT         ACTIVE MATCH?
       │                │
       │          ┌─────┴─────┐
       │          │           │
       │         YES          NO
       │          │           │
       │          ▼           │
       │       LIVE SYNC      │
       │          │           │
       └──────────┴───────────┘
                  │
                  ▼
            GW FINISHED?
                  │
                  ▼
          ALL FIXTURES DONE?
                  │
                  ▼
         finalize-gameweek
                  │
          ┌───────┴────────┐
          ▼                ▼
     LIVE → STATS      FINAL SNAPSHOT
          │                │
          └───────┬────────┘
                  ▼
          data_checked=true
                  │
                  ▼
               LOCKED
```

---

# 38. SOURCE OF TRUTH

This document defines the current automation architecture for FPL KINO 2026/27.

Any future changes to:

* cron frequency
* scheduler behavior
* Edge Function trigger conditions
* Gameweek finalization
* live sync behavior

must be reflected in this document.

Do not introduce a new cron or scheduler that duplicates an existing responsibility without updating this architecture.

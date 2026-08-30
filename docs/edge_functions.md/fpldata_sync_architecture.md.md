# FPL KINO — DATA SYNC ARCHITECTURE

## Source of Truth — Season 2026/27

> Dokumen ini adalah referensi utama untuk seluruh proses sinkronisasi data FPL KINO antara FPL API dan Supabase.
>
> **Jangan membuat Edge Function, cron, scheduler, atau perubahan database baru yang bertentangan dengan dokumen ini tanpa memperbarui dokumen terlebih dahulu.**

---

# 1. SYSTEM OVERVIEW

FPL KINO menggunakan:

* FPL API sebagai source data utama
* Supabase sebagai persistent database
* Supabase Edge Functions sebagai data synchronization layer
* Supabase Cron / Scheduler sebagai automation layer

Arsitektur:

```text
FPL API
   │
   ├── Master / Current State
   │
   ├── Fixtures
   │
   ├── Manager Data
   │
   └── Player Data
          │
          ▼
    Supabase Edge Functions
          │
          ▼
       Supabase DB
          │
          ▼
      FPL KINO Dashboard
```

Frontend dashboard bersifat **read-only** terhadap data FPL.

Frontend tidak melakukan request langsung ke FPL API untuk kebutuhan utama dashboard.

---

# 2. DATABASE TABLES

## Master / Reference Tables

```text
fpl_gameweeks
fpl_phases
fpl_teams
fpl_element_types
fpl_players
fixtures
fpl_chips
```

## Manager Tables

```text
managers
manager_gameweek_stats
manager_gameweek_picks
manager_transfers
manager_chips
manager_badges
```

## Player Tables

```text
player_gameweek_live
player_gameweek_stats
player_gameweek_snapshot
```

## Other Tables

```text
badges
fpl_sync_logs
```

---

# 3. GAMEWEEK STATE

`fpl_gameweeks` adalah source of truth untuk status Gameweek.

Important fields:

```text
gw_number
deadline_time
is_current
is_next
is_previous
finished
data_checked
```

## Meaning

### `is_current`

Menentukan Gameweek yang sedang aktif menurut FPL.

Contoh:

```text
GW2
is_current = true
```

Function yang membutuhkan current Gameweek menggunakan field ini.

---

### `is_next`

Menentukan Gameweek berikutnya.

Tidak digunakan sebagai source utama untuk live sync.

---

### `finished`

Menunjukkan bahwa FPL telah menandai Gameweek sebagai selesai.

Namun:

```text
finished = true
```

belum otomatis berarti database lokal sudah finalized.

Karena itu masih perlu pengecekan fixture.

---

### `data_checked`

Digunakan sebagai **finalization lock**.

```text
data_checked = false
→ GW belum finalized

data_checked = true
→ GW sudah finalized
```

Setelah `data_checked = true`, Gameweek tidak boleh diproses ulang oleh `finalize-gameweek`.

---

# 4. GAMEWEEK FINALIZATION RULE

Sebuah Gameweek hanya boleh dianggap finalized apabila:

```text
fpl_gameweeks.finished = true

AND

SEMUA fixtures pada Gameweek tersebut
memiliki fixtures.finished = true
```

Flow:

```text
fpl_gameweeks.finished
        │
        ├── false → masih berjalan
        │
        └── true
              │
              ▼
       cek seluruh fixtures
              │
       ┌──────┴──────┐
       │             │
     belum           semua
    selesai         selesai
       │             │
       ▼             ▼
     WAIT         FINALIZE
```

---

# 5. EDGE FUNCTIONS

Current Edge Functions:

```text
1. sync-fpl-current-state
2. sync-fpl-fixtures
3. sync-manager-gameweek-history
4. sync-manager-transfers
5. sync-manager-gameweek-picks
6. sync-player-gameweek-stats
7. sync-player-gameweek-snapshot
8. sync-player-gameweek-live
9. finalize-gameweek
```

---

# 6. sync-fpl-current-state

## Purpose

Synchronize current FPL master state from:

```text
GET /api/bootstrap-static/
```

## Main Tables

```text
fpl_gameweeks
fpl_phases
fpl_teams
fpl_element_types
fpl_players
fpl_chips
```

## Responsibility

Function ini mengambil current FPL state dan melakukan upsert ke master/reference tables.

Data yang berubah sepanjang musim harus diperbarui secara berkala.

Contoh:

```text
Gameweek status
Player price
Player availability
Player ownership
Player form
Team information
```

## Important

Function ini adalah **master/current-state sync**.

Bukan historical snapshot.

---

# 7. sync-fpl-fixtures

## Purpose

Synchronize FPL fixtures.

Source:

```text
GET /api/fixtures/
```

## Table

```text
fixtures
```

## Important Fields

```text
fixture_id
gw_number
kickoff_time
team_h
team_a
started
finished
team_h_score
team_a_score
team_h_difficulty
team_a_difficulty
```

## Responsibility

Menjaga data fixture tetap sinkron.

Fixture status sangat penting karena digunakan oleh:

```text
sync-player-gameweek-live
finalize-gameweek
daily scheduler
```

---

# 8. sync-manager-gameweek-history

## Purpose

Synchronize manager Gameweek history.

Source:

```text
/api/entry/{manager_id}/history/
```

## Table

```text
manager_gameweek_stats
```

## Responsibility

Menyimpan statistik manager per Gameweek.

Contoh data:

```text
points
total_points
rank
overall_rank
bank
value
event_transfers
```

## Historical Rule

Data Gameweek disimpan berdasarkan:

```text
(manager_id, gw_number)
```

Manager yang baru bergabung setelah GW tertentu **tidak perlu dibuatkan dummy history**.

Contoh:

```text
Manager join setelah GW1

GW1 → no record
GW2 → first record
```

Ini adalah kondisi valid.

---

# 9. sync-manager-gameweek-picks

## Purpose

Synchronize manager squad/picks untuk setiap Gameweek.

## Table

```text
manager_gameweek_picks
```

## Primary Concept

Data disimpan berdasarkan:

```text
manager_id
gw_number
player_id
```

## Responsibility

Menyimpan siapa saja pemain yang digunakan manager pada Gameweek tertentu.

Data ini digunakan untuk:

* squad display
* captain
* vice captain
* starting XI
* bench
* chip-related analysis
* historical squad analysis

---

# 10. sync-manager-transfers

## Purpose

Synchronize manager transfers.

Source:

```text
/api/entry/{manager_id}/transfers/
```

## Table

```text
manager_transfers
```

## Stored Data

```text
manager_id
gw_number
player_in_id
player_out_id
transfer_time
```

## Historical Rule

Transfer disimpan sebagai historical transaction.

Jangan menghapus transfer lama ketika Gameweek berubah.

---

# 11. PLAYER DATA ARCHITECTURE

Player data dibagi menjadi tiga konsep:

```text
player_gameweek_live
        ↓
LIVE PERFORMANCE

player_gameweek_stats
        ↓
FINAL HISTORICAL PERFORMANCE

player_gameweek_snapshot
        ↓
HISTORICAL MARKET / PLAYER STATE
```

Ketiga tabel ini memiliki fungsi berbeda.

Jangan mencampurkan tanggung jawabnya.

---

# 12. player_gameweek_live

## Purpose

Menyimpan kondisi performance pemain yang sedang berlangsung.

Source:

```text
GET /api/event/{gw_number}/live/
```

## Table

```text
player_gameweek_live
```

## Key

```text
(player_id, gw_number, fixture_id)
```

## Data

```text
minutes
goals_scored
assists
clean_sheets
goals_conceded
own_goals
penalties_saved
penalties_missed
yellow_cards
red_cards
saves
bonus
bps
total_points
```

## Behavior

Data ini boleh di-overwrite selama Gameweek berjalan.

Contoh:

```text
Player live points = 5

beberapa menit kemudian

Player live points = 8
```

Database:

```text
player_gameweek_live
→ update menjadi 8
```

Ini expected.

---

# 13. player_gameweek_stats

## Purpose

Menyimpan **historical/final player performance per fixture**.

## Table

```text
player_gameweek_stats
```

## Key

```text
(player_id, gw_number, fixture_id)
```

## Data

```text
minutes
goals_scored
assists
clean_sheets
goals_conceded
own_goals
penalties_saved
penalties_missed
yellow_cards
red_cards
saves
bonus
bps
total_points
```

## Important

Table ini adalah historical record.

Source final:

```text
player_gameweek_live
```

Saat Gameweek finalized:

```text
player_gameweek_live
        ↓
player_gameweek_stats
```

---

# 14. player_gameweek_snapshot

## Purpose

Menyimpan kondisi market/player state pada suatu Gameweek.

Source:

```text
GET /api/bootstrap-static/
```

## Table

```text
player_gameweek_snapshot
```

## Key

```text
(player_id, gw_number)
```

## Stored Fields

```text
now_cost
selected_by_percent
transfers_in
transfers_out
transfers_in_event
transfers_out_event
form
value_form
value_season
influence
creativity
threat
ict_index
expected_goals
expected_assists
expected_goal_involvements
expected_goals_conceded
status
chance_of_playing_this_round
chance_of_playing_next_round
```

## Historical Concept

Snapshot menyimpan:

```text
GW1 → player state
GW2 → player state
GW3 → player state
...
```

Contoh:

```text
Player X

GW1:
now_cost = 75

GW2:
now_cost = 76

GW3:
now_cost = 77
```

Dengan ini dashboard nantinya dapat menghitung:

```text
price change
ownership change
transfer trend
form change
value change
```

tanpa membutuhkan table historical tambahan.

---

# 15. SNAPSHOT LIVE VS FINAL

Saat Gameweek sedang berjalan:

```text
sync-player-gameweek-snapshot
        ↓
current GW snapshot
```

Snapshot boleh di-update.

Saat Gameweek sudah finalized:

```text
finalize-gameweek
        ↓
final snapshot
        ↓
data_checked = true
```

Setelah:

```text
data_checked = true
```

snapshot Gameweek tersebut dianggap historical/final.

---

# 16. sync-player-gameweek-snapshot

## Purpose

Menyimpan player market/state untuk current Gameweek.

## Source

```text
/api/bootstrap-static/
```

## Current GW

Ditentukan menggunakan:

```text
fpl_gameweeks.is_current = true
```

## Behavior

Jika:

```text
data_checked = false
```

maka snapshot boleh di-upsert.

Jika:

```text
data_checked = true
```

maka function harus skip.

## Example

```text
GW2
is_current = true
data_checked = false

→ sync snapshot
```

Setelah finalized:

```text
GW2
data_checked = true

→ snapshot locked
```

---

# 17. sync-player-gameweek-live

## Purpose

Synchronize live player performance untuk current Gameweek.

## Source

```text
/api/event/{gw_number}/live/
```

## Current GW

```text
fpl_gameweeks.is_current = true
```

## Behavior

Jika:

```text
finished = false
```

→ sync live data.

Jika:

```text
finished = true
```

→ skip.

## Fixture Level

Data harus disimpan berdasarkan fixture:

```text
player_id
gw_number
fixture_id
```

Hal ini penting untuk double Gameweek.

---

# 18. finalize-gameweek

## Purpose

Finalize Gameweek yang sudah benar-benar selesai.

## Trigger Condition

Candidate Gameweek:

```text
finished = true
AND
data_checked = false
```

Kemudian cek:

```text
SEMUA fixtures.finished = true
```

Jika ada satu fixture belum selesai:

```text
SKIP
```

dan coba lagi pada run berikutnya.

---

# 19. FINALIZE FLOW

Saat seluruh fixture selesai:

```text
player_gameweek_live
        │
        ▼
player_gameweek_stats
```

Kemudian:

```text
bootstrap-static
        │
        ▼
player_gameweek_snapshot
```

Kemudian:

```text
fpl_gameweeks.data_checked = true
```

Final flow:

```text
GW finished
     │
     ▼
All fixtures finished?
     │
     ├── NO → WAIT
     │
     └── YES
           │
           ▼
    live → stats
           │
           ▼
    final player snapshot
           │
           ▼
    data_checked = true
           │
           ▼
        LOCKED
```

---

# 20. DATA OWNERSHIP

Setiap table memiliki satu tujuan utama.

| Table                      | Purpose                             |
| -------------------------- | ----------------------------------- |
| `fpl_gameweeks`            | Gameweek state                      |
| `fixtures`                 | Fixture state/result                |
| `fpl_players`              | Current player master data          |
| `manager_gameweek_stats`   | Manager historical GW performance   |
| `manager_gameweek_picks`   | Manager squad/picks per GW          |
| `manager_transfers`        | Manager transfer transactions       |
| `player_gameweek_live`     | Current/live player performance     |
| `player_gameweek_stats`    | Final historical player performance |
| `player_gameweek_snapshot` | Historical player market/state      |

---

# 21. IMPORTANT DATA RULES

## Rule 1 — No dummy historical data

Jika manager tidak memiliki history pada GW tertentu karena baru bergabung:

```text
DO NOT CREATE DUMMY ROW
```

---

## Rule 2 — Live data can change

`player_gameweek_live` dapat di-update berkali-kali.

---

## Rule 3 — Historical stats come from live

Final player performance:

```text
live → stats
```

---

## Rule 4 — Snapshot is separate from performance

Market/state:

```text
player_gameweek_snapshot
```

Performance:

```text
player_gameweek_live
player_gameweek_stats
```

---

## Rule 5 — `data_checked` is finalization lock

```text
data_checked = true
```

berarti:

```text
GW finalized
historical snapshot locked
final stats stored
```

---

## Rule 6 — Never finalize based only on `finished`

Harus:

```text
fpl_gameweeks.finished = true

AND

all fixtures.finished = true
```

---

# 22. CURRENT STATUS

As of August 29, 2026:

```text
GW1
finished = true
data_checked = true
FINALIZED

GW2
finished = false
data_checked = false
CURRENT / LIVE

GW3
is_next = true
```

Current player data:

```text
player_gameweek_stats
→ synced

player_gameweek_snapshot
→ GW2 synced

player_gameweek_live
→ GW2 synced
```

---

# 23. EDGE FUNCTION DEPENDENCY

Logical dependency:

```text
sync-fpl-current-state
        │
        ├── fpl_gameweeks
        ├── fpl_players
        └── master tables
              │
              ▼
sync-fpl-fixtures
        │
        ▼
fixtures
        │
        ├──────────────────────┐
        ▼                      ▼
manager syncs            player live
        │                      │
        ▼                      ▼
manager tables          player_gameweek_live
                               │
                               ▼
                         finalize-gameweek
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
            player_gameweek_stats   player_snapshot
                    │                     │
                    └──────────┬──────────┘
                               ▼
                       data_checked=true
```

---

# 24. AUTOMATION PRINCIPLE

Scheduler harus menjadi orchestration layer.

Jangan memasukkan seluruh business logic ke dalam cron.

Cron hanya menentukan:

```text
WHEN
```

Edge Function menentukan:

```text
WHAT
```

Contoh:

```text
Cron
→ menjalankan sync-player-gameweek-live setiap menit

Function
→ menentukan apakah GW memang sedang live
```

Dengan demikian function tetap aman walaupun dipanggil manual.

---

# 25. IDEAL AUTOMATION CATEGORIES

## Daily Sync

Untuk:

```text
sync-fpl-current-state
sync-fpl-fixtures
manager data
```

## Live Sync

Untuk:

```text
sync-player-gameweek-live
```

Hanya diperlukan ketika ada fixture yang sedang berlangsung.

## Current GW Snapshot

Untuk:

```text
sync-player-gameweek-snapshot
```

Dapat dijalankan secara berkala selama current GW belum finalized.

## Finalization

Untuk:

```text
finalize-gameweek
```

Dijalankan secara berkala untuk mendeteksi Gameweek yang sudah selesai.

---

# 26. CRON DESIGN PRINCIPLE

Final cron schedule belum dianggap locked sampai seluruh Edge Function audit selesai.

Namun konsepnya:

```text
DAILY
↓
master/current state
fixtures
manager data

PERIODIC / LIVE
↓
player live

PERIODIC
↓
player snapshot

PERIODIC
↓
finalize-gameweek
```

Scheduler harus aman terhadap repeated execution.

Semua sync function harus menggunakan upsert/idempotent behavior jika memungkinkan.

---

# 27. IDEMPOTENCY

Semua synchronization function harus aman dijalankan lebih dari sekali.

Contoh:

```text
sync-player-gameweek-live
```

Run pertama:

```text
622 rows inserted
```

Run berikutnya:

```text
622 rows updated/upserted
```

Tidak boleh menghasilkan duplicate records.

Same principle berlaku untuk:

```text
manager_gameweek_stats
manager_gameweek_picks
manager_transfers
player_gameweek_stats
player_gameweek_snapshot
```

---

# 28. ERROR HANDLING

Setiap Edge Function harus:

1. Return JSON response
2. Return `success`
3. Return `function_name`
4. Return rows affected jika relevan
5. Return error message jika gagal
6. Tidak silently fail

Example:

```json
{
  "success": true,
  "function_name": "sync-player-gameweek-live",
  "gw_number": 2,
  "rows_affected": {
    "player_gameweek_live": 622
  }
}
```

---

# 29. FINAL ARCHITECTURE

```text
                    FPL API
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   bootstrap-static           fixtures/live
          │                         │
          ▼                         ▼
    MASTER TABLES              FIXTURES
          │                         │
          │              ┌──────────┴──────────┐
          │              │                     │
          │              ▼                     ▼
          │        manager sync          player live
          │              │                     │
          │              ▼                     ▼
          │        manager tables       player_gameweek_live
          │                                    │
          ▼                                    │
 player_gameweek_snapshot                     │
                                               │
                                               ▼
                                        GW FINISHED
                                               │
                                               ▼
                                      ALL FIXTURES FINISHED
                                               │
                                               ▼
                                       finalize-gameweek
                                               │
                              ┌────────────────┴───────────────┐
                              ▼                                ▼
                    player_gameweek_stats          final snapshot
                              │                                │
                              └────────────────┬───────────────┘
                                               ▼
                                      data_checked=true
                                               │
                                               ▼
                                            LOCKED
```

---

# 30. GOLDEN RULE

The entire system follows this principle:

```text
LIVE DATA
    ↓
can change

FINALIZED DATA
    ↓
historical
    ↓
locked
```

Specifically:

```text
player_gameweek_live
        ↓
mutable

player_gameweek_stats
        ↓
historical

player_gameweek_snapshot
        ↓
historical market/state

fpl_gameweeks.data_checked
        ↓
finalization lock
```

This document is the current Source of Truth for the FPL KINO data synchronization architecture.

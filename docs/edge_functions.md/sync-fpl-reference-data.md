sync-fpl-current-state

### Function

Mengambil dan memperbarui kondisi FPL terbaru.

### Source API

`/api/bootstrap-static/`

### Target Tables

| Table | Data Type | Write Strategy |
|---|---|---|
| fpl_players | Current State | UPSERT |
| fpl_gameweeks | Current State | UPSERT |

### Logic

1. Fetch data dari `/api/bootstrap-static/`
2. Ambil `elements`
3. Map data sesuai schema `fpl_players`
4. UPSERT ke `fpl_players`
5. Ambil `events`
6. Map data sesuai schema `fpl_gameweeks`
7. UPSERT ke `fpl_gameweeks`

### Write Behavior

- Data belum ada → INSERT
- Data sudah ada → UPDATE dengan kondisi terbaru
- Tidak menggunakan DELETE
- Tidak menggunakan TRUNCATE
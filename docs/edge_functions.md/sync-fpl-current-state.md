sync-fpl-reference-data

### Function

Mengambil data reference/master dari FPL API.

### Source API

`/api/bootstrap-static/`

### Target Tables

| Table | Data Type | Write Strategy |
|---|---|---|
| fpl_teams | Reference / Master | UPSERT |
| fpl_element_types | Reference / Master | UPSERT |
| fpl_phases | Reference / Master | UPSERT |
| fpl_chips | Reference / Master | UPSERT |

### Logic

1. Fetch data dari `/api/bootstrap-static/`
2. Ambil `teams`, `element_types`, `phases`, dan `chips`
3. Map data sesuai schema masing-masing table
4. UPSERT ke target table

### Write Behavior

- Data belum ada → INSERT
- Data sudah ada → UPDATE
- Tidak menggunakan DELETE
- Tidak menggunakan TRUNCATE
# FPL Kino Badge System — Reference Spec

Acuan implementasi sistem badge untuk FPL Kino Indonesia (musim 2026/27). Badge merepresentasikan achievement yang exceptional, rare, dan Hall of Fame worthy — bukan reward aktivitas rutin.

---

## 1. Database Schema

### `public.badges` (master catalog)
Berisi definisi badge: badge code, nama, deskripsi, icon, `is_active`. Satu row per jenis badge, tidak pernah bertambah saat manager achieve.

### `public.manager_badges` (ownership)
```sql
create table public.manager_badges (
  manager_id bigint not null,
  badge_id bigint not null,
  unlocked_at timestamp with time zone null default now(),
  metadata jsonb null,
  constraint manager_badges_pkey primary key (manager_id, badge_id)
);
```
- **Primary key** `(manager_id, badge_id)` → satu manager hanya punya **1 row per jenis badge**, tidak peduli berapa kali achieve.
- `unlocked_at` = timestamp achievement **pertama kali**, tidak berubah walau achieve berulang.
- `metadata` (jsonb) menyimpan detail spesifik per jenis badge (achievement_count, record_points, is_current_holder, dll).

---

## 2. Badge Classification

| Kategori | Perilaku | Badge |
|---|---|---|
| **Permanent + Repeatable** | Sekali dapat, tetap dimiliki selamanya. Achieve ulang → update `achievement_count`, bukan row baru. | Century Club, Perfect Eleven |
| **Dynamic + Transferable** | Hanya 1 current holder pada satu waktu (seperti championship belt). Bisa berpindah jika ada record baru. | Record Breaker, Rock Bottom |

---

## 3. Badge Definitions

### 3.1 Century Club (`century_club`)
- **Condition:** GW points ≥ 100 **AND** tidak pakai chip apapun.
- Exactly 100 = eligible. Pakai chip apapun (walau poin tinggi) = not eligible.
- **Metadata:** `{ achievement_count, first_achieved_gw, last_achieved_gw }`

### 3.2 Perfect Eleven (`perfect_eleven`)
- **Condition:** Seluruh 11 pemain di **final active XI** (setelah auto-substitution) mendapat ≥ 5 poin masing-masing.
- Evaluasi **wajib** pakai final active XI, bukan starting XI awal — pemain yang di-autosub harus dihitung sebagai pemain pengganti.
- 1 pemain saja di bawah 5 poin → gagal, tanpa toleransi.
- **Metadata:** `{ achievement_count, first_achieved_gw, last_achieved_gw }`

### 3.3 Record Breaker (`record_breaker`)
- **Condition:** Manager pemegang rekor **poin GW tertinggi** musim ini.
- Transfer terjadi hanya jika `new_score > current_record`. Tie → no transfer, holder lama tetap pegang.
- Saat transfer: holder lama `is_current_holder = false`, holder baru `is_current_holder = true`. Row lama **tidak dihapus**.
- **Metadata:** `{ is_current_holder, record_points, record_gw }`

### 3.4 Rock Bottom (`rock_bottom`)
- **Condition:** Manager pemegang rekor **poin GW terendah** musim ini. Kebalikan konsep dari Record Breaker.
- Transfer terjadi hanya jika `new_score < current_record`. Tie → no transfer.
- Mekanisme update sama seperti Record Breaker (previous holder jadi false, tidak dihapus).
- **Metadata:** `{ is_current_holder, record_points, record_gw }`

---

## 4. Database Action Logic

| Situasi | Action |
|---|---|
| Badge repeatable, belum pernah dimiliki manager | **INSERT** row baru, `achievement_count = 1` |
| Badge repeatable, sudah dimiliki, achieve lagi | **UPDATE** row: `achievement_count += 1`, `last_achieved_gw` diperbarui |
| Badge dynamic, belum ada holder | **INSERT** holder pertama, `is_current_holder = true` |
| Badge dynamic, ada record baru yang lebih ekstrem | **UPDATE** holder lama → false, **INSERT/UPDATE** holder baru → true |
| Tidak memenuhi syarat / tie / tidak melampaui record | **NO ACTION** |

---

## 5. Evaluation Trigger — WAJIB

Badge **tidak boleh** dievaluasi dengan data live/sementara/belum final. Urutan wajib:

```
Gameweek Finished
   → FPL Sync Completed
   → Manager GW Data Final (termasuk auto-substitution sudah tercermin)
   → Badge Evaluation Allowed
```

### Operational flow per GW selesai:
1. Confirm GW finished
2. Complete FPL data sync
3. Confirm manager GW data final
4. Load active badges (`is_active = true`)
5. Evaluate Century Club → Perfect Eleven → Record Breaker → Rock Bottom
6. Insert/update `manager_badges`
7. Frontend reads updated data

---

## 6. Frontend Display Rules

- **Repeatable badge:** tampilkan 1 icon saja. Jika `achievement_count > 1`, tambahkan `× N` di sebelah icon. Jangan render icon berulang.
  - `achievement_count = 1` → `[ICON]`
  - `achievement_count = 3` → `[ICON] × 3`
- **Dynamic badge:** hanya tampilkan manager dengan `metadata.is_current_holder = true` sebagai pemegang badge. Cek field ini sebelum render.
- Nama, deskripsi, icon badge diambil dari `badges`; data achievement (count, record, holder status) diambil dari `manager_badges.metadata`.
- Satu jenis badge tampil sekali per manager di collection view.

---

## 7. Edge Cases Checklist

- Century Club exactly 100 poin, no chip → eligible.
- Century Club poin tinggi + chip aktif → not eligible, tanpa pengecualian.
- Record Breaker / Rock Bottom tie skor → no transfer, holder lama tetap.
- Perfect Eleven: evaluasi final active XI, bukan starting XI original.
- Badge dengan `is_active = false` di master catalog → tidak dievaluasi/diberikan lagi, tapi historical ownership manager tidak dihapus.

---

## 8. Summary Table

| Badge | Type | Repeatable | Has Current Holder | Transferable |
|---|---|---|---|---|
| Century Club | Permanent | Yes | No | No |
| Perfect Eleven | Permanent | Yes | No | No |
| Record Breaker | Dynamic | No | Yes | Yes |
| Rock Bottom | Dynamic | No | Yes | Yes |

---

## 9. Adding New Badges

Sebelum implementasi badge baru, definisikan dulu di `public.badges` + tentukan:
1. Achievement condition
2. Data source yang dibutuhkan
3. Evaluation timing
4. Permanent atau dynamic
5. Repeatable atau non-repeatable
6. Transfer behavior (jika dynamic)
7. Tie rule (jika applicable)
8. Database action (insert/update logic)
9. Struktur metadata
10. Frontend display behavior
11. Edge cases

Jangan implement badge baru hanya modal nama + icon — operational rule harus jelas dulu.
# FPL Kino Hub — Cron Jobs & Edge Functions Logbook

Documentasi resmi mengenai arsitektur, registri cron job, Edge Functions, riwayat perbaikan (audit log), dan panduan pemeliharaan otomatisasi di **FPL Kino Hub**.

---

## 📌 1. Overview Arsitektur

FPL Kino Hub mengandalkan kombinasi **Supabase `pg_cron`** + **`pg_net`** + **Supabase Edge Functions** untuk mengotomatiskan seluruh alur sinkronisasi data dari API resmi Fantasy Premier League (FPL) hingga penerbitan cerita berita di halaman Newsletter.

```
┌─────────────────┐       (Setiap Menit / Jam / Hari)       ┌────────────────────────┐
│  Supabase       │ ───────────────────────────────────────> │ Supabase               │
│  pg_cron        │   net.http_post + JWT Authorization   │ Edge Functions         │
└─────────────────┘                                          └───────────┬────────────┘
                                                                         │
                                                                         ▼
┌─────────────────┐       Log execution history             ┌────────────────────────┐
│  Frontend App   │ <────────────────────────────────────── │ Supabase Postgres DB   │
│  (Vite + React) │    Query: newsletter_stories, etc.      │ fpl_sync_logs, etc.    │
└─────────────────┘                                          └────────────────────────┘
```

---

## 📋 2. Daftar Cron Jobs (Cron Registry)

Berikut adalah 5 Cron Job resmi yang terdaftar dan aktif di Supabase Postgres Database (`cron.job`):

| Job ID | Nama Cron Job | Schedule (Cron Expression) | Waktu Lokal (WIB) | Edge Function Target | Fungsi Utama | Status |
|---|---|---|---|---|---|---|
| **7** | `fpl-daily-scheduler` | `0 0 * * *` | 07:00 WIB | `fpl-daily-scheduler` | Mengatur penjadwalan harian & update metadata Gameweek global. | **Active (200 OK)** |
| **8** | `fpl-live-sync` | `* * * * *` | Setiap 1 Menit | `fpl-live-sync` | Sync real-time pertandingan (skor, menit, `started`, `finished`) & poin live pemain. | **Active (200 OK)** |
| **9** | `fpl-finalize-gameweek` | `30 * * * *` | Setiap Jam di Menit :30 | `finalize-gameweek` | Finalisasi poin & status Gameweek saat seluruh pertandingan GW usai. | **Active (200 OK)** |
| **10** | `fpl-sync-manager-data` | `10 0 * * *` | 07:10 WIB | `sync-manager-data` | Sync total poin, peringkat, dan squad picks dari 40 manajer FPL Kino Hub. | **Active (200 OK)** |
| **11** | `generate-newsletter-daily` | `30 16 * * *` | 23:30 WIB | `generate-newsletter` | Deteksi match day yang baru selesai & auto-generate 7 fakta cerita berita ke DB. | **Active (200 OK)** |

---

## ⚡ 3. Detail Edge Functions

### 3.1. `fpl-live-sync`
- **Target Table**: `fixtures`, `player_gameweek_live`, `fpl_sync_logs`
- **Tugas**: Menembak FPL API `fantasy.premierleague.com/api/fixtures`. Jika ada pertandingan yang sedang/selesai dimainkan, meng-update `team_h_score`, `team_a_score`, `started = true`, `finished = true`.

### 3.2. `generate-newsletter`
- **Target Table**: `newsletter_editions`, `newsletter_stories`, `fpl_sync_logs`
- **Tugas**:
  1. Memanggil RPC `get_pending_newsletter_days()` untuk mencari hari pertandingan yang sudah selesai (`finished = true`).
  2. Mengkalkulasi 7 fakta olahraga: Top Scorer GW, Biggest Climber, Biggest Faller, Captain Win/Fail, Bench Disaster, Hot Transfer, dan Weekly Recap.
  3. Menyimpan hasil cerita ke tabel `newsletter_stories` dan mencatat eksekusi ke `fpl_sync_logs`.

### 3.3. `finalize-gameweek`
- **Target Table**: `fpl_gameweeks`, `manager_gameweek_stats`
- **Tugas**: Mengunci status Gameweek setelah FPL secara resmi mengonfirmasi akhir pekan pertandingan.

### 3.4. `sync-manager-data`
- **Target Table**: `managers`, `manager_gameweek_stats`, `manager_gameweek_picks`
- **Tugas**: Mengambil data lengkap poin, rank, captain picks, dan bench picks untuk seluruh manajer peserta liga.

---

## 🛠️ 4. Audit & History Perbaikan (Incident Resolution Log)

### 🚨 Isu: HTTP 401 Unauthorized pada Cron Execution
- **Tanggal Ditemukan**: 28 Agustus 2026
- **Gejala**: Cron job `fpl-live-sync` dan job lainnya tercatat berjalan di `cron.job_run_details`, tetapi panggilan HTTP ke Edge Functions gagal dengan `status_code = 401`.
- **Akar Masalah**:
  1. Perintah SQL pada `cron.job` menggunakan placeholder `YOUR_SERVICE_ROLE_KEY` atau UUID dari `vault.decrypted_secrets` yang bukan merupakan JWT Service Role/Anon Key valid.
  2. Tabel `fpl_sync_logs` memiliki `CHECK` constraint (`fpl_sync_logs_sync_type_check`) yang belum mengizinkan nilai `sync_type = 'newsletter'`.
  3. Tabel `fpl_sync_logs` memiliki RLS aktif tetapi tanpa policy yang mengizinkan insert dari Edge Function.

### ✅ Perbaikan yang Dilakukan:
1. **Pembaruan SQL Cron Jobs**:
   - Seluruh 5 cron job di-unschedule dan di-schedule ulang dengan menyertakan header `Authorization: Bearer <VALID_JWT_KEY>` secara eksplisit.
2. **Pembaruan Constraint Database**:
   - Constraint `fpl_sync_logs_sync_type_check` diperbarui untuk menerima `'newsletter'`.
   - Menambahkan RLS Policy `Allow public insert on fpl_sync_logs` dan `Allow public read on fpl_sync_logs`.
3. **Pembaruan Edge Function `generate-newsletter`**:
   - Menambahkan mekanisme penulisan log otomatis ke `fpl_sync_logs` baik saat sukses (`completed`), skip (`skipped`), maupun gagal (`failed`).

---

## 📊 5. Skema & Logbook Tabel `fpl_sync_logs`

Setiap eksekusi Edge Function terekam di tabel `public.fpl_sync_logs`:

```sql
CREATE TABLE public.fpl_sync_logs (
  id           BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  sync_type    TEXT NOT NULL CHECK (sync_type IN (
                 'master','fixtures','league','picks','transfers',
                 'chips','live','finalize','scheduler','newsletter'
               )),
  gw_number    INTEGER,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status       TEXT NOT NULL DEFAULT 'started', -- 'completed', 'failed', 'skipped'
  rows_affected INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response     JSONB
);
```

---

## 🔧 6. Command & Query Maintenance Useful

### A. Memeriksa Status Seluruh Cron Jobs
```sql
SELECT jobid, jobname, schedule, active, command
FROM cron.job
ORDER BY jobid;
```

### B. Memeriksa Response HTTP Terakhir (Cek 200 OK vs 401/500)
```sql
SELECT id, status_code, created, timed_out, error_msg 
FROM net._http_response 
ORDER BY id DESC 
LIMIT 10;
```

### C. Memeriksa Log Sync Terbaru
```sql
SELECT id, sync_type, gw_number, started_at, completed_at, status, rows_affected, response
FROM fpl_sync_logs
ORDER BY id DESC
LIMIT 10;
```

### D. Trigger Manual Generator Newsletter (Tanpa Menunggu Cron)
```sql
SELECT net.http_post(
  url := 'https://thbsqxhxlaoksxugpxcw.supabase.co/functions/v1/generate-newsletter',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYnNxeGh4bGFva3N4dWdweGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDc5OTMsImV4cCI6MjEwMzI4Mzk5M30.8B0dQWESM-K00T64rx13sHmw4LpSHMX51aqgs86X7mI'
  ),
  body := '{}'::jsonb
);
```

---
*Dokumen ini dibuat otomatis sebagai Logbook & Arsitektur Resmi Sistem Otomatisasi FPL Kino Hub.*

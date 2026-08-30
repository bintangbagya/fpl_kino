# FPL Kino Hub — Newsletter System Design & Editorial Logic

Dokumen ini merupakan *single source of truth* untuk sistem **Newsletter FPL Kino Hub**. Dokumen ini mendefinisikan filosofi editorial, arsitektur alur data ke narasi (*Data-to-Story Flow*), sistem klasifikasi berjenjang (*Editorial Tier System*), aturan Story Detection dan Scoring Engine, sistem memori historis liga (*League Memory & Storyline Engine*), alur kerja penyuntingan AI (*AI Editorial Workflow*), alur penulisan berita AI (*AI Writer Workflow*), sistem verifikasi dan validasi keamanan berita (*Fact Check & Safety Gate*), arsitektur sistem prompt AI (*AI Prompt System Architecture*), desain prompt AI Editor (*AI Editor Prompt Design*), desain prompt AI Writer (*AI Writer Prompt Design*), desain prompt AI Fact Checker (*AI Fact Checker Prompt Design*), arsitektur master final (*Final Newsletter System Architecture*), desain konseptual persistensi data (*Newsletter Database Architecture — Conceptual Design*), penguncian entitas utama dan siklus hidup data (*Final Core Newsletter Entities & Lifecycle*), model database lean MVP (*Final Lean Newsletter Database Model — MVP*), prioritas implementasi detector MVP (*MVP Detector Implementation Priority*), serta cetak biru skema database MVP final (*Final Newsletter Database Schema Blueprint — MVP*) yang mengubah data statistik mentah liga FPL Kino Indonesia menjadi edisi Newsletter yang berisi berbagai artikel berita dramatis, berkesan, dan menghibur.

---

## 1. Newsletter Purpose

Tujuan utama dari sistem Newsletter FPL Kino Hub adalah:
- **Transformasi Data Menjadi Multi-Artikel Naratif**: Mengubah angka dan statistik tabel mentah dari Fantasy Premier League (FPL) menjadi kumpulan artikel cerita mingguan yang hidup dan seru.
- **Membangun Komunitas & Keterlibatan**: Menjadi media hiburan utama yang mempererat keterikatan antar-manager di dalam liga FPL Kino Indonesia.
- **Wadah Trashtalk Sehat**: Menyediakan bahan *office-safe trashtalk* yang lucu, sportif, dan kompetitif berdasarkan fakta pertandingan dan keputusan taktis para manager.
- **Dokumentasi Historis Liga**: Mengabadikan momen-momen bersejarah, persaingan sengit, kejutan, dan keajaiban sepanjang musim 2026/27.

---

## 2. Editorial Philosophy

Newsletter FPL Kino Hub memegang filosofi penulisan berikut:

- **Data-Driven Storytelling**: Setiap cerita, klaim, atau julukan wajib berakar dari fakta statistik di database. Data adalah fondasi utama; narasi adalah perantaranya.
- **Narrative Over Numbers**: Angka hanya menjadi latar belakang pendukung. Yang ditonjolkan adalah keputusan taktis, penyesalan, emosi, dan kejutan di balik angka tersebut.
- **Friendly & Office-Safe Trashtalk**: Trash talk fokus menyentil keputusan taktis atau gameplay (contoh: poin bangku cadangan menumpuk, salah memilih kapten, *hit* berlebihan), bukan menyerang personalitas, fisik, atau latar belakang pribadi manager.
- **Personal & Contextual**: Memanfaatkan konteks historis liga dan performa Gameweek sebelumnya untuk melihat tren kebangkitan (*comeback*), penurunan (*freefall*), atau persaingan kuno (*rivalry*).

---

## 3. Newsletter System Overview

Sistem Newsletter bekerja secara otomatis setelah suatu Gameweek dinyatakan selesai (`finished = true`). 

**Prinsip Multi-Artikel & Model Keputusan Dua Layer (*Two-Layer Decision Model*)**:
- Newsletter **bukan** hanya memilih 1 artikel tunggal setiap Gameweek.
- Satu edisi publikasi (*Newsletter Issue*) terdiri dari **banyak artikel** dari berbagai *Story Candidates* yang berhasil terdeteksi.
- Sistem menjaga **keseimbangan antara determinisme data dan fleksibilitas editorial**: sistem data bersifat 100% deterministik pada level fakta dan perhitungan prioritas dasar, namun memberikan fleksibilitas terukur bagi AI Editor untuk menentukan penyesuaian *final tier* dan sudut pandang publikasi.

---

## 4. Core Principles

1. **Fact-First Integrity**: AI Penulis (*AI Writer*) tidak boleh mengarang, memodifikasi, atau memanipulasi statistik dan peristiwa yang tidak ada di database.
2. **Highlight the Extremes**: Prioritaskan kejadian ekstrem (skor tertinggi/terendah, poin bangku cadangan terbesar, selisih poin tertipis, keputusan berani).
3. **Dynamic Multi-Article Output**: Jumlah artikel yang diterbitkan dalam satu Newsletter Issue bersifat **fleksibel/dinamis** (tidak kaku/fixed). Gameweek yang sepi drama menghasilkan sedikit artikel, sedangkan Gameweek yang kaya kejadian unik menghasilkan lebih banyak artikel.
4. **Headline News is Main, Not Only**: *Headline News* adalah wajah berita utama edisi tersebut, namun didampingi oleh artikel pendukung (*Featured Stories*, *Regular Stories*, dan *Quick Hits*).
5. **Two-Layer Decision Balance**: Menjaga sistem tetap *data-driven* dan *deterministic* pada level fakta (Layer 1 System Priority), namun tidak terlalu *rigid* pada keputusan editorial akhir (Layer 2 AI Editorial Review).
6. **League Memory Continuity**: Menghubungkan setiap kejadian Gameweek dengan rekam jejak historis liga dan alur cerita (*storyline*) yang sedang berjalan.
7. **Strict Fact-Check Validation**: Setiap naskah artikel wajib melalui *Fact Check & Safety Gate* sebelum dapat masuk ke dalam terbitan Newsletter Issue.
8. **League-Scoped Relevance**: Fokus 100% pada dinamika internal 41 manager liga FPL Kino Indonesia.
9. **Office-Safe Boundaries**: Menjaga batasan humor dan trashtalk agar tetap profesional, kompetitif, serta aman dibaca di lingkungan kerja.

---

## 5. High-Level Data to Story Flow

Proses pengolahan data mentah dari database hingga menjadi edisi *Newsletter Issue* lengkap yang berisi multi-artikel mengikuti alur utama berikut:

```
┌─────────────────────────────────────────────────────────┐
│                      FPL DATABASE                       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Analysis Engine                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│              League Memory & Storyline Engine           │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Story Detection Engine                  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Objective System Scoring                  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Score Normalization                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Story Clustering                     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│           Duplicate & Diversity Filtering               │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 1 — SYSTEM PRIORITY (RECOMMENDED)       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│          LAYER 2 — AI EDITORIAL REVIEW & ANGLE          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Editorial Plan                      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                AI Writer Generation                     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│             Fact Check & Safety Gate                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    NEWSLETTER ISSUE                     │
└────────────────────────────┬────────────────────────────┘
```

### Penjelasan Tahapan Pipeline:

1. **FPL DATABASE**: Menyimpan data transaksi Gameweek (`fpl_gameweeks`, `manager_gameweek_stats`, `manager_gameweek_picks`, `manager_transfers`, `managers`, `fpl_players`).
2. **Data Analysis Engine**: Melakukan agregasi statistik liga (kalkulasi poin bench, kapten, delta rank, transfer ROI).
3. **League Memory & Storyline Engine**: Menyediakan konteks historis selektif dan melacak status alur cerita (*storyline lifecycle*).
4. **Story Detection Engine**: Memindai data dengan *rule-based detectors* untuk menghasilkan himpunan fakta *Story Candidates*.
5. **Objective System Scoring**: Menghitung skor terukur 6 dimensi (Impact, Rarity, Drama, Historical Context, Rivalry, Entertainment) secara deterministik.
6. **Score Normalization**: Menyertakan konteks situasional liga dan menyeimbangkan bobot antar-kategori cerita secara adil.
7. **Story Clustering**: Mengelompokkan kandidat cerita yang melibatkan topik atau manager yang sama menjadi unit *Story Cluster*.
8. **Duplicate & Diversity Filtering**: Mengeliminasi duplikat redundan dan menyeimbangkan variasi tema cerita.
9. **System Priority (Layer 1 Output)**: Menghasilkan rekomendasi prioritas cerita (*Recommended Tier*) berbasis kalkulasi data objektif.
10. **AI Editorial Review & Angle (Layer 2 Output)**: Memilih Headline, menentukan sudut pandang narasi, dan menyusun dokumen *Editorial Plan*.
11. **Editorial Plan**: Dokumen rancangan instruksi dan batasan penulisan terstruktur untuk AI Writer.
12. **AI Writer Generation**: AI Writer menyusun draf narasi artikel berita terpisah per artikel berdasarkan Editorial Plan.
13. **Fact Check & Safety Gate**: Memvalidasi ketepatan fakta, konteks historis, keamanan editorial, dan kesesuaian output sebelum publikasi.
14. **NEWSLETTER ISSUE**: Edisi majalah digital mingguan terpublikasi yang siap ditampilkan di web.

---

## 6. Newsletter Editorial Tier System

Setiap *Story Candidate* / *Story Cluster* yang lolos dari seleksi akan dialokasikan ke dalam **Sistem 5 Tier** yang menentukan bentuk dan porsi penerbitannya di dalam Newsletter Issue:

```
┌─────────────────────────────────────────────────────────┐
│                 TIER 1 — HEADLINE NEWS                  │
│       (Artikel Utama & Wajah Newsletter Issue)          │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│               TIER 2 — FEATURED STORIES                 │
│         (Artikel Pendukung Utama / Mendalam)            │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                TIER 3 — REGULAR STORIES                 │
│         (Artikel Berita Menarik Standar Liga)           │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│             TIER 4 — QUICK HITS / FUN FACTS             │
│        (Catatan Ringkas, Fakta Lucu & Ticker)           │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                      NOT SELECTED                       │
│    (Disimpan untuk konteks historis edisi berikutnya)   │
└─────────────────────────────────────────────────────────┘
```

### Detail Spesifikasi Tier:

#### 1. TIER 1 — HEADLINE NEWS
- **Peran**: Artikel utama, berita sampul, dan wajah dari Newsletter Issue Gameweek tersebut.
- **Jumlah**: Normalnya **1 artikel** per Gameweek.
- **Kriteria Selection**: Dipilih oleh AI Editor dari kandidat prioritas tinggi hasil rekomendasi Layer 1 System Priority.
- **Format**: Artikel panjang berstruktur lengkap (*Hero Card*), narasi mendalam, visual pendukung, dan analisis taktis penuh.

#### 2. TIER 2 — FEATURED STORIES
- **Peran**: Artikel pendukung penting yang menyoroti peristiwa-peristiwa besar lain di Gameweek tersebut.
- **Jumlah**: Fleksibel (biasanya 1–3 artikel tergantung kualitas kandidat cerita edisi tersebut).
- **Kriteria Selection**: Kandidat cerita prioritas tinggi yang memiliki *Editorial Score* kuat serta implikasi besar terhadap persaingan.
- **Format**: Artikel menengah berstruktur rapi (*Featured Cards*), ulasan lengkap dengan data pendukung.

#### 3. TIER 3 — REGULAR STORIES
- **Peran**: Artikel menarik yang layak dipublikasikan namun memiliki tingkat urgensi atau dampak di bawah Featured Stories.
- **Jumlah**: Fleksibel (biasanya 1–4 artikel).
- **Kriteria Selection**: Kejadian unik atau keputusan taktis menarik yang memberikan variasi topik di dalam liga.
- **Format**: Artikel ringkas berstruktur padat (*Story Cards*).

#### 4. TIER 4 — QUICK HITS / FUN FACTS
- **Peran**: Sorotan cerita pendek, statistik unik, kejadian lucu, catatan *auto-sub*, atau angka menarik.
- **Jumlah**: Fleksibel (dapat berupa *ticker bar* atau deretan poin fakta *Quick Hits*).
- **Kriteria Selection**: Fakta unik yang tidak memerlukan pembahasan artikel panjang namun sangat seru untuk dibaca.
- **Format**: Teks singkat 1–2 kalimat, *fun fact pill*, atau *news ticker*.

#### 5. NOT SELECTED
- **Peran**: Story Candidate yang tidak dipublikasikan pada Newsletter Issue edisi berjalan.
- **Catatan Penting**: Status *Not Selected* **bukan** berarti kandidat cerita dihapus dari database. Story Candidate tetap disimpan sebagai **Historical Context** yang dapat dijadikan rujukan storylines pada Gameweek mendatang (misal: untuk mendeteksi *consistency streak* atau *revenge match*).

---

## 7. Story Detection Engine Overview

Story Detection Engine bertugas memindai hasil agregasi data Gameweek menggunakan sekumpulan aturan logis (*rule-based triggers*) untuk menemukan momen-momen paling menarik. Setiap aturan yang terpenuhi akan menghasilkan **Story Candidate** beserta *Fact Sheet* yang objektif dan deterministik.

**Prinsip Kerja Detection Engine**:
- **Objektif & Bebas Asumsi**: Engine hanya mendeteksi angka, fakta, dan kejadian matematis. Penilaian emosi atau trashtalk dilakukan pada tahap berikutnya (AI Editor/Writer).
- **Configurable Thresholds**: Nilai ambang batas (*threshold*) bersifat konfigurasional (misal: `MIN_BENCH_EXPLOSION_PTS = 12`) sehingga dapat disesuaikan tanpa mengubah logika dasar.
- **Fakta Terpisah dari Opini**: Data yang dikirimkan oleh detector murni fakta (misal: `benched_player: Haaland, points: 16`), bukan naskah opini.

---

## 8. Story Categories Overview

Story Detection Engine mengklasifikasikan kejadian menarik ke dalam 10 kategori utama:

1. **Performance Stories**: Kemenangan tertinggi, skor terendah, dan lompatan poin dibanding rata-rata liga.
2. **Ranking Drama**: Perubahan penguasa puncak klasemen, penurunan rank tajam, dan pertarungan zona kualifikasi Cup.
3. **Bench Disasters**: Poin eksplosif yang tertahan di bangku cadangan dan penyesalan susunan pemain.
4. **Captain Drama**: Keputusan memilih kapten (kapten meledak, kapten *blank*, atau keberanian *differential captain*).
5. **Transfer Stories**: Efektivitas transfer masuk/keluar, *masterstroke*, bencana cedera/kartu merah, dan pertaruhan *points hit*.
6. **Chip Stories**: Keberhasilan atau kegagalan aktivasi chip (*Bench Boost*, *Triple Captain*, *Free Hit*, *Wildcard*).
7. **Rivalry Stories**: Persaingan sengit antara dua manager berjarak dekat dan kemenangan selisih poin sangat tipis.
8. **Historical Stories**: Pemecahan rekor sepanjang masa liga dan tren konsistensi jangka panjang.
9. **Fun Facts**: Keunikan formasi taktis dan keajaiban *auto-sub* menit akhir.
10. **Rare / Insane Events**: Peristiwa langka yang sangat jarang terjadi secara statistik.

---

## 9. Story Detection Engine — Detailed Detector Catalog

Berikut adalah katalog lengkap *rule-based detectors* yang berfungsi sebagai *single source of truth* untuk seluruh jenis kejadian yang dapat dideteksi oleh sistem:

---

### Kategori 1: Performance Stories

#### Detector 1.1: `DET_PERF_WEEKLY_CHAMPION`
- **Story Type / Name**: Manager of the Week
- **Category**: Performance Stories
- **Detection Purpose**: Mendeteksi manager peraih total poin terbesar pada Gameweek berjalan.
- **Trigger / Detection Logic**: 
  `points = MAX(manager_gameweek_stats.points WHERE gw_number = :current_gw)`
  *Tie-breaker*: Jika terdapat poin sama, sertakan seluruh manager peraih poin tertinggi tersebut.
- **Required Data**: `manager_gameweek_stats.points`, `managers.team_name`, `managers.manager_name`, `gw_number`.
- **Story Value / Editorial Potential**: Sangat tinggi (kandidat kuat Tier 1 / Headline). Memberikan apresiasi atas performa taktis terbaik Gameweek ini.
- **Contoh Kejadian**: Manager "Tarikmang" meraih 74 poin dan menjadi skor tertinggi di GW1.

#### Detector 1.2: `DET_PERF_WEEKLY_FLOOR`
- **Story Type / Name**: Gameweek Disaster / Floor Score
- **Category**: Performance Stories
- **Detection Purpose**: Mendeteksi manager dengan total poin terendah pada Gameweek berjalan.
- **Trigger / Detection Logic**: 
  `points = MIN(manager_gameweek_stats.points WHERE gw_number = :current_gw)`
- **Required Data**: `manager_gameweek_stats.points`, `managers.team_name`, `managers.manager_name`, `gw_number`.
- **Story Value / Editorial Potential**: Tinggi (kandidat Tier 2 / Tier 3). Bahan sindiran *office-safe trashtalk* mengenai pekan kelam sang manager.
- **Contoh Kejadian**: Manager "Bebek FC" hanya mengumpulkan 28 poin pada GW3 akibat banyak pemain *blank*.

#### Detector 1.3: `DET_PERF_LEAGUE_OUTLIER`
- **Story Type / Name**: League Outlier
- **Category**: Performance Stories
- **Detection Purpose**: Mendeteksi manager yang skornya berada jauh di atas rata-rata liga melebihi batas ambang konfigurasional.
- **Trigger / Detection Logic**: 
  `points >= (AVG(league_points) + THRESHOLD_OUTLIER_DELTA_PTS)`
  *(Threshold konfigurasional awal: +25 pts di atas rata-rata liga)*.
- **Required Data**: `manager_gameweek_stats.points`, `fpl_gameweeks.average_score` (atau avg terhitung 41 manager).
- **Story Value / Editorial Potential**: Sedang-Tinggi. Menunjukkan dominasi absolut satu manager atas seluruh liga pada GW tertentu.
- **Contoh Kejadian**: Rata-rata liga GW5 adalah 45 pts, tetapi Manager "Kino King" mencetak 82 pts (+37 pts di atas average).

---

### Kategori 2: Ranking Drama

#### Detector 2.1: `DET_RANK_TITLE_CHANGE`
- **Story Type / Name**: Title Race Shift / New League Leader
- **Category**: Ranking Drama
- **Detection Purpose**: Mendeteksi terjadinya pergantian pimpinan puncak klasemen overall liga (`rank 1`).
- **Trigger / Detection Logic**: 
  `leader_gw_prev != leader_gw_curr` berdasarkan `manager_gameweek_stats.overall_rank` (atau urutan `SUM(points)` di liga).
- **Required Data**: `manager_gameweek_stats.overall_rank`, `manager_gameweek_stats.total_points`, `managers.team_name`.
- **Story Value / Editorial Potential**: Sangat Tinggi (kandidat kuat Tier 1 / Headline). Drama pergantian mahkota penguasa liga.
- **Contoh Kejadian**: Manager A mengkudeta Manager B dari posisi #1 klasemen overall setelah unggul 3 poin di GW12.

#### Detector 2.2: `DET_RANK_FREEFALL`
- **Story Type / Name**: Freefall Warning / Biggest Rank Drop
- **Category**: Ranking Drama
- **Detection Purpose**: Mendeteksi manager yang mengalami penurunan posisi klasemen terbesar dalam 1 GW.
- **Trigger / Detection Logic**: 
  `rank_drop = (overall_rank_curr - overall_rank_prev)`
  Saring manager dengan `MAX(rank_drop)` di mana `rank_drop >= THRESHOLD_MIN_RANK_DROP` *(Threshold konfigurasional: >= 5 posisi)*.
- **Required Data**: `manager_gameweek_stats.overall_rank` (GW sebelumnya vs GW berjalan), `managers.team_name`.
- **Story Value / Editorial Potential**: Tinggi. Menyoroti kemerosotan tajam akibat keputusan taktis buruk di GW tersebut.
- **Contoh Kejadian**: Manager "Runtuh FC" merosot dari posisi #4 ke posisi #12 dalam 1 GW setelah hanya mengumpulkan 32 poin.

#### Detector 2.3: `DET_RANK_CLIMBER`
- **Story Type / Name**: Climber of the Week / Biggest Rank Gain
- **Category**: Ranking Drama
- **Detection Purpose**: Mendeteksi manager yang mengalami kenaikan posisi klasemen terbanyak dalam 1 GW.
- **Trigger / Detection Logic**: 
  `rank_gain = (overall_rank_prev - overall_rank_curr)`
  Saring manager dengan `MAX(rank_gain)` di mana `rank_gain >= THRESHOLD_MIN_RANK_GAIN` *(Threshold konfigurasional: >= 5 posisi)*.
- **Required Data**: `manager_gameweek_stats.overall_rank` (GW sebelumnya vs GW berjalan), `managers.team_name`.
- **Story Value / Editorial Potential**: Sedang-Tinggi. Cerita kebangkitan dan lonjakan taktis mendongkrak posisi klasemen.
- **Contoh Kejadian**: Manager "Rocket XI" melompat dari peringkat #18 ke peringkat #11 setelah mencetak 78 poin.

#### Detector 2.4: `DET_RANK_CUTOFF_DANGER`
- **Story Type / Name**: Cup Cutoff Battle / Qualification Edge
- **Category**: Ranking Drama
- **Detection Purpose**: Mendeteksi ketegangan di zona batas kualifikasi Cup (posisi #16 vs #17) menjelang GW kualifikasi (GW19).
- **Trigger / Detection Logic**: 
  `ABS(total_points(rank_16) - total_points(rank_17)) <= THRESHOLD_CUTOFF_GAP_PTS` pada GW17–GW19.
  *(Threshold konfigurasional: <= 10 pts)*.
- **Required Data**: `manager_gameweek_stats.overall_rank`, `manager_gameweek_stats.total_points`.
- **Story Value / Editorial Potential**: Sangat Tinggi (khusus menjelang GW19). Drama penentuan 16 kelayakan bertanding di FPL Kino Cup.
- **Contoh Kejadian**: Pada GW18, Manager rank #16 dan #17 hanya terpisah selisih 2 poin sebelum tenggat kualifikasi GW19.

---

### Kategori 3: Bench Disasters

#### Detector 3.1: `DET_BENCH_EXPLOSION`
- **Story Type / Name**: Benched Explosion / High Bench Score
- **Category**: Bench Disasters
- **Detection Purpose**: Mendeteksi pemain individu yang mencetak poin besar namun ditaruh di bangku cadangan (`multiplier = 0`).
- **Trigger / Detection Logic**: 
  `manager_gameweek_picks.multiplier = 0` AND `fpl_players.event_points >= THRESHOLD_BENCH_PLAYER_PTS`
  *(Threshold konfigurasional: >= 10 pts)*.
- **Required Data**: `manager_gameweek_picks.position`, `multiplier`, `fpl_players.event_points`, `fpl_players.web_name`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Momen penyesalan terbesar manager ketika poin melimpah terbuang di bench.
- **Contoh Kejadian**: Manager menaruh Palmer di bench posisi #3 dan Palmer justru mencetak 18 poin (2 gol, 1 assist).

#### Detector 3.2: `DET_BENCH_OUTSCORES_STARTERS`
- **Story Type / Name**: Bench Beats Starters
- **Category**: Bench Disasters
- **Detection Purpose**: Mendeteksi kondisi di mana total poin bangku cadangan manager melampaui kombinasi poin beberapa pemain starter utama.
- **Trigger / Detection Logic**: 
  `SUM(bench_points) > SUM(starter_points_bottom_N)` di mana N adalah 3 pemain starter dengan poin terendah.
- **Required Data**: `manager_gameweek_picks.multiplier`, `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Tinggi. Trashtalk mengenai kesalahan susunan lineup utama.
- **Contoh Kejadian**: Bench manager mengumpulkan 24 poin, sementara 3 pemain starter lini depan hanya menghasilkan total 6 poin.

#### Detector 3.3: `DET_BENCH_GK_DILEMMA`
- **Story Type / Name**: Goalkeeper Bench Regret
- **Category**: Bench Disasters
- **Detection Purpose**: Mendeteksi kiper di bangku cadangan yang poinnya jauh lebih tinggi dibanding kiper utama yang dipasang.
- **Trigger / Detection Logic**: 
  `bench_gk_points - starter_gk_points >= THRESHOLD_GK_DELTA_PTS`
  *(Threshold konfigurasional: >= 6 pts)*.
- **Required Data**: `manager_gameweek_picks.position` (GK starter vs GK bench), `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Sedang-Tinggi. Dilema rotasi penjaga gawang yang berbuah penyesalan.
- **Contoh Kejadian**: Kiper starter dapat 1 poin (kebobolan 3 gol), sementara Kiper cadangan dapat 11 poin (cleansheet + bonus).

---

### Kategori 4: Captain Drama

#### Detector 4.1: `DET_CAPT_MASTERCLASS`
- **Story Type / Name**: Captain Masterclass / Explosive Captain
- **Category**: Captain Drama
- **Detection Purpose**: Mendeteksi pilihan kapten (`is_captain = true`) yang memanen poin sangat tinggi.
- **Trigger / Detection Logic**: 
  `captain_effective_points >= THRESHOLD_CAPTAIN_HAUL_PTS`
  *(Effective points = player_points * multiplier. Threshold konfigurasional: >= 24 pts)*.
- **Required Data**: `manager_gameweek_picks.is_captain`, `multiplier`, `fpl_players.event_points`, `fpl_players.web_name`.
- **Story Value / Editorial Potential**: Tinggi. Mengapresiasi kejelian manajerial dalam menentukan kapten pencetak poin terbanyak.
- **Contoh Kejadian**: Salah satu manager menunjuk Haaland sebagai kapten dan Haaland mencetak hattrick (16 pts * 2 = 32 pts).

#### Detector 4.2: `DET_CAPT_BLANK_DISASTER`
- **Story Type / Name**: Captain Blank / Vice-Captain Betrayal
- **Category**: Captain Drama
- **Detection Purpose**: Mendeteksi kapten utama yang gagal mencetak poin (*blank* <= 2 pts) sementara Vice-Captain atau pemain biasa meledak.
- **Trigger / Detection Logic**: 
  `captain_raw_points <= 2` AND `vice_captain_raw_points >= THRESHOLD_VC_EXPLOSION_PTS` *(Threshold VC: >= 10 pts)*.
- **Required Data**: `manager_gameweek_picks.is_captain`, `is_vice_captain`, `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Cerita penyesalan karena ban kapten tidak berpindah ke Vice-Captain.
- **Contoh Kejadian**: Kapten Saka hanya dapat 2 poin, sementara Vice-Captain Saka/Watkins di tim yang sama meraih 13 poin di bench/starter.

#### Detector 4.3: `DET_CAPT_DIFFERENTIAL_HERO`
- **Story Type / Name**: Differential Captain Hero
- **Category**: Captain Drama
- **Detection Purpose**: Mendeteksi keberanian kapten unik (dikapteni oleh <= 2 manager di liga) yang menghasilkan poin tinggi.
- **Trigger / Detection Logic**: 
  `COUNT(managers_captaining_player) <= THRESHOLD_MAX_DIFF_COUNT` AND `player_points >= THRESHOLD_DIFF_CAP_PTS`
  *(Threshold count: <= 2 manager; Threshold pts: >= 10 raw pts)*.
- **Required Data**: Agregasi `manager_gameweek_picks.is_captain` seluruh 41 manager, `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Spekulasi berani berbuah manis yang membedakan skor manager dari mayoritas liga.
- **Contoh Kejadian**: Hanya 1 manager yang mengkapteni Mbeumo di GW4 dan Mbeumo mencetak 14 pts (28 pts kapten).

---

### Kategori 5: Transfer Stories

#### Detector 5.1: `DET_XFER_MASTERSTROKE`
- **Story Type / Name**: Masterstroke Transfer / Instant Haul
- **Category**: Transfer Stories
- **Detection Purpose**: Mendeteksi pemain baru yang dibeli pada GW berjalan (`manager_transfers.element_in`) dan langsung meledak (*haul*).
- **Trigger / Detection Logic**: 
  `manager_transfers.element_in` AND `fpl_players.event_points >= THRESHOLD_XFER_HAUL_PTS`
  *(Threshold konfigurasional: >= 10 pts)*.
- **Required Data**: `manager_transfers.element_in`, `fpl_players.event_points`, `fpl_players.web_name`.
- **Story Value / Editorial Potential**: Tinggi. Pujian atas ketepatan momentum transfer pemain baru.
- **Contoh Kejadian**: Manager membeli Isak pada GW6, dan Isak langsung mencetak 2 gol (13 poin) di laga pertamanya di skuad.

#### Detector 5.2: `DET_XFER_NIGHTMARE`
- **Story Type / Name**: Transfer Nightmare / Red Card / Injury
- **Category**: Transfer Stories
- **Detection Purpose**: Mendeteksi pemain baru yang ditransfer masuk namun langsung mengalami petaka (kartu merah, poin minus, cedera babak I).
- **Trigger / Detection Logic**: 
  `manager_transfers.element_in` AND (`fpl_players.red_cards > 0` OR `fpl_players.event_points <= 0`).
- **Required Data**: `manager_transfers.element_in`, `fpl_players.event_points`, `fpl_players.red_cards`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Bahan trashtalk bernilai humor tinggi mengenai nasib sial transfer.
- **Contoh Kejadian**: Manager membeli bek X di GW2, dan bek X dikartu merah pada menit ke-20 (-2 poin).

#### Detector 5.3: `DET_XFER_HIT_GAMBIT`
- **Story Type / Name**: Points Hit Gambit / Heavy Hit ROI
- **Category**: Transfer Stories
- **Detection Purpose**: Mendeteksi keputusan mengambil *points hit* (-4, -8, -12+) dan menghitung Net Return On Investment (ROI) dari transfer tersebut.
- **Trigger / Detection Logic**: 
  `manager_gameweek_stats.event_transfers_cost > 0`.
  Hitung `Net Delta = (SUM(points_element_in) - event_transfers_cost) - SUM(points_element_out)`.
- **Required Data**: `manager_gameweek_stats.event_transfers_cost`, `manager_transfers.element_in`, `element_out`.
- **Story Value / Editorial Potential**: Tinggi. Evaluasi apakah pertaruhan pengorbanan poin *hit* terbayar lunas atau justru boncos.
- **Contoh Kejadian**: Manager mengambil hit -8 (2 transfer ekstra), namun 2 pemain baru tersebut total mencetak 22 poin (Net Gain +6 pts).

---

### Kategori 6: Chip Stories

#### Detector 6.1: `DET_CHIP_BENCH_BOOST_RESULT`
- **Story Type / Name**: Bench Boost Activation & Impact
- **Category**: Chip Stories
- **Detection Purpose**: Mendeteksi penggunaan chip *Bench Boost* dan mengukur total poin yang dihasilkan 4 pemain cadangan.
- **Trigger / Detection Logic**: 
  `manager_gameweek_picks.active_chip = 'bboost'` (atau flag chip active).
  Hitung `bench_boost_points = SUM(points WHERE position IN (12, 13, 14, 15))`.
- **Required Data**: `manager_gameweek_picks.active_chip`, `multiplier`, `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Tinggi. Menilai apakah eksekusi Bench Boost memanen poin besar atau terbuang sia-sia (< 10 pts).
- **Contoh Kejadian**: Chip Bench Boost diaktifkan dan 4 pemain cadangan menyumbangkan total 28 poin ekstra.

#### Detector 6.2: `DET_CHIP_FREE_HIT_DELTA`
- **Story Type / Name**: Free Hit Delta Score
- **Category**: Chip Stories
- **Detection Purpose**: Mendeteksi penggunaan chip *Free Hit* dan mengukur selisih poin skuad sampel Free Hit vs estimasi poin skuad asli.
- **Trigger / Detection Logic**: 
  `active_chip = 'freehit'`.
  Hitung `Free Hit Delta = actual_fh_score - estimated_original_squad_score`.
- **Required Data**: `manager_gameweek_picks.active_chip`, `manager_transfers`, `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Tinggi. Menunjukkan apakah keputusan merombak total skuad 1 minggu berbuah keuntungan besar.
- **Contoh Kejadian**: Skuad Free Hit menghasilkan 85 poin, sementara jika memakai skuad lama hanya akan mendapat 42 poin (+43 net gain).

#### Detector 6.3: `DET_CHIP_WILDCARD_IMPACT`
- **Story Type / Name**: Wildcard Debut Performance
- **Category**: Chip Stories
- **Detection Purpose**: Mendeteksi aktivasi chip *Wildcard* dan mengukur performa perdana skuad permanen baru tersebut.
- **Trigger / Detection Logic**: 
  `active_chip = 'wildcard'`.
- **Required Data**: `manager_gameweek_picks.active_chip`, `manager_gameweek_stats.points`.
- **Story Value / Editorial Potential**: Sedang-Tinggi. Evaluasi awal atas perombakan besar susunan tim jangka panjang.
- **Contoh Kejadian**: Skuad Wildcard baru langsung membawa manager melompat dari peringkat #25 ke peringkat #14 di GW8.

---

### Kategori 7: Rivalry Stories

#### Detector 7.1: `DET_RIVAL_DERBY_CLASH`
- **Story Type / Name**: H2H Derby Clash / Close Table Neighbors
- **Category**: Rivalry Stories
- **Detection Purpose**: Mendeteksi duel poin antara dua manager yang berjarak berdekatan di klasemen overall (misal: Rank #1 vs Rank #2, atau Rank #16 vs Rank #17).
- **Trigger / Detection Logic**: 
  `ABS(overall_rank_manager_A - overall_rank_manager_B) == 1` AND `ABS(gw_points_A - gw_points_B) >= THRESHOLD_RIVAL_PTS_GAP`.
- **Required Data**: `manager_gameweek_stats.overall_rank`, `manager_gameweek_stats.points`, `managers.team_name`.
- **Story Value / Editorial Potential**: Tinggi. Narasi rivalitas persaingan langsung antar-rekan kerja di klasemen.
- **Contoh Kejadian**: Rank #1 dan #2 bertarung di GW10, di mana Manager Rank #2 mencetak 70 pts dan melampaui Manager Rank #1 yang mendapat 52 pts.

#### Detector 7.2: `DET_RIVAL_PHOTO_FINISH`
- **Story Type / Name**: Photo Finish / 1-Point Margin
- **Category**: Rivalry Stories
- **Detection Purpose**: Mendeteksi kemenangan atau keunggulan poin dengan selisih sangat tipis (1 poin atau tie-break).
- **Trigger / Detection Logic**: 
  `ABS(points_manager_A - points_manager_B) == 1` (pada H2H / perbandingan skor mingguan).
- **Required Data**: `manager_gameweek_stats.points`, `managers.team_name`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Menyoroti drama luar biasa di mana 1 poin saja menentukan nasib.
- **Contoh Kejadian**: Manager A mengalahkan total poin Manager B dengan skor 63 vs 62 berkat 1 poin bonus di injury time.

---

### Kategori 8: Historical Stories

#### Detector 8.1: `DET_HIST_ALLTIME_HIGH`
- **Story Type / Name**: All-Time League High Score Record
- **Category**: Historical Stories
- **Detection Purpose**: Mendeteksi apabila ada manager yang berhasil memecahkan rekor poin GW tertinggi sepanjang masa di liga FPL Kino Hub.
- **Trigger / Detection Logic**: 
  `points_curr_gw > MAX(manager_gameweek_stats.points ALL_PREVIOUS_GWS)`.
- **Required Data**: Historical `manager_gameweek_stats.points` dari seluruh GW yang telah selesai.
- **Story Value / Editorial Potential**: Sangat Tinggi (kandidat kuat Tier 1 / Headline). Pencapaian rekor bersejarah liga.
- **Contoh Kejadian**: Rekor liga sebelumnya adalah 112 poin; Manager "Kino Master" mencetak 118 poin di GW15 dan memecahkan rekor all-time.

#### Detector 8.2: `DET_HIST_STREAK_MASTER`
- **Story Type / Name**: Consistency Streak / Above Average Run
- **Category**: Historical Stories
- **Detection Purpose**: Mendeteksi manager yang berhasil mempertahankan tren berada di atas rata-rata liga selama N Gameweek berturut-turut.
- **Trigger / Detection Logic**: 
  `COUNT_CONSECUTIVE_GWS(points > league_average) >= THRESHOLD_STREAK_GWS`
  *(Threshold konfigurasional: >= 4 GW berturut-turut)*.
- **Required Data**: `manager_gameweek_stats.points`, `fpl_gameweeks.average_score` historis.
- **Story Value / Editorial Potential**: Tinggi. Mengapresiasi konsistensi jangka panjang yang stabil.
- **Contoh Kejadian**: Manager "Consistent XI" selalu mencetak poin di atas rata-rata liga selama 6 Gameweek berturut-turut (GW3–GW8).

---

### Kategori 9: Fun Facts

#### Detector 9.1: `DET_FUN_UNUSUAL_FORMATION`
- **Story Type / Name**: Tactical Oddity / Unusual Formation
- **Category**: Fun Facts
- **Detection Purpose**: Mendeteksi penggunaan formasi taktis yang jarang dipakai (misal: 5-4-1, 5-2-3, 4-5-1).
- **Trigger / Detection Logic**: 
  Hitung jumlah bek, gelandang, dan penyerang starter di `manager_gameweek_picks`.
  Jika `formation IN ('5-4-1', '5-2-3', '4-5-1')`.
- **Required Data**: `manager_gameweek_picks.position`, `fpl_element_types` (DEF/MID/FWD).
- **Story Value / Editorial Potential**: Sedang (kandidat Tier 4 / Quick Hits). Sisi keunikan eksperimen taktis susunan pemain.
- **Contoh Kejadian**: Manager mengusung formasi "Parkir Bus" 5-4-1 di GW7 dan berhasil mencetak 62 poin.

#### Detector 9.2: `DET_FUN_AUTOSUB_MIRACLE`
- **Story Type / Name**: Auto-Sub Miracle / Bench Rescuer
- **Category**: Fun Facts
- **Detection Purpose**: Mendeteksi keberuntungan masuknya pemain cadangan secara otomatis (*auto-sub*) karena pemain starter tidak bermain (0 menit), dan pemain bench tersebut mencetak poin besar.
- **Trigger / Detection Logic**: 
  `starter_player.minutes == 0` AND `auto_sub_player.event_points >= THRESHOLD_AUTOSUB_HAUL_PTS`
  *(Threshold konfigurasional: >= 8 pts)*.
- **Required Data**: `manager_gameweek_picks.position`, `fpl_players.minutes`, `fpl_players.event_points`.
- **Story Value / Editorial Potential**: Tinggi. Kejutan manis keberuntungan auto-sub di menit akhir.
- **Contoh Kejadian**: Starter Smith tidak main 0 menit, lalu otomatis digantikan oleh defender bench yang mencetak gol (10 poin).

---

### Kategori 10: Rare / Insane Events

#### Detector 10.1: `DET_RARE_CLEANSHEET_SWEEP`
- **Story Type / Name**: Clean Sheet Wall / Defense Masterclass
- **Category**: Rare / Insane Events
- **Detection Purpose**: Mendeteksi kondisi di mana seluruh lini belakang starter manager (Kiper + 3-5 Bek) berhasil mencetak *clean sheet*.
- **Trigger / Detection Logic**: 
  `COUNT(starters WHERE position IN (GK, DEF) AND clean_sheets == 1) == TOTAL_STARTER_DEFENDERS + 1`.
- **Required Data**: `manager_gameweek_picks`, `fpl_players.clean_sheets`, `fpl_players.element_type`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Momen pertahanan kokoh yang sangat jarang terjadi.
- **Contoh Kejadian**: Kiper + 4 Bek starter milik manager semuanya sukses mencatatkan clean sheet di GW9 (total 30+ poin dari lini belakang saja).

#### Detector 10.2: `DET_RARE_RED_CARD_PARTY`
- **Story Type / Name**: Red Card Catastrophe
- **Category**: Rare / Insane Events
- **Detection Purpose**: Mendeteksi apabila terdapat manager yang skuad starternya dihantam lebih dari 1 kartu merah dalam 1 GW.
- **Trigger / Detection Logic**: 
  `COUNT(starters WHERE red_cards > 0) >= THRESHOLD_RED_CARDS_COUNT`
  *(Threshold konfigurasional: >= 2 kartu merah)*.
- **Required Data**: `manager_gameweek_picks`, `fpl_players.red_cards`.
- **Story Value / Editorial Potential**: Sangat Tinggi. Kejadian bencana langka yang sangat bernilai humor dan trashtalk.
- **Contoh Kejadian**: Dua pemain starter dalam satu skuad manager dikartu merah di pertandingan berbeda pada GW11.

#### Detector 10.3: `DET_RARE_MIRROR_SCORE`
- **Story Type / Name**: Mirror Score / Identical GW Points
- **Category**: Rare / Insane Events
- **Detection Purpose**: Mendeteksi dua manager yang bertetangga di klasemen dan mencetak total poin Gameweek yang sama persis hingga angka terakhir.
- **Trigger / Detection Logic**: 
  `points_manager_A == points_manager_B` AND `ABS(overall_rank_A - overall_rank_B) == 1`.
- **Required Data**: `manager_gameweek_stats.points`, `manager_gameweek_stats.overall_rank`.
- **Story Value / Editorial Potential**: Sedang (kandidat Tier 4 / Quick Hits). Kebetulan statistik unik dua saingan liga.
- **Contoh Kejadian**: Rank #5 dan Rank #6 sama-sama mengakhiri GW14 dengan hasil persis 57 poin.

---

## 10. Story Scoring Engine — Detailed Framework & Two-Layer Model

Tujuan utama dari **Story Scoring Engine** adalah mengevaluasi dan menentukan rekomendasi prioritas editorial (*Recommended System Priority*) dari seluruh *Story Candidates* terdeteksi secara data-driven dan deterministik, sebelum diserahkan kepada *AI Editor* untuk tinjauan editorial akhir (*AI Editorial Review*).

### Formulasi Prinsip Utama:

```
Raw Event
  + League Impact
  + Historical Context
  + Drama
  + Rarity
  + Entertainment Value
  ───────────────────────────────────────
  = RECOMMENDED EDITORIAL PRIORITY
```

> **Prinsip Penting**: "Angka mentah terbesar tidak otomatis memiliki skor terbesar".
> *Contoh*: Penyesalan bench 16 poin dari seorang manager yang sedang bertarung sengit memperebutkan peringkat #1 klasemen memiliki *System Priority* yang lebih tinggi dibanding poin bench 20 poin dari manager peringkat bawah yang tidak mempengaruhi persaingan liga.

---

### Detail 6 Dimensi Evaluasi Scoring:

#### 1. Impact Score (Bobot Dampak Liga)
- **Definisi**: Seberapa besar pengaruh kejadian tersebut terhadap peta persaingan liga (perebutan mahkota juara, batas 4 besar, atau zona kualifikasi Cup rank 16).
- **Faktor Evaluasi**: Perubahan selisih poin klasemen, perebutan mahkota pimpinan liga, dan implikasi kualifikasi FPL Kino Cup.

#### 2. Rarity Score (Bobot Keunikan / Kelangkaan)
- **Definisi**: Seberapa unik atau jarang kejadian statistik tersebut terjadi sepanjang sejarah liga.
- **Faktor Evaluasi**: Frekuensi kejadian (misal: 3 kartu merah dalam 1 GW atau 4 bek cleansheet bersamaan bernilai rarity puncak).

#### 3. Drama Score (Bobot Kedramatisan)
- **Definisi**: Seberapa besar unsur kejutan, *comeback*, *collapse*, *upset*, atau kejatuhan drastis di menit-menit akhir.
- **Faktor Evaluasi**: Kebangkitan poin dari posisi terpuruk, kekalahan tragis akibat auto-sub, atau pergantian posisi klasemen di pertandingan terakhir GW.

#### 4. Historical Context Score (Bobot Historis Liga)
- **Definisi**: Keterkaitan peristiwa dengan rekor masa lalu, tren konsistensi (*streak*), riwayat pertemuan, atau perjalanan narasi manager.
- **Faktor Evaluasi**: Pemecahan rekor poin sepanjang masa, kekalahan beruntun yang pecah, atau pengulangan bencana dari musim sebelumnya.

#### 5. Rivalry Score (Bobot Persaingan / Rivalitas)
- **Definisi**: Seberapa erat kejadian tersebut melibatkan persaingan langsung antar-manager berjarak dekat atau rivalitas tradisional liga.
- **Faktor Evaluasi**: Pertarungan dua manager berperingkat berdampingan (rank #1 vs #2, #16 vs #17) atau selisih poin tipis 1 poin.

#### 6. Entertainment Score (Bobot Potensi Trashtalk & Humor)
- **Definisi**: Potensi keseruan cerita, daya pikat humor *office-safe*, kejutan taktis, dan bahan sindiran hangat sesama rekan kerja.
- **Faktor Evaluasi**: Poin bench eksplosif yang ditinggal, kapten blank yang menyakitkan, atau keputusan *points hit* yang boncos.

---

### Model Keputusan Dua Layer (*Two-Layer Decision Model*):

Untuk menjaga sistem tetap *data-driven* dan *deterministic* pada level fakta, tetapi tidak terlalu *rigid* pada keputusan editorial akhir, alokasi prioritas dipisahkan menjadi 2 layer:

```
┌─────────────────────────────────────────────────────────┐
│        LAYER 1 — SYSTEM PRIORITY (DETERMINISTIC)        │
│  - Perhitungan 6 Dimensi Skor Objektif                   │
│  - Score Normalization & Story Clustering               │
│  - Duplicate Filtering & Hard Diversity Constraints     │
│  - Output: Recommended Tier & Fact Sheet Metadata       │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│         LAYER 2 — AI EDITORIAL REVIEW (FLEXIBLE)        │
│  - Review Story Candidates & Fact Sheet Data            │
│  - Evaluasi Kekuatan Narasi & Konteks Editorial         │
│  - Pemilihan Headline News dari Kandidat Prioritas     │
│  - Penyesuaian Final Tier di Dalam Batas Rules          │
│  - Output: Final Tier Assignment & Editorial Angle      │
└─────────────────────────────────────────────────────────┘
```

#### LAYER 1 — SYSTEM PRIORITY (Deterministik Berbasis Data)
Sistem secara 100% deterministik menghasilkan:
1. **Objective Dimension Scores**: Perhitungan terukur dari 6 dimensi evaluasi (Impact, Rarity, Drama, Historical Context, Rivalry, Entertainment).
2. **Normalized Editorial Score**: Penyelarasan skala skor antar-kategori cerita secara adil dan proporsional.
3. **Story Clustering**: Pengelompokan beberapa kandidat cerita beririsan dari manager/kejadian yang sama menjadi satu unit *Story Cluster* yang lebih kaya.
4. **Duplicate Filtering**: Mengeliminasi kandidat cerita duplikat atau redundan.
5. **Diversity Constraints**: Menghasilkan batasan keberagaman topik (*hard diversity rules*) agar tidak terjadi dominasi satu manager atau satu kategori cerita.
6. **Recommended Tier / Priority**: Rekomendasi jenjang penerbitan (*Recommended Tier 1 s/d Tier 4*) berbasis skor objektif data.

#### LAYER 2 — AI EDITORIAL REVIEW (Fleksibel Terukur)
AI Editor menerima daftar *Story Candidates* / *Story Clusters* yang telah dilengkapi *Fact Sheet* dan *Recommended System Priority*.

**AI Editor DIBERIKAN WEWENANG UNTUK**:
- Menentukan sudut pandang narasi utama (*final editorial angle*).
- Menentukan urutan publikasi artikel (*publication order*).
- Menilai kekuatan narasi cerita berdasarkan konteks editorial liga yang lebih luas.
- Memilih *Headline News* (Tier 1) dari jajaran kandidat berprioritas tinggi hasil rekomendasi sistem.
- Menyesuaikan *final tier* di dalam batas aturan editorial yang diperbolehkan (*editorial rules*).
- Memastikan *Newsletter Issue* tetap memiliki variasi cerita yang seimbang dan menarik dibaca.

**AI Editor TIDAK BOLEH (STRICT RESTRICTIONS)**:
- Mengubah fakta atau statistik sumber dari database.
- Mengarang atau menciptakan kejadian/peristiwa baru yang tidak ada di Fact Sheet.
- Mengabaikan aturan keberagaman keras (*hard diversity rules*).
- Menaikkan kandidat cerita yang tidak lolos batas ambang publikasi minimum (*minimum publication threshold*) tanpa justifikasi yang didukung fakta di Fact Sheet.

---

### Sub-Proses Pengolahan Scoring & Filter:

#### A. Score Normalization
- **Tujuan**: Menyelaraskan dan membandingkan skor kandidat dari kategori yang berbeda secara adil (misal: membandingkan `DET_BENCH_EXPLOSION` dengan `DET_RANK_TITLE_CHANGE`).
- **Aturan**: Nilai mentah (*raw values*) dikonversi ke dalam skala bobot terstandarisasi yang memperhitungkan konteks situasional liga, bukan hanya besaran angka absolut mentah.

#### B. Story Clustering
- **Tujuan**: Mengelompokkan beberapa *Story Candidates* yang berasal dari manager atau peristiwa yang sama di Gameweek berjalan menjadi satu unit cerita (*Story Cluster*) dengan konteks narasi yang jauh lebih kaya.
- **Contoh**: Jika Manager X terdeteksi mengalami `DET_CAPT_BLANK_DISASTER` (Kapten blank), `DET_BENCH_EXPLOSION` (Bench meledak 18 pts), dan `DET_RANK_FREEFALL` (Rank merosot 6 posisi), sistem mengelompokkannya menjadi satu **Story Cluster**: *"Bencana Taktis Manager X: Poin Meledak di Bench Saat Kapten Blank & Rank Bebas-Fisik"*. Ini menghasilkan narasi utama yang jauh lebih berkesan daripada menerbitkan 3 artikel terpisah.

#### C. Duplicate Filtering
- **Tujuan**: Mengeliminasi kandidat cerita duplikat atau redundan yang menceritakan fakta yang hampir sama dari sudut pandang serupa.
- **Aturan**: Jika terdapat 2 kandidat menceritakan aspek beririsan dari manager yang sama, pilih satu kandidat/cluster dengan *Editorial Priority* tertinggi dan abaikan yang redundan.

#### D. Diversity Filtering
- **Tujuan**: Menjaga keseimbangan dan keberagaman tema berita dalam satu edisi *Newsletter Issue*.
- **Aturan Diversity**:
  - *Manager Diversity*: Mencegah dominasi artikel hanya dari 1 atau 2 manager yang sama dalam edisi berjalan.
  - *Category Diversity*: Mencegah penumpukan kategori seragam (misal: maksimal 1–2 cerita bertema kapten di Tier 1 & 2).
  - *Tone Balance*: Memastikan keseimbangan antara cerita kemenangan (*positive stories*), cerita bencana (*disaster stories*), drama klasemen (*ranking drama*), rivalitas (*rivalry*), dan *fun facts*.

#### E. Final Tier Assignment
- **Tujuan**: Menetapkan alokasi penerbitan akhir dari *Story Candidates* / *Story Clusters* ke dalam **Sistem 5 Tier** berdasarkan tinjauan Layer 2 AI Editorial Review dari hasil rekomendasi Layer 1 System Priority:
  - **TIER 1 — HEADLINE NEWS** (1 cerita utama).
  - **TIER 2 — FEATURED STORIES** (1–3 cerita pendukung utama).
  - **TIER 3 — REGULAR STORIES** (1–4 cerita berita liga).
  - **TIER 4 — QUICK HITS / FUN FACTS** (dihimpun dalam *news ticker* / *quick hits*).
  - **NOT SELECTED** (disimpan untuk *historical context* rujukan edisi berikutnya).

---

## 11. League Memory & Storyline Engine

Tujuan utama dari **League Memory & Storyline Engine** adalah memberikan konteks historis (*historical context*) berkelanjutan kepada Newsletter System agar setiap Gameweek **tidak** diperlakukan sebagai kejadian terisolasi/terpisah. Engine ini menghubungkan kejadian Gameweek saat ini dengan rekaman historis sebelumnya dan melacak alur cerita (*storyline*) sepanjang musim.

### Formulasi Prinsip Utama:

```
Current Event
  + Relevant Historical Context
  + Previous Storyline
  ───────────────────────────────────────
  = EDITORIAL CONTEXT
```

> **Prinsip Seleksi Konteks (Targeted Context, Not Raw Dump)**:
> Sistem **tidak perlu** memberikan seluruh isi database historis kepada AI. Sistem secara cerdas menyaring dan menyediakan **HANYA historical context yang relevan** dengan *Story Candidate* / *Story Cluster* yang sedang direview.

---

### Detail 6 Jenis Memory System:

#### 1. Manager Profile Memory
- **Definisi**: Informasi dan pola historis yang relevan mengenai profil perjalanan seorang manager.
- **Cakupan**: Gaya taktis favorit, kecenderungan berani mengambil *hit*, riwayat konsistensi musim sebelumnya, dan performa rata-rata sang manager.

#### 2. Performance History Memory
- **Definisi**: Rekam jejak performa, tren *form*, pergerakan peringkat (*rank movement*), *streak*, kebangkitan (*comeback*), dan kejatuhan (*collapse*).
- **Cakupan**: Perjalanan poin 5 Gameweek terakhir, lonjakan/penurunan rank drastis, dan rekor *streak* berada di atas rata-rata liga.

#### 3. Rivalry Memory
- **Definisi**: Riwayat persaingan ketat, pertarungan rank (*rank battle*), rekam jejak *head-to-head*, dan pergeseran posisi antar-manager.
- **Cakupan**: Rekam jejak pertembungan selisih poin tipis antar-manager bertetangga di klasemen dan riwayat kudeta puncak klasemen.

#### 4. League Record Memory
- **Definisi**: Rekor sepanjang masa liga, *milestone* penting, dan peristiwa bersejarah liga sepanjang musim.
- **Cakupan**: Rekor poin mingguan tertinggi (*all-time high*), poin terendah (*all-time floor*), rekor poin bench terbanyak, dan milestone poin kumulatif liga.

#### 5. Recurring Storyline Memory
- **Definisi**: Pola atau *storyline* yang berlanjut dan berkembang selama beberapa Gameweek berturut-turut.
- **Cakupan**: Drama perebutan mahkota pimpinan liga yang berlanjut 3 minggu, atau krisis kapten *blank* yang melanda seorang manager selama sebulan.

#### 6. Previous Newsletter Memory
- **Definisi**: Rekam jejak cerita yang sudah pernah dipublikasikan di edisi Newsletter sebelumnya.
- **Cakupan**: Memungkinkan AI untuk membuat tindak lanjut berita (*follow-up*), kelanjutan narasi (*continuation*), atau penutup cerita (*closure*).

---

### Konsep Storyline Lifecycle (Siklus Hidup Alur Cerita):

Sistem melacak status siklus hidup setiap *storyline* secara terstruktur dari pekan ke pekan:

```
┌─────────────────────────────────────────────────────────┐
│                    STORYLINE CREATED                    │
│      (Inisiasi alur cerita baru saat trigger pemicu)     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    STORYLINE ACTIVE                     │
│    (Storyline sedang berjalan dan relevan untuk diikuti)│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  STORYLINE ESCALATING                   │
│ (Ketegangan/dampak meningkat, misal gap rank memendek)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  STORYLINE CONTINUING                   │
│   (Storyline berlanjut dengan tren perkembangan konstan) │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   STORYLINE RESOLVED                    │
│(Storyline mencapai penyelesaian, misal comeback berhasil)│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   STORYLINE ARCHIVED                    │
│   (Storyline selesai & disimpan sebagai memori arsip)   │
└─────────────────────────────────────────────────────────┘
```

---

### Contoh Pola Arc Storyline (Storyline Arc Patterns):

1. **Rise → Reign → Collapse**:
   Manager merangkak naik dari papan tengah, menguasai puncak klasemen selama beberapa Gameweek, lalu tumbang secara dramatis akibat bencana taktis.
2. **Losing Streak → Recovery → Comeback**:
   Manager terpuruk dalam deretan hasil buruk berturut-turut, menemukan titik balik taktis, dan melakukan lonjakan rank tajam kembali ke papan atas.
3. **Rivalry Begins → Escalation → Rematch**:
   Persaingan dua manager dimulai dari selisih 1 poin di GW4, memanas sepanjang musim, dan mencapai klimaks pada duel pergeseran klasemen akhir.
4. **Transfer Masterstroke → Follow-up → Consequence**:
   Pembelian pemain baru yang meledak di pekan pertama, diikuti konsistensi poin mingguan, hingga berkontribusi membawa manager meraih trofi bulanan.
5. **Previous Disaster → Redemption**:
   Manager yang pernah menderita akibat poin bench eksplosif 20 pts di GW terdahulu berhasil membalas penyesalan tersebut dengan aktivasi chip *Bench Boost* sempurna di GW berikutnya.

---

## 12. AI Editorial Workflow

Arsitektur penyuntingan AI (*AI Editorial Workflow*) mendefinisikan peran terstruktur **AI Editor** setelah tahap pengolahan data sistem (Layer 1) dan sebelum tahap penulisan naskah (*Article Writing*) oleh **AI Writer**.

### Arsitektur Alur Data AI Editor:

```
Story Candidate / Story Cluster
  + Verified Fact Sheet
  + Relevant League Memory
  + Previous Newsletter Context
  + System Priority
  + Recommended Tier
        │
        ▼
    AI EDITOR
        │
        ▼
  Editorial Plan
        │
        ▼
    AI WRITER
```

> **Prinsip Penting Peran AI Editor**:
> AI Editor **bukan** bertugas mencari/mengakses data mentah database dan **bukan** *source of truth* fakta. AI Editor **hanya** menerima data, fakta, dan konteks terverifikasi yang sudah disiapkan oleh sistem.

---

### Tanggung Jawab AI Editor (AI Editor Responsibilities):

1. **Memahami Story Candidate / Cluster**: Menganalisis kandidat cerita atau pengelompokan *Story Cluster* yang lolos filter seleksi.
2. **Memahami Verified Fact Sheet**: Meneliti himpunan data statistik terverifikasi yang melandasi cerita.
3. **Menggunakan Relevant League Memory**: Mengintegrasikan konteks historis selektif yang diberikan oleh *League Memory Engine*.
4. **Memahami Previous Newsletter Context**: Memeriksa keterkaitan dengan edisi Newsletter terdahulu untuk menjaga kontinuitas narasi.
5. **Menilai Signifikansi Editorial**: Evaluasi kekuatan dan daya tarik berita (*editorial significance*) bagi pembaca liga.
6. **Menentukan Editorial Angle**: Menetapan sudut pandang narasi utama (misal: penyesalan taktis, kedramatisan *comeback*, atau sindiran humor).
7. **Memilih Narrative Framing**: Membingkai alur cerita berita (*narrative framing*).
8. **Menentukan Tone**: Menentukan nada bahasa yang sesuai (*office-safe trashtalk*, *dramatic*, *celebratory*, atau *analytical*).
9. **Memilih Format Cerita**: Memastikan format tampilan sesuai alokasi tier.
10. **Memberikan Rekomendasi Final Tier**: Mengonfirmasi atau menyesuaikan alokasi tier final di dalam batas aturan editorial (*editorial rules*).
11. **Membuat Editorial Plan**: Menghasilkan dokumen rancangan instruksi dan batasan penulisan terstruktur untuk *AI Writer*.

---

### Input Contract untuk AI Editor:

Sistem memberikan paket data terstruktur berikut kepada AI Editor:
- **Story Candidate / Cluster**: Identitas dan deskripsi kandidat/cluster cerita.
- **Verified Facts**: Fact Sheet terverifikasi berisi angka dan kejadian sah.
- **System Priority**: Skor terukur 6 dimensi dari Layer 1 System Priority.
- **Recommended Tier**: Rekomendasi alokasi tier dari sistem.
- **Relevant Historical Context**: Memori historis yang disaring dari *League Memory Engine*.
- **Previous Newsletter Context**: Ringkasan cerita dari edisi Newsletter sebelumnya.
- **Diversity Constraints**: Batasan keberagaman topik dan kuota manager edisi berjalan.

---

### Output Contract: `Editorial Plan`

AI Editor wajib menghasilkan dokumen terstruktur **Editorial Plan** dengan komponen minimal sebagai berikut:

- `Story ID`: Identitas unik cerita.
- `Final Editorial Angle`: Sudut pandang narasi utama yang dipilih.
- `Narrative Theme`: Tema utama berita.
- `Tier`: Alokasi tier final yang disetujui (Tier 1 s/d Tier 4).
- `Tone`: Gaya dan nada penulisan.
- `Title Direction`: Petunjuk arah penulisan judul berita.
- `Why This Story Matters`: Justifikasi alasan pentingnya cerita ini bagi liga.
- `Narrative Structure`: Alur Pembuka (Hook) → Data Utama → Implikasi Klasemen → Penutup.
- `Key Facts That Must Be Included`: Daftar fakta statistik wajib dari Fact Sheet yang HARUS muncul di naskah.
- `Historical Context Allowed For Use`: Konteks historis spesifik yang diizinkan untuk dipakai.
- `Office-Safe Trash Talk Opportunity`: Peluang sentilan trashtalk yang aman dan relevan.
- `Facts That Must Not Be Inferred`: Batasan tegas fakta yang DILARANG DIBUAT INFERENSI/REKAYASA.
- `Writing Instructions For AI Writer`: Instruksi penulisan spesifik untuk AI Writer.

---

### Aturan Ketat AI Editor (Strict Rules):

1. **No Fact Fabrication**: AI Editor dilarang keras membuat, mengarang, atau mengubah fakta statistik.
2. **No Unsourced Statistics**: AI Editor dilarang menambahkan angka atau statistik yang tidak tercantum di Fact Sheet.
3. **System-Provided History Only**: Historical context hanya boleh digunakan jika secara eksplisit diberikan oleh sistem.
4. **No Fact Inferences from Opinions**: AI Editor dilarang menganggap opini atau interpretasi naratif sebagai fakta data baru.
5. **Respect Diversity Constraints**: AI Editor wajib menghormati *diversity constraints* dan batasan editorial (*editorial boundaries*).

---

### Pemisahan Peran Tri-Partite (Tri-Partite Role Separation):

```
SYSTEM
  ├── Menemukan, mengekstrak, mengkalkulasi skor, & memverifikasi fakta (Source of Truth)
  │
AI EDITOR
  ├── Menentukan bagaimana fakta diolah menjadi rencana cerita (Editorial Plan)
  │
AI WRITER
  └── Menulis naskah cerita berita lengkap berdasarkan Editorial Plan & Verified Facts
```

---

## 13. AI Writer Workflow

Tujuan utama dari **AI Writer** adalah mengubah dokumen **Editorial Plan** dan **Verified Fact Sheet** menjadi naskah artikel Newsletter yang hidup, menarik, humoris, dan memiliki karakter editorial khas FPL Kino Indonesia.

### Arsitektur Alur Input AI Writer:

```
Editorial Plan
  + Verified Fact Sheet
  + Allowed Historical Context
  + Tier-Specific Writing Rules
        │
        ▼
    AI WRITER
        │
        ▼
  Article Draft
        │
        ▼
Fact Check & Safety Gate
```

> **Batasan Peran AI Writer (What AI Writer DOES NOT DO)**:
> AI Writer **TIDAK BERTUGAS**:
> - Mencari data mentah atau informasi baru.
> - Menghitung ulang statistik atau poin.
> - Mengubah skor atau prioritas cerita (*Story Priority*).
> - Mengubah sudut pandang berita (*editorial angle*) yang sudah ditetapkan AI Editor.
> - Membuat fakta baru yang tidak ada di Fact Sheet.
> *AI Writer HANYA bertugas menulis naskah berdasarkan data dan instruksi terstruktur yang diberikan.*

---

### Tier-Specific Writing Rules:

#### 1. TIER 1 — HEADLINE NEWS (Artikel Utama Newsletter Issue)
- **Karakter Penulisan**:
  - Narasi naratif terkuat (*strongest narrative*).
  - Pembuka artikel wajib memiliki daya pikat (*opening hook*) yang kuat.
  - Pengenceran narasi mendalam (*deeper storytelling*) dan taktis.
  - Memanfaatkan *relevant historical context* jika disetujui di Editorial Plan.
  - Memiliki penutup artikel yang tegas (*clear ending*) atau *punchline* trashtalk yang berkesan.

#### 2. TIER 2 — FEATURED STORIES (Artikel Pendukung Utama)
- **Karakter Penulisan**:
  - Terfokus pada satu fokus cerita utama.
  - Memiliki *editorial angle* yang jelas dan tajam.
  - Panjang naskah lebih ringkas daripada Headline News.
  - Tetap mempertahankan alur *storytelling* dan kepribadian berita yang hidup.

#### 3. TIER 3 — REGULAR STORIES (Artikel Kejadian Menarik)
- **Karakter Penulisan**:
  - Langsung ke sasaran fakta (*direct*).
  - Menghibur (*entertaining*) dan padat.
  - Terfokus pada inti peristiwa tanpa memerlukan narasi pembuka/penutup yang terlalu panjang.

#### 4. TIER 4 — QUICK HITS / FUN FACTS (Format Sangat Ringkas)
- **Karakter Penulisan**:
  - Format sangat singkat (1–2 kalimat).
  - Berupa *fun fact*, sorotan statistik (*statistic highlight*), *one-liner*, *mini commentary*, atau gaya *news ticker bar*.

---

### Article Output Contract:

Setiap draf artikel (*article draft*) yang dihasilkan oleh AI Writer wajib mengembalikan struktur komponen minimal sebagai berikut:

- `Article ID`: Identitas unik naskah artikel terbitan.
- `Story ID / Story Cluster ID`: ID rujukan kandidat/cluster cerita sumber.
- `Tier`: Alokasi tier penerbitan artikel (Tier 1 s/d Tier 4).
- `Headline`: Judul utama artikel yang dramatis dan menarik pembaca.
- `Subheadline`: Judul sekunder/rangkuman singkat ulasan berita.
- `Article Body`: Naskah tubuh artikel berita lengkap.
- `Key Facts Used`: Daftar fakta statistik sah yang secara eksplisit disebutkan dalam naskah.
- `Historical Context Used`: Memori historis yang digunakan di dalam naskah.
- `Trash Talk Level`: Tingkat bobot sentilan trashtalk (*Low / Medium / High*).
- `Fact Check Status`: Status verifikasi fakta awal (*Pending Verification / Passed*).

---

### Prinsip Penulisan AI Writer (Writing Principles):

1. **Story First, Statistics Second**: Utamakan alur narasi cerita; angka statistik ditempatkan sebagai bukti pendukung narasi.
2. **Opening Hook**: Paragraf pertama wajib memikat perhatian pembaca, bukan laporan kaku.
3. **No Stat Dumping**: Dilarang mengawalikan artikel dengan deretan dump angka statistik mentah.
4. **Natural Manager & Event Context**: Sebut nama manager, nama tim, dan kejadian pertandingan secara mengalir dalam bahasa Indonesia yang alami.
5. **Verified Event-Based Trashtalk**: Humor dan sentilan trashtalk wajib berakar dari fakta kejadian atau keputusan taktis terverifikasi di Fact Sheet.
6. **No Personal Attacks**: Dilarang menyerang pribadi, fisik, pekerjaan, atau latar belakang manager (*office-safe boundaries*).
7. **No Excessive Repetition**: Dilarang mengulang-ulang data statistik yang sama secara berlebihan di dalam satu naskah.
8. **No Manager Quotes Fabrication**: Dilarang mengarang pernyataan atau kuotasi (*quote*) seolah-olah diucapkan oleh manager.
9. **No Unsourced Events**: Dilarang mengarang kejadian pertandingan yang tidak ada di Fact Sheet.
10. **No Unapproved Historical Context**: Dilarang menggunakan memori historis yang tidak diberikan oleh sistem di Editorial Plan.
11. **No Narrative Interpretation Presented as Fact**: Dilarang menyajikan opini atau interpretasi naratif seolah-olah data fakta resmi.

---

### Suara Editorial Newsletter (Editorial Voice):

Dokumen menetapkan karakter suara (*editorial voice*) Newsletter FPL Kino Indonesia sebagai:

- **Energetic**: Penuh semangat, antusias, dan bergelora.
- **Witty**: Cerdas, cerdik, dan responsif terhadap keunikan taktis.
- **Competitive**: Bergengsi, menonjolkan atmosfer kompetisi antar-manager.
- **Football-Media Inspired**: Mengadopsi gaya jurnalistik media pers sepak bola populer (misal: gaya pers BBC/Sky Sports/BOLA).
- **Playful**: Jenaka, santai, dan penuh bumbu hiburan.
- **Sharp But Friendly**: Tajam menyentil keputusan taktis tetapi tetap hangat bersahabat.
- **Office-Safe**: Aman dibaca di lingkungan kerja tanpa melanggar norma profesional.

#### Tone Yang Wajib Dihindari (Tones to Avoid):
- *Generic AI Tone* (nada kaku dan klise khas AI generik).
- *Corporate / Overly Formal* (bahasa kaku korporat atau terlalu resmi).
- *Robotic* (datar tanpa emosi).
- *Personally Insulting* (menyerang personalitas).
- *Repetitive* (berulang-ulang).

---

### Kedalaman & Panjang Artikel Berdasarkan Tier (Tier-Specific Length & Depth):

Panjang dan kedalaman naskah artikel diatur secara proporsional sesuai tier-nya menggunakan rentang dinamis konfigurasional (*configurable editorial rules*), bukan jumlah kata tunggal yang rigid:

- **Headline News (Tier 1)**: Memiliki kedalaman *storytelling* dan analisis taktis paling komprehensif.
- **Featured Stories (Tier 2)**: Memiliki alur narasi kuat namun dikemas lebih padat dan ringkas.
- **Regular Stories (Tier 3)**: Berfokus langsung pada fakta inti secara *direct*.
- **Quick Hits / Fun Facts (Tier 4)**: Format sangat singkat (1–2 kalimat / poin fakta).

---

### Pemisahan Tanggung Jawab Utama (Responsibility Triad):

```
SYSTEM     ──► Menyediakan Facts, Stat Aggregations, & Recommended Priority
AI EDITOR  ──► Menyusun Editorial Plan & Final Tier Assignment
AI WRITER  ──► Menghasilkan Article Drafts Berdasarkan Editorial Plan & Facts
```

---

## 14. Fact Check & Safety Gate

Tujuan utama dari **Fact Check & Safety Gate** adalah memvalidasi dan memverifikasi seluruh draf naskah artikel (*Article Draft*) secara ketat sebelum artikel diizinkan diterbitkan ke dalam edisi publikasi *Newsletter Issue*.

### Arsitektur Alur Pengujian Validasi:

```
AI WRITER
    │
    ▼
Article Draft
    │
    ▼
Fact Check & Safety Gate
    │
    ├─► PASS ──────────────► Newsletter Issue
    │
    ├─► REVISION REQUIRED ─► Revision Loop (Perbaikan AI Writer)
    │
    └─► REJECTED ──────────► Discarded / Archived (Dibatalkan)
```

---

### 4 Layer Validasi (Validation Layers):

#### 1. Fact Validation (Validasi Ketepatan Data)
Validasi bahwa seluruh fakta dan angka yang disebutkan dalam *Article Draft* 100% cocok dengan data sah di *Verified Fact Sheet*.
- **Item Yang Diperiksa**: Angka statistik poin, nama manager, peringkat (*rank*), nomor Gameweek, nama pemain, kapten & vice-captain, transaksi transfer masuk/keluar, chip aktif, dan rekor historis.
- **Strict Rule**: AI Writer dilarang keras mengarang atau menambahkan fakta baru yang tidak tersedia dalam *source data* mentah terverifikasi.

#### 2. Context Validation (Validasi Konteks & Memori Historis)
Validasi bahwa penggunaan memori historis dan konteks Newsletter edisi terdahulu memang terdaftar di dalam *Allowed Historical Context*.
- **Item Yang Diperiksa**:
  - Dilarang menggunakan riwayat historis yang tidak disuplai oleh sistem.
  - Dilarang salah menghubungkan alur alur cerita (*storyline*).
  - Dilarang menyatakan interpretasi naratif sebagai fakta historis data mentah.
  - Dilarang membuat kelanjutan (*continuation*) atau penutupan cerita (*closure*) tanpa didukung data resmi.

#### 3. Editorial Safety Validation (Validasi Keamanan Editorial & Etika)
Validasi bahwa karakter suara editorial tetap mematuhi batasan *office-safe* dan norma profesional.
- **Item Yang Diperiksa**:
  - Sentilan *trashtalk* wajib berstatus *office-safe*.
  - Humor murni menyasar keputusan taktis (*tactical decisions*) atau hasil poin, bukan menyerang personalitas manager.
  - Bebas dari segala bentuk *harassment*, bullying, atau penghinaan pribadi (*personal insult*).
  - Dilarang membuat kuotasi palsu (*fabricated quotes*) seolah diucapkan manager.
  - Dilarang membuat klaim seolah-olah manager berkata/berbuat sesuatu di luar fakta data.

#### 4. Output Validation (Validasi Struktur & Kesesuaian Tier)
Validasi kesesuaian draf artikel dengan rancangan *Editorial Plan* dan alokasi tier penerbitan.
- **Item Yang Diperiksa**:
  - Sudut pandang berita (*editorial angle*) tetap konsisten dengan Editorial Plan.
  - Alokasi tier sesuai dengan rencana publikasi.
  - Panjang naskah dan kedalaman ulasan (*length & depth*) proporsional dengan tier.
  - Bebas dari pengulangan fakta berlebihan (*excessive repetition*).
  - Struktur naskah artikel lengkap (Judul, Subjudul, Isi, Poin Fakta).
  - Seluruh *Key Facts Used* dapat dipetakan 1-to-1 ke *Verified Fact Sheet*.

---

### Hasil Keputusan Validasi (Decision Outcomes):

Setiap pengujian validasi mengembalikan salah satu dari 3 status keputusan resmi:

1. **PASS**: Artikel sukses melampaui seluruh 4 layer validasi tanpa cacat dan secara resmi dinyatakan **siap dipublikasikan** ke Newsletter Issue.
2. **REVISION REQUIRED**: Artikel memiliki catatan kesalahan minor (misal: penulisan angka poin typo atau penggunaan kata trashtalk terlalu tajam) yang dapat diperbaiki melalui *Revision Loop* tanpa merubah identitas cerita atau Editorial Plan.
3. **REJECTED**: Artikel mengalami pelanggaran fatal (misal: rekayasa fakta besar, penghinaan personal, atau *factual mismatch* parah) sehingga artikel secara permanen **dibatalkan dari penerbitan**.

---

### Fact Check Result Contract:

Dokumen hasil pengujian validasi wajib menghasilkan *output contract* terstruktur sebagai berikut:

- `Article ID`: Identitas unik naskah artikel yang diuji.
- `Validation Status`: Status keputusan validasi (`PASS`, `REVISION REQUIRED`, `REJECTED`).
- `Failed Validation Layer`: Layer validasi yang mendeteksi kegagalan (`Fact Validation`, `Context Validation`, `Safety Validation`, atau `Output Validation`).
- `Detected Issue`: Deskripsi detail temuan kesalahan fakta, context, atau safety.
- `Related Fact or Rule`: Rujukan fakta resmi Fact Sheet atau aturan safety yang dilanggar.
- `Required Correction`: Instruksi perbaikan spesifik bagi AI Writer untuk revisi.
- `Recheck Required`: Flag penanda bahwa pengujian ulang wajib dilakukan setelah revisi (`TRUE / FALSE`).

---

### Siklus Perbaikan (Revision Loop):

Jika naskah artikel menerima status `REVISION REQUIRED`, proses perbaikan mengikuti alur siklus tertutup berikut:

```
Article Draft (Versi Awal)
      │
      ▼
Validation Feedback (Temuan Kesalahan Fact Check)
      │
      ▼
AI Writer Revision (Perbaikan Naskah oleh AI Writer)
      │
      ▼
Fact Check & Safety Gate (Pengujian Ulang Validasi)
      │
PASS / REVISION REQUIRED / REJECTED
```

> **Strict Rule Keamanan**: Artikel **DILARANG KERAS** diizinkan masuk ke dalam edisi terbitan *Newsletter Issue* jika belum secara resmi mengantongi status verifikasi **PASS**.

---

### Pemisahan Ketat 3 Kategori Konten Berita:

Sistem mewajibkan pemisahan tegas dan jelas antara 3 kategori konten berita berikut:

```
┌─────────────────────────────────────────────────────────┐
│                     VERIFIED FACT                       │
│    (Fakta statistik objektif 100% dari data SQL)       │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│              EDITORIAL INTERPRETATION                   │
│   (Interpretasi & pengemasan naratif oleh AI Editor)   │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                  HUMOR / TRASH TALK                     │
│ (Framing sentilan editorial yang wajib office-safe)    │
└─────────────────────────────────────────────────────────┘
```

- **Strict Boundary**: Sistem DILARANG KERAS memperlakukan atau mencampuradukkan salah satu dari ketiga kategori tersebut seolah-olah merupakan kategori yang sama.

---

## 15. AI Prompt System Architecture

Arsitektur Sistem Prompt AI (*AI Prompt System Architecture*) mendefinisikan batas kontrak (*prompt contracts*), format input/output terstruktur, serta aturan baku bagi 3 peran AI spesialis (*specialized AI roles*) di dalam Sistem Newsletter FPL Kino Hub.

### Formulasi Prinsip Utama:

```
┌─────────────────────────────────────────────────────────┐
│                 SYSTEM CONTROLS FACTS                   │
│   (Sistem menguasai, mengekstrak, & memverifikasi data) │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│              AI CONTROLS EDITORIAL EXPRESSION           │
│  - AI Editor: Controls Editorial Direction              │
│  - AI Writer: Controls Article Narrative Expression     │
│  - AI Fact Checker: Controls Validation Auditor         │
└─────────────────────────────────────────────────────────┘
```

---

### Detail 3 Specialized AI Roles:

#### 1. AI EDITOR
- **Tujuan Utama**: Mengubah *Story Candidate* atau *Story Cluster* yang telah diverifikasi oleh sistem menjadi dokumen rencana kerja editorial terstruktur (**Editorial Plan**).
- **Input Contract**:
  - `Story Candidate / Cluster` (Data ID dan jenis kandidat)
  - `Verified Fact Sheet` (Fakta statistik terverifikasi)
  - `Relevant League Memory` (Konteks historis selektif dari sistem)
  - `Previous Newsletter Context` (Rekam jejak edisi terdahulu)
  - `System Priority` (Skor terukur 6 dimensi Layer 1)
  - `Recommended Tier` (Rekomendasi tier penerbitan dari sistem)
  - `Diversity Constraints` (Batasan keberagaman topik dan manager)
- **Output Contract**: Dokumen **Editorial Plan** (JSON/Markdown terstruktur).
- **Strict Boundaries (AI Editor DILARANG KERAS)**:
  - Dilarang mencari/mengakses data mentah baru di luar input terverifikasi.
  - Dilarang mengubah fakta data statistik.
  - Dilarang mengolah/menghitung statistik baru.
  - Dilarang menulis draf naskah artikel final.

#### 2. AI WRITER
- **Tujuan Utama**: Mengubah dokumen **Editorial Plan** dan data fakta terverifikasi (*Verified Fact Sheet*) menjadi draf naskah artikel berita terbitan (**Article Draft**).
- **Input Contract**:
  - `Editorial Plan` (Dokumen instruksi penyuntingan dari AI Editor)
  - `Verified Fact Sheet` (Data fakta resmi sah)
  - `Allowed Historical Context` (Memori historis yang disetujui untuk dipakai)
  - `Tier-Specific Writing Rules` (Aturan karakter gaya penulisan per tier)
- **Output Contract**: Dokumen **Article Draft** (JSON/Markdown terstruktur).
- **Strict Boundaries (AI Writer DILARANG KERAS)**:
  - Dilarang mencari fakta baru yang tidak tercantum di input.
  - Dilarang mengubah sudut pandang berita (*editorial angle*) yang sudah ditetapkan AI Editor.
  - Dilarang menghitung ulang statistik poin atau rank.
  - Dilarang mengarang kuotasi (*quote*) pernyataan palsu manager.
  - Dilarang mengarang kejadian pertandingan yang tidak ada di Fact Sheet.

#### 3. AI FACT CHECKER
- **Tujuan Utama**: Memvalidasi dan menguji draf naskah artikel (*Article Draft*) melampaui 4 layer validasi (Fact, Context, Safety, Output) sebelum dipublikasikan.
- **Input Contract**:
  - `Article Draft` (Draf naskah dari AI Writer)
  - `Verified Fact Sheet` (Data fakta resmi dari sistem)
  - `Editorial Plan` (Dokumen rancangan dari AI Editor)
  - `Allowed Historical Context` (Riwayat historis sah yang diperbolehkan)
  - `Editorial Safety Rules` (Batasan etika & trashtalk *office-safe*)
- **Output Contract**: Dokumen **Fact Check Result** (`PASS`, `REVISION REQUIRED`, `REJECTED`).
- **Strict Boundaries (AI Fact Checker DILARANG KERAS)**:
  - Dilarang menulis naskah artikel berita baru.
  - Dilarang mengarang fakta baru.
  - Dilarang mengubah data sumber mentah (*source data*).

---

### Shared Global Rules (Aturan Baku Bersama Seluruh AI Roles):

Setiap agen AI spesialis dalam sistem ini wajib secara ketat mematuhi 7 aturan global bersama berikut:

1. **Facts as Source of Truth**: Wajib memperlakukan fakta yang diberikan sistem (*system-provided facts*) sebagai *single source of truth* mutlak.
2. **No Hallucination**: Dilarang keras mengarang, mereka-reka, atau mengimajinasikan data/kejadian palsu.
3. **No Unapproved Context**: Dilarang menggunakan memori historis yang tidak secara eksplisit disuplai oleh sistem.
4. **Strict Category Separation**: Wajib membedakan secara tegas antara **Verified Fact**, **Editorial Interpretation**, dan **Humor / Trash Talk**.
5. **Office-Safe Boundaries**: Wajib menjaga batasan etika editorial *office-safe* (bebas serangan personal/harassment).
6. **Structured Contracts**: Wajib beroperasi menggunakan *structured input* dan menghasilkan *structured output*.
7. **Role Boundaries**: Dilarang keras mengambil keputusan atau bertindak di luar batas peran (*role boundaries*) masing-masing.

---

### Contracts Input & Output Prompt:

- **Prompt Input Contract**:
  Setiap prompt disuplai dengan data terstruktur (*structured input*) yang telah diekstrak dan disaring oleh sistem. Prompt **tidak pernah** menerima *raw database dump* mentah tanpa kurasi.
- **Prompt Output Contract**:
  Setiap peran AI wajib menghasilkan *structured output* terprediksi (misal: format JSON atau Markdown terdefinisi) yang dapat di-parsing dan diteruskan secara langsung ke tahapan pipeline berikutnya tanpa perlu intervensi manual.

---

### Formulasi Formulasi Prompt Terbuka (Dynamic Wording Disclaimer):

> **Catatan Arsitektur**:
> Rincian teks *wording* prompt final untuk setiap agen AI akan disusun berdasarkan kontrak arsitektur yang didefinisikan dalam dokumen ini. Teks prompt dapat disesuaikan, diuji, dan dioptimasi di masa depan tanpa merubah arsitektur dasar maupun batasan kontrak sistem ini.

---

## 16. AI Editor Prompt Design

Dokumen arsitektur konseptual instruksi prompt (*AI Editor Prompt Design*) yang mendefinisikan kontrak instruksi bagi agen **AI Editor**:

### Formulasi Prinsip Utama:

```
SYSTEM CONTROLS FACTS
AI EDITOR CONTROLS EDITORIAL DIRECTION
```

---

### Rancangan Prompt Konseptual AI Editor (8 Core Sections):

#### 1. Role & Mission
> Anda adalah **AI Chief Editor** untuk Newsletter FPL Kino Indonesia. Misi utama Anda adalah menganalisis kandidat cerita (*Story Candidate* atau *Story Cluster*) terverifikasi, mengevaluasi kekuatan narasinya bagi komunitas liga, menetapkan sudut pandang editorial (*editorial angle*), menentukan alokasi tier penerbitan (*Final Tier Assignment*), serta menyusun rancangan dokumen **Editorial Plan** terstruktur yang siap digunakan oleh AI Writer.

#### 2. Source of Truth
> Seluruh data statistik, nama manager, peringkat, Gameweek, dan kejadian pertandingan yang disuplai oleh sistem dalam `Verified Fact Sheet` bersifat **Source of Truth Mutlak**. Anda DILARANG KERAS mencari data mentah di luar input, mengarang fakta, atau mengubah statistik.

#### 3. Allowed Inputs
> Anda HANYA diperbolehkan mengambil data dari komponen input terstruktur berikut:
> - `Story Candidate / Cluster`
> - `Verified Fact Sheet`
> - `Relevant League Memory`
> - `Previous Newsletter Context`
> - `System Priority` (Bobot prioritas terukur Layer 1)
> - `Recommended Tier` (Rekomendasi alokasi tier dari sistem)
> - `Diversity Constraints` (Batasan kuota manager & variasi topik)

#### 4. Editorial Responsibilities
> Tanggung jawab utama Anda meliputi:
> 1. Menilai signifikansi editorial (*editorial significance*) kandidat cerita.
> 2. Menentukan sudut pandang narasi berita utama (*narrative angle*).
> 3. Membingkai tema narasi (*narrative theme*) dan *tone* bahasa penulisan.
> 4. Menentukan petunjuk arah penulisan judul berita (*title direction*).
> 5. Menentukan rekomendasi *Final Tier Assignment* (Tier 1 Headline, Tier 2 Featured, Tier 3 Regular, Tier 4 Quick Hits, atau Not Selected) dengan mempertimbangkan rekomendasi sistem dan *Diversity Constraints*.
> 6. Menyusun rancangan dokumen **Editorial Plan** terstruktur secara utuh.

#### 5. Strict Restrictions (Batasan Ketat AI Editor)
> Anda DILARANG KERAS:
> - Mencari atau mengambil data mentah baru di luar paket input yang disajikan.
> - Mengarang, mengubah, atau manipulasi fakta/angka statistik.
> - Menggunakan konteks historis di luar `Relevant League Memory` yang diberikan sistem.
> - Menulis draf naskah artikel berita final (*Article Body*).
> - Mengabaikan aturan keberagaman keras (*hard diversity rules*) dan batasan etika *office-safe*.

#### 6. Editorial Decision Framework
> Dalam mengambil keputusan editorial:
> 1. Evaluasi bobot *System Priority* dan *Recommended Tier*.
> 2. Hubungkan dengan konteks memori historis (`Relevant League Memory`) dan edisi sebelumnya (`Previous Newsletter Context`).
> 3. Periksa kepatuhan terhadap `Diversity Constraints`.
> 4. Pilih kandidat cerita terbaik untuk diangkat sebagai *Headline News* (Tier 1).
> 5. Tetapkan *Editorial Angle* yang paling berkesan dan bermakna bagi pembaca liga FPL Kino Indonesia.

#### 7. Required Output (`Editorial Plan`)
> Anda wajib mengembalikan dokumen terstruktur `Editorial Plan` yang berisi bidang-bidang berikut:
> - `story_id`: ID unik kandidat/cluster cerita.
> - `final_editorial_angle`: Sudut pandang berita utama yang dipilih.
> - `narrative_theme`: Tema besar narasi.
> - `tier`: Alokasi tier final yang disetujui (Tier 1 s/d Tier 4).
> - `tone`: Gaya bahasa yang ditentukan (*office-safe trashtalk / dramatic / celebratory*).
> - `title_direction`: Petunjuk arah judul berita.
> - `why_this_story_matters`: Justifikasi relevansi berita bagi liga.
> - `narrative_structure`: Alur pembukaan (hook), tubuh data utama, implikasi klasemen, dan penutup.
> - `key_facts_that_must_be_included`: Daftar fakta wajib dari Fact Sheet yang HARUS ditulis AI Writer.
> - `historical_context_allowed_for_use`: Konteks historis sah yang diizinkan untuk dipakai.
> - `office_safe_trash_talk_opportunity`: Peluang sentilan trashtalk yang aman dan relevan.
> - `facts_that_must_not_be_inferred`: Batasan tegas fakta yang DILARANG DILAKUKAN INFERENSI/REKAYASA.
> - `writing_instructions_for_ai_writer`: Instruksi penulisan spesifik untuk AI Writer.

#### 8. Output Rules
> Output wajib dikembalikan dalam bentuk objek terstruktur (JSON/Markdown terdefinisi) tanpa teks pembuka atau penutup di luar objek response, sehingga dapat secara otomatis di-parse oleh sistem dan disuplai ke AI Writer.

---

## 17. AI Writer Prompt Design

Dokumen arsitektur konseptual instruksi prompt (*AI Writer Prompt Design*) yang mendefinisikan kontrak instruksi bagi agen **AI Writer**:

### Formulasi Prinsip Utama:

```
SYSTEM CONTROLS FACTS  
AI EDITOR CONTROLS EDITORIAL DIRECTION  
AI WRITER CONTROLS NARRATIVE EXPRESSION
```

---

### Rancangan Prompt Konseptual AI Writer (9 Core Sections):

#### 1. Role & Mission
> Anda adalah **AI Senior Sports Writer / Journalist** untuk Newsletter FPL Kino Indonesia. Misi utama Anda adalah mengubah dokumen **Editorial Plan**, data fakta terverifikasi (**Verified Fact Sheet**), serta konteks historis resmi (**Allowed Historical Context**) menjadi naskah draf artikel berita terstruktur (**Article Draft**). Anda mengontrol sepenuhnya ekspresi narasi (*narrative expression*), gaya bahasa, pemilihan kata (*wording*), serta sentilan humor *office-safe*.

#### 2. Source of Truth
> Data fakta statistik dalam `Verified Fact Sheet` bersifat **Source of Truth Mutlak**. Seluruh angka poin, nama manager, peringkat, Gameweek, dan kejadian pertandingan adalah data sah terverifikasi. Kreativitas penulisan Anda HANYA diperbolehkan pada level ekspresi narasi dan pengemasan kalimat, BUKAN pada level pengubahan atau penciptaan fakta baru.

#### 3. Required Inputs
> Anda HANYA dapat memproses penulisan berdasarkan input terstruktur berikut:
> - `Editorial Plan` (Dokumen petunjuk penyuntingan dari AI Editor)
> - `Verified Fact Sheet` (Data fakta resmi dari sistem)
> - `Allowed Historical Context` (Memori historis yang disetujui untuk dipakai)
> - `Tier-Specific Writing Rules` (Aturan kedalaman dan karakter penulisan per tier)

#### 4. Writing Responsibilities
> Tanggung jawab utama penulisan Anda meliputi:
> 1. Menyusun naskah tubuh artikel berita lengkap yang hidup, dramatis, dan menarik.
> 2. Menulis *Opening Hook* yang kuat pada paragraf pertama untuk memikat perhatian pembaca.
> 3. Menerapkan prinsip *Story First, Statistics Second* (narasi cerita didahulukan, statistik ditaruh sebagai bukti pendukung).
> 4. Memasukkan seluruh poin statistik yang terdaftar pada `key_facts_that_must_be_included` di Editorial Plan.
> 5. Mengemas sentilan *office-safe trashtalk* yang tajam namun bersahabat berdasarkan fakta kejadian nyata.
> 6. Menyebutkan nama manager, nama tim, dan kejadian pertandingan secara mengalir dalam Bahasa Indonesia jurnalistik media olahraga populer.

#### 5. Editorial Voice
> Karakter suara (*editorial voice*) penulisan Anda wajib mematuhi standar berikut:
> - **Karakter Wajib**: *Energetic*, *Witty*, *Competitive*, *Football-Media Inspired*, *Playful*, *Sharp But Friendly*, dan *Office-Safe*.
> - **Tone Dilarang**: *Generic AI Tone*, *Corporate / Overly Formal*, *Robotic*, *Personally Insulting*, dan *Repetitive*.

#### 6. Tier-Specific Writing Rules
> Anda wajib menyesuaikan kedalaman dan gaya naskah berdasarkan alokasi tier-nya:
> - **TIER 1 — HEADLINE NEWS**: Narasi naratif terkuat, *opening hook* memikat, ulasan taktis mendalam, memanfaatkan *allowed historical context*, serta penutup/punchline yang berkesan.
> - **TIER 2 — FEATURED STORIES**: Fokus pada 1 sudut pandang utama, ulasan tajam dan padat, tetap mempertahankan alur *storytelling* yang hidup.
> - **TIER 3 — REGULAR STORIES**: Langsung ke sasaran fakta (*direct*), padat, menghibur, tanpa pembuka/penutup yang terlalu panjang.
> - **TIER 4 — QUICK HITS / FUN FACTS**: Format sangat singkat (1–2 kalimat), berupa *fun fact*, *one-liner*, *statistic highlight*, atau *news ticker*.

#### 7. Strict Restrictions (Batasan Ketat AI Writer)
> Anda DILARANG KERAS:
> - Mencari atau mengambil data/fakta baru di luar input yang diberikan.
> - Mengubah dokumen *Editorial Plan*, alokasi tier, atau *editorial angle* yang telah ditetapkan AI Editor.
> - Menghitung ulang atau memodifikasi statistik poin, rank, atau delta.
> - Mengarang fakta baru, kuotasi (*quote*) pernyataan palsu manager, atau kejadian pertandingan yang tidak tercantum di Fact Sheet.
> - Mengarang atau memakai memori historis di luar `Allowed Historical Context`.
> - Melakukan serangan personal, harassment, atau hinaan fisik/latar belakang manager.

#### 8. Required Output (`Article Draft`)
> Anda wajib mengembalikan dokumen terstruktur `Article Draft` yang berisi bidang-bidang berikut:
> - `article_id`: Identitas unik draf artikel.
> - `story_id`: ID rujukan kandidat/cluster cerita sumber.
> - `tier`: Alokasi tier penerbitan artikel (Tier 1 s/d Tier 4).
> - `headline`: Judul utama artikel berita yang dramatis dan menarik pembaca.
> - `subheadline`: Judul sekunder/rangkuman singkat ulasan berita.
> - `article_body`: Naskah tubuh artikel berita lengkap.
> - `key_facts_used`: Daftar fakta sah yang secara eksplisit disebutkan dalam naskah.
> - `historical_context_used`: Memori historis yang dimasukkan ke dalam naskah.
> - `trash_talk_level`: Tingkat bobot sentilan trashtalk (*Low / Medium / High*).
> - `fact_check_status`: Status verifikasi awal (`Pending Verification`).

#### 9. Output Rules
> Output wajib dikembalikan dalam bentuk objek terstruktur (JSON/Markdown terdefinisi) tanpa teks pembuka atau penutup tambahan, sehingga dapat secara otomatis dikirimkan langsung ke *Fact Check & Safety Gate* untuk proses validasi.

---

## 18. AI Fact Checker Prompt Design

Dokumen arsitektur konseptual instruksi prompt (*AI Fact Checker Prompt Design*) yang mendefinisikan kontrak instruksi pengujian bagi agen **AI Fact Checker**:

### Formulasi Prinsip Utama:

```
AI FACT CHECKER CONTROLS VALIDATION
```

---

### Rancangan Prompt Konseptual AI Fact Checker (9 Core Sections):

#### 1. Role & Mission
> Anda adalah **AI Chief Fact Checker & Safety Auditor** untuk Newsletter FPL Kino Indonesia. Misi utama Anda adalah menguji dan memvalidasi draf naskah artikel (**Article Draft**) yang disusun oleh AI Writer melampaui 4 layer validasi independen sebelum diizinkan terbit. Anda **BUKAN PENULIS** dan **DILARANG REWRITING/FIXING** naskah. Tugas Anda HANYA mendeteksi kesalahan dan mengembalikan dokumen **Fact Check Result** terstruktur.

#### 2. Source of Truth
> Aturan rujukan mutlak pengujian Anda:
> - `Verified Fact Sheet`: **Source of Truth Utama** mutlak untuk seluruh fakta statistik data mentah.
> - `Allowed Historical Context`: **Satu-satunya** konteks historis yang diizinkan untuk dipakai.
> - `Editorial Plan`: Rujukan resmi untuk memvalidasi kesesuaian sudut pandang, tier, dan instruksi penulisan.
> - `Editorial Safety Rules`: Aturan etika *office-safe* dan batas kesopanan trashtalk yang mengikat.

#### 3. Required Inputs
> Anda HANYA dapat menjalankan pengujian berdasarkan input terstruktur berikut:
> - `Article Draft` (Draf naskah artikel yang diuji dari AI Writer)
> - `Verified Fact Sheet` (Data fakta resmi terverifikasi dari sistem)
> - `Editorial Plan` (Dokumen rencana penyuntingan dari AI Editor)
> - `Allowed Historical Context` (Riwayat memori historis yang diizinkan)
> - `Editorial Safety Rules` (Aturan etika & trashtalk *office-safe*)

#### 4. Validation Responsibilities
> Tanggung jawab utama pengujian Anda meliputi:
> 1. Memeriksa ketepatan seluruh fakta data (angka poin, nama manager, rank, GW, nama pemain, kapten, transfer, chip, dan rekor historis).
> 2. Memeriksa bahwa memori historis yang digunakan naskah memang ada di dalam `Allowed Historical Context`.
> 3. Memeriksa bahwa humor & sentilan trashtalk tetap *office-safe* dan murni menyasar keputusan taktis, bukan personalitas manager.
> 4. Memeriksa kesesuaian naskah dengan `Editorial Plan`, alokasi tier, batas kata/kedalaman ulasan, keberadaan fakta wajib, dan instruksi penulisan.
> 5. Mengembalikan laporan pengujian terstruktur (`Fact Check Result`).

#### 5. Four Validation Layers (4 Layer Validasi)

##### A. Fact Validation (Validasi Ketepatan Data)
Periksa seluruh fakta data dalam naskah terhadap `Verified Fact Sheet`:
- Angka poin, nama manager, peringkat (*rank*), nomor Gameweek, nama pemain, kapten & vice-captain, transfer masuk/keluar, chip aktif, dan rekor historis.
- *Aturan*: Dilarang ada fakta tambahan, angka rekaan, atau modifikasi statistik sekecil apa pun.

##### B. Context Validation (Validasi Konteks Historis)
Periksa bahwa penggunaan memori historis dalam naskah memang terdaftar di dalam `Allowed Historical Context`:
- Dilarang ada penggunaan klaim riwayat yang tidak disuplai oleh sistem.
- Dilarang salah menyambungkan alur *storyline* atau mengklaim opini sebagai fakta historis data mentah.

##### C. Editorial Safety Validation (Validasi Keamanan Editorial & Etika)
Periksa bahwa humor dan sentilan trashtalk 100% *office-safe*:
- Sentilan wajib murni menyasar keputusan taktis (*tactical decisions*) atau hasil poin, BUKAN menyerang personalitas, fisik, pekerjaan, atau latar belakang pribadi manager.
- Bebas dari segala bentuk *harassment*, bullying, atau hinaan pribadi (*personal insult*).
- Dilarang ada rekayasa kuotasi palsu (*fabricated quotes*) manager.

##### D. Output Validation (Validasi Struktur & Tier)
Periksa kesesuaian naskah dengan `Editorial Plan`:
- Sudut pandang berita (*editorial angle*) tetap konsisten dengan Editorial Plan.
- Alokasi tier sesuai dengan rencana publikasi.
- Panjang dan kedalaman ulasan (*length & depth*) proporsional dengan tier.
- Seluruh *key_facts_that_must_be_included* hadir dan dapat dipetakan 1-to-1 ke Fact Sheet.

#### 6. Decision Rules (Aturan Keputusan Validasi)
Anda wajib menetapkan salah satu dari 3 status keputusan resmi:
- **PASS**: Naskah lolos 100% dari 4 layer validasi tanpa cacat fakta, context, safety, atau output. Siap dipublikasikan ke Newsletter Issue.
- **REVISION REQUIRED**: Naskah memiliki kesalahan minor (misal: typo angka poin, penggunaan kata trashtalk terlalu tajam, atau fakta wajib terlewat) yang dapat diperbaiki oleh AI Writer via *Revision Loop*.
- **REJECTED**: Naskah mengalami pelanggaran fatal (misal: rekayasa fakta besar, penghinaan personal, atau *factual mismatch* parah) sehingga artikel dibatalkan dari terbitan.

#### 7. Strict Restrictions (Batasan Ketat AI Fact Checker)
Anda DILARANG KERAS:
- Menulis draf naskah artikel berita baru atau membetulkan/menulis ulang (*rewrite*) naskah yang diuji.
- Mengarang, mereka-reka, atau mengubah data fakta (*source data*).
- Mencari data mentah baru di luar input terstruktur yang disajikan.
- Meloloskan (`PASS`) naskah yang mengandung kesalahan fakta data atau pelanggaran batas etika *office-safe*.

#### 8. Required Output (`Fact Check Result`)
Anda wajib mengembalikan dokumen terstruktur `Fact Check Result` yang berisi bidang-bidang berikut:
- `article_id`: Identitas unik naskah artikel yang diuji.
- `validation_status`: Status keputusan validasi (`PASS`, `REVISION REQUIRED`, `REJECTED`).
- `overall_result`: Ringkasan ringkas hasil pengujian validasi.
- `failed_validation_layers`: Daftar layer validasi yang mendeteksi kesalahan (jika ada).
- `detected_issues`: Deskripsi detail temuan masalah fakta, context, safety, atau output.
- `related_facts_or_rules`: Rujukan fakta resmi Fact Sheet atau aturan safety yang dilanggar.
- `required_corrections`: Catatan instruksi perbaikan spesifik bagi AI Writer untuk revisi.
- `recheck_required`: Flag penanda bahwa pengujian ulang wajib dilakukan setelah revisi (`TRUE / FALSE`).

#### 9. Output Rules
Output wajib dikembalikan dalam bentuk objek terstruktur (JSON/Markdown terdefinisi) tanpa teks pembuka atau penutup tambahan, sehingga dapat secara otomatis diproses oleh sistem untuk menentukan alur penerbitan atau siklus revisi.

---

## 19. Newsletter Editorial Workflow

Alur kerja jurnalistik AI dari input data hingga terbit sebagai Newsletter Issue multi-artikel:

1. **Phase 1: Story Detection & Memory Context Query**: Engine menganalisis SQL database, mendeteksi *Story Candidates*, dan menarik *Historical Memory Context* yang relevan.
2. **Phase 2: Objective System Scoring & Priority**: System (Layer 1) menghitung 6 dimensi skor, melakukan normalisasi, *clustering*, memfilter duplikasi/diversitas, dan menghasilkan *Recommended System Priority*.
3. **Phase 3: AI Editorial Review & Editorial Plan**: AI Editor (Layer 2) mengevaluasi kekuatan narasi cerita berdasar konteks memory, menentukan *final tier assignment*, memilih *Headline*, dan menghasilkan dokumen *Editorial Plan*.
4. **Phase 4: Multi-Article Generation by AI Writer**: *AI Writer* menggenerasi naskah berita terpisah per artikel (Tier 1, Tier 2, Tier 3) serta rangkuman *Quick Hits* (Tier 4) berdasarkan Editorial Plan.
5. **Phase 5: Fact Check Validation & Publishing**: Sistem *Fact Check & Safety Gate* (AI Fact Checker) menguji seluruh 4 layer validasi (Fact, Context, Safety, Output). Setelah berstatus **PASS 100%**, seluruh artikel dipublikasikan bersamaan dalam 1 *Newsletter Issue*.

---

## 20. Final Newsletter System Architecture

Bagian ini menyajikan **Master Architecture Flow End-to-End** yang konsolidasi dan berfungsi sebagai *single source of truth* mutlak untuk seluruh alur kerja sistem Newsletter FPL Kino Hub dari data mentah hingga publikasi *Newsletter Issue*.

### End-to-End Master Pipeline Diagram:

```
┌─────────────────────────────────────────────────────────┐
│                      FPL DATABASE                       │
│      (Data mentah Gameweek, picks, transfers, stats)    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Analysis Engine                   │
│         (Agregasi statistik & kalkulasi metric)         │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Story Detection Engine                  │
│       (27 Rule-based detectors ──► Story Candidates)     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Objective System Scoring                  │
│  (Evaluasi 6 dimensi: Impact, Rarity, Drama, History,   │
│               Rivalry, Entertainment)                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ Score Normalization & Story Clustering / Filtering     │
│   (Normalisasi skor, pengelompokan cluster, eliminasi   │
│   duplikasi, & penegakan Hard Diversity Constraints)    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│              League Memory & Storyline Context          │
│   (Penarikan konteks historis selektif & riwayat GW     │
│  sebelumnya ──► Relevant Context, Bukan Raw Dump)       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│        LAYER 1 — SYSTEM PRIORITY & RECOMMENDED TIER     │
│    (Rekomendasi prioritas & Fact Sheet terverifikasi)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 2 — AI EDITOR (EDITORIAL REVIEW)        │
│   (Evaluasi narasi, penentuan final angle, tone, title, │
│        & final tier ──► Menghasilkan EDITORIAL PLAN)    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                      AI WRITER                          │
│   (Mengubah Editorial Plan & Facts ──► ARTICLE DRAFT)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│              AI FACT CHECKER & SAFETY GATE              │
│       (Pengujian 4 layer validasi: Fact, Context,       │
│                  Safety, & Output)                      │
└──────────────┬─────────────┬──────────────┬─────────────┘
               │             │              │
               ▼             ▼              ▼
           ┌──────┐  ┌──────────────┐  ┌──────────┐
           │ PASS │  │   REVISION   │  │ REJECTED │
           └──┬───┘  │   REQUIRED   │  └────┬─────┘
              │      └──────┬───────┘       │
              │             │               │
              │             ▼               │
              │     ┌───────────────┐       │
              │     │ Revision Loop │       │
              │     │  (AI Writer)  │       │
              │     └───────┬───────┘       │
              │             │ (Recheck)     │
              │             ▼               │
              │     ┌───────────────┐       │
              │     │ AI FactCheck  │       │
              │     └───────────────┘       │
              ▼                             ▼
┌───────────────────────────┐    ┌────────────────────┐
│     NEWSLETTER ISSUE      │    │ DISCARDED /        │
│   (Terbit Multi-Artikel)  │    │ ARCHIVED           │
└───────────────────────────┘    └────────────────────┘
```

---

### Konsolidasi Pilar Utama & Pembagian Tanggung Jawab:

1. **SYSTEM CONTROLS FACTS & STRUCTURED DATA**:
   - Sistem data (SQL + Detectors + Scoring Engine + Memory Query) adalah **Single Source of Truth** mutlak untuk seluruh data statistik, agregasi, fakta kejadian, dan konteks historis.
   - *System Story Scoring* bersifat 100% objektif dan deterministik sebelum dilakukan *AI Editorial Review*.
   - *League Memory Engine* HANYA menyalurkan *relevant context* yang terpilih, BUKAN *raw historical data dump*.
   - *Previous Newsletter Context* HANYA digunakan untuk kepentingan *continuation*, *follow-up*, dan *closure* narasi edisi terdahulu.

2. **AI EDITOR CONTROLS EDITORIAL DIRECTION**:
   - AI Editor HANYA bertugas menentukan *editorial direction* (*editorial angle*, *narrative theme*, *tone*, *title direction*, dan *Final Tier Assignment*).
   - Penentuan final tier wajib mematuhi aturan editorial (*editorial rules*) dan *hard diversity constraints* yang ditetapkan sistem.
   - AI Editor DILARANG KERAS mencari data baru, mengarang fakta/statistik, atau menulis draf naskah artikel final. Output-nya adalah **Editorial Plan**.

3. **AI WRITER CONTROLS NARRATIVE EXPRESSION**:
   - AI Writer HANYA bertugas mengontrol *narrative expression* (pengemasan kalimat, *opening hook*, kelancaran bahasa jurnalistik, dan sentilan trashtalk *office-safe*).
   - AI Writer wajib mengikuti 100% petunjuk di **Editorial Plan** dan **Verified Fact Sheet**.
   - AI Writer DILARANG KERAS mencari fakta baru, menghitung ulang statistik, mengubah tier/angle, atau mengarang kuotasi/kejadian/history. Output-nya adalah **Article Draft**.

4. **AI FACT CHECKER CONTROLS VALIDATION**:
   - AI Fact Checker HANYA bertugas mengontrol *validation auditor* melampaui 4 layer validasi (Fact, Context, Safety, Output).
   - AI Fact Checker DILARANG KERAS menulis atau memperbaiki naskah artikel (*no rewriting/fixing*). Output-nya adalah **Fact Check Result**.

5. **RULES HAK TERBIT & PENANGANAN STATUS (Publication Gate Rules)**:
   - **PASS**: Artikel diizinkan secara resmi masuk ke dalam publikasi *Newsletter Issue*.
   - **REVISION REQUIRED**: Artikel **DILARANG** terbit dan wajib kembali ke AI Writer melalui **Revision Loop** untuk perbaikan, lalu di-recheck ulang oleh AI Fact Checker.
   - **REJECTED**: Artikel **DILARANG KERAS** masuk ke dalam *publication flow* dan secara permanen dibuang/dearsipkan (*discarded/archived*). Tidak ada artikel yang boleh diterbitkan tanpa berstatus terverifikasi **PASS**.

---

## 21. Newsletter Database Architecture — Conceptual Design

Section ini mendefinisikan kebutuhan perancangan persistensi data (*data persistence architecture*) secara konseptual untuk mendukung seluruh alur kerja sistem pada *Final Newsletter System Architecture*.

### Formulasi Prinsip Utama Persistensi:

```
┌─────────────────────────────────────────────────────────┐
│                 EXISTING FPL TABLES                     │
│    (Single Source of Truth mutlak untuk data mentah)    │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                 NEWSLETTER TABLES                       │
│ (Data turunan: editorial, memory, validation, & issue)  │
└─────────────────────────────────────────────────────────┘
```

---

### Detail 10 Kebutuhan Konseptual Data Architecture:

#### 1. Story Processing Layer
Layer ini mengelola pemrosesan kandidat cerita hasil pemindaian detector hingga siap direkomendasikan ke Layer 1 System Priority.
- **Story Candidates**: Menyimpan metadata kandidat cerita terdeteksi (`detector_id`, `gw_number`, `manager_id`, `fact_sheet_json`). Disimpan untuk audit dan rujukan historis.
- **Story Clusters**: Menyimpan pengelompokan kandidat cerita yang melibatkan manager/topik yang sama (`cluster_id`, `primary_candidate_id`, `grouped_candidates_json`). Disimpan sebagai unit analisis AI Editor.
- **Story Scores / System Priority**: Menyimpan hasil perhitungan 6 dimensi skor objektif (`impact_score`, `rarity_score`, `drama_score`, `history_score`, `rivalry_score`, `entertainment_score`, `normalized_total_score`). Disimpan untuk kebutuhan pengurutan dan audit.
- **Detection Metadata & Processing Status**: Status pemrosesan kandidat cerita (`DETECTED`, `CLUSTERED`, `PRIORITIZED`, `SELECTED_FOR_PLAN`, `NOT_SELECTED`).
- **Pemisahan Persistence vs Temporary**:
  - *Disimpan Permanen*: Metadata kandidat cerita, Fact Sheet JSON, hasil clustering, skor 6 dimensi, dan status akhir.
  - *Computed / Temporary*: Variabel kalkulasi intermediat saat algoritma berjalan (seperti Z-score temporary) cukup berada di memori aplikasi saat eksekusi.

#### 2. League Memory Layer
Layer ini mengelola rekam jejak memori berkelanjutan liga untuk memberikan konteks narasi tanpa mengotori data fakta mentah.
- **Manager Profile Memory**: Profil historis manajerial (gaya taktis, kecenderungan hit, rekor rata-rata). Disimpan.
- **Performance History Memory**: Tren performa (rank movement 5 GW terakhir, streak di atas rata-rata liga). Disimpan.
- **Rivalry Memory**: Riwayat pertarungan head-to-head dan margin selisih poin antar-manager bertetangga. Disimpan.
- **League Record Memory**: Rekor all-time liga (skor terbanyak, poin bench tertinggi). Disimpan.
- **Recurring Storyline Memory**: Melacak siklus hidup alur cerita (`storyline_id`, `title`, `manager_ids`, `status`: `ACTIVE`, `ESCALATING`, `RESOLVED`, `ARCHIVED`). Disimpan.
- **Previous Newsletter Context**: Ringkasan cerita dari edisi terbitan terdahulu (`issue_id`, `summary_json`). Disimpan.
- **Pembedaan Tegas 4 Kategori Data Memory**:
  1. *Verified Historical Memory*: Data fakta historis murni yang dapat ditelusuri 100% kembali ke tabel FPL mentah (`fpl_gameweeks`, `manager_gameweek_stats`).
  2. *AI Editorial Interpretation*: Interpretasi naratif dan sudut pandang yang diberikan oleh AI Editor/Writer pada edisi sebelumnya.
  3. *Active Storyline*: Alur cerita yang sedang berjalan dan berlanjut di musim berjalan.
  4. *Archived Storyline*: Alur cerita yang sudah selesai (*resolved*) dan disimpan sebagai arsip historis.

#### 3. Editorial Processing Layer
Layer ini menyimpan rancangan kerja editorial (*Editorial Plan*) yang dihasilkan oleh AI Editor.
- **Editorial Plan Entity**: Menyimpan dokumen instruksi penyuntingan terstruktur (`editorial_plan_id`, `story_cluster_id`, `final_editorial_angle`, `narrative_theme`, `assigned_tier`, `tone`, `title_direction`, `key_facts_required_json`, `writing_instructions_text`).
- **Final Tier Assignment**: Alokasi tier final yang disetujui AI Editor (Tier 1 s/d Tier 4).
- **Editorial Decision Metadata**: Catatan justifikasi AI Editor mengenai alasan pemilihan angle dan penetapan tier.
- **Strict Boundary**: Dokumen `Editorial Plan` HANYA berisi petunjuk editorial dan rujukan ID fakta, BUKAN data fakta mentah baru. AI Editor tidak pernah menjadi *source of truth* fakta.

#### 4. Article Processing Layer
Layer ini mengelola draf naskah artikel berita yang dihasilkan oleh AI Writer beserta riwayat versi/revisinya.
- **Article Entity**: Menyimpan naskah artikel berita (`article_id`, `editorial_plan_id`, `tier`, `headline`, `subheadline`, `article_body`, `key_facts_used_json`, `trash_talk_level`, `version`, `readiness_status`).
- **Handling Versioning & Revision**:
  - *Rekomendasi Arsitektur*: Cukup menggunakan **1 entity `articles`** yang dilengkapi bidang `version` (misal: v1, v2) dan `readiness_status` (`DRAFT`, `REVISION_REQUIRED`, `APPROVED_PASS`, `REJECTED`). Tidak perlu membuat tabel terpisah antara draf dan revisi untuk menghindari over-engineering.

#### 5. Validation Layer
Layer ini menyimpan laporan pengujian validasi independen yang dilakukan oleh AI Fact Checker.
- **Fact Check Result Entity**: Menyimpan laporan hasil audit 4 layer (`fact_check_id`, `article_id`, `version_tested`, `validation_status`: `PASS` / `REVISION_REQUIRED` / `REJECTED`, `failed_layers_json`, `detected_issues_json`, `required_corrections_text`, `tested_at`).
- **Recheck History**: Setiap kali naskah hasil revisi diajukan ulang, rekam pengujian baru dicatat dengan mereferensikan `version_tested`.
- **Publication Gate Rule**: Sistem database menegaskan aturan bahwa HANYA artikel dengan `validation_status = 'PASS'` yang diizinkan berelasi dengan publikasi `newsletter_issues`.

#### 6. Publication Layer
Layer ini mengelola edisi publikasi *Newsletter Issue* terbitan yang menampilkan multi-artikel kepada pengguna akhir.
- **Newsletter Issue Entity**: Menyimpan metadata edisi terbitan (`issue_id`, `gw_number`, `issue_title`, `published_at`, `publication_status`: `DRAFT`, `PUBLISHED`, `ARCHIVED`).
- **Issue Articles Relationship**: Tabel penghubung relasi multi-artikel (`issue_id`, `article_id`, `display_order`, `display_tier`: Tier 1 Hero, Tier 2 Featured, Tier 3 Regular, Tier 4 Quick Hits).
- **Multi-Article Support**: Satu `Newsletter Issue` mendukung publikasi **banyak artikel sekaligus** dari Tier 1 hingga Tier 4 dalam 1 Gameweek.

#### 7. Data Relationships (Conceptual Flow)

```
┌─────────────────┐
│ FPL SOURCE DATA │ ── (Extracted by Detectors)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ STORY CANDIDATE │ ── (Scored & Clustered by System)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  STORY CLUSTER  │ ── (Reviewed by AI Editor)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ EDITORIAL PLAN  │ ── (Drafted by AI Writer)
└────────┬────────┘
         │
         ▼
┌─────────────────┐      (Validation Failed)     ┌──────────────┐
│  ARTICLE DRAFT  │ ───────────────────────────► │ REVISED DRAFT│
└────────┬────────┘                              └──────┬───────┘
         │                                              │
         ▼                                              │ (Re-tested)
┌─────────────────┐                                     │
│   FACT CHECK    │ ◄───────────────────────────────────┘
└────────┬────────┘
         │ (Status = PASS 100%)
         ▼
┌─────────────────┐
│NEWSLETTER ISSUE │ ── (Multi-Article Issue Published)
└─────────────────┘
```

##### Detail Relasi Entitas:
- 1 `Gameweek` ── (memiliki banyak) ──► `Story Candidates`
- Many `Story Candidates` ── (dikelompokkan ke) ──► 1 `Story Cluster`
- 1 `Story Cluster` ── (menghasilkan) ──► 1 `Editorial Plan`
- 1 `Editorial Plan` ── (ditulis menjadi) ──► 1 `Article` (dengan riwayat versi)
- 1 `Article` ── (diuji oleh) ──► 1 atau lebih `Fact Check Results`
- 1 `Newsletter Issue` ── (berisi banyak) ──► `Articles` (Order & Tier Placement)
- `League Memory` & `Storyline` ── (memberikan konteks ke) ──► `Story Cluster` & `Editorial Plan`

#### 8. Lifecycle & Status Model

Sistem menetapkan status konseptual yang padat dan jelas untuk setiap entitas utama:

1. **Story Candidate Status**: `DETECTED` ──► `CLUSTERED` ──► `SELECTED` / `NOT_SELECTED`
2. **Editorial Plan Status**: `DRAFTED` ──► `APPROVED_FOR_WRITING`
3. **Article Status**: `DRAFT` ──► `UNDER_VALIDATION` ──► `REVISION_REQUIRED` ──► `PASS_APPROVED` / `REJECTED`
4. **Validation Status**: `PASS` | `REVISION_REQUIRED` | `REJECTED`
5. **Newsletter Issue Status**: `PREPARING` ──► `PUBLISHED` ──► `ARCHIVED`
6. **Storyline Status**: `CREATED` ──► `ACTIVE` ──► `ESCALATING` ──► `RESOLVED` ──► `ARCHIVED`

#### 9. Storage Principles (Aturan Persistensi Data)

1. **No Duplicate Raw Facts**: Dilarang menduplikasi data mentah FPL (seperti poin pemain atau susunan lineup) jika data tersebut dapat direferensikan via Foreign Key ke tabel FPL mentah (`fpl_players`, `manager_gameweek_picks`).
2. **Justified Derived Storage**: Data turunan (*derived data*) HANYA disimpan jika dibutuhkan untuk kepentingan audit, kontinuitas historis, siklus revisi, penerbitan, atau optimasi performa *query* frontend.
3. **Traceability Guarantee**: Setiap artikel yang diterbitkan wajib memiliki relasi ID yang dapat ditelusuri kembali 1-to-1 ke `story_cluster_id`, `editorial_plan_id`, dan `fact_sheet_json` sumber.
4. **Explicit Fact vs Interpretation Distinction**: Kolom data yang berisi fakta terverifikasi wajib dipisahkan secara tegas dari kolom yang berisi interpretasi naratif AI.
5. **Revision Loop Support**: Struktur entitas wajib mendukung pencatatan versi naskah dan riwayat validasi berulang tanpa merusak data versi terdahulu.
6. **Multi-Article Issue Support**: Struktur tabel publikasi wajib mendukung relasi *one-to-many* dari 1 edisi Newsletter Issue ke banyak artikel berjenjang (Tier 1 s/d Tier 4).
7. **Lean & Pragmatic Design**: Hindari *over-engineering* tabel berlebihan. Gabungkan entitas draf dan revisi ke dalam 1 tabel artikel berbasis kolom versi/status.

#### 10. Final Conceptual Data Model Recommendations

Berdasarkan analisis arsitektur, berikut adalah rekomendasi pengelompokan entitas persistensi:

##### A. Core Entities (Wajib Ada):
1. `newsletter_issues` (Metadata edisi terbitan mingguan)
2. `newsletter_articles` (Naskah artikel berita, status, versi, tier, body, & placement)
3. `newsletter_editorial_plans` (Rancangan instruksi penyuntingan dari AI Editor)
4. `newsletter_story_clusters` (Pengelompokan kandidat cerita & Fact Sheet JSON terverifikasi)
5. `newsletter_fact_checks` (Laporan hasil audit 4 layer dari AI Fact Checker)
6. `newsletter_storylines` (Pelacak alur cerita berkelanjutan liga & siklus hidupnya)

##### B. Optional Entities (Dapat Digabung):
- `newsletter_story_candidates`: Dapat digabungkan secara langsung ke dalam `newsletter_story_clusters` sebagai array JSON kandidat pemicu, kecuali jika dibutuhkan query analitis detector secara terpisah.
- `newsletter_issue_articles`: Tabel junction relasi urutan artikel edisi terbitan (dapat disederhanakan dengan memasukkan `issue_id` dan `display_order` langsung di `newsletter_articles`).

##### C. Non-Persistent Data (Cukup Temporary Memory):
- Variabel kalkulasi intermediat Z-score atau normalisasi temporary.
- Raw API response payload yang tidak terpakai dalam Fact Sheet.
- Draf teks mentah saat proses streaming tulisan AI Writer.

##### D. Anti Over-Engineering Consolidation:
- **Draf & Revisi Artikel**: Diberdayakan dalam 1 tabel `newsletter_articles` menggunakan kolom `version` dan `readiness_status`.
- **Memori Liga**: Memori historis ringkas (`Manager Profile`, `Performance History`) disajikan melalui query SQL agregasi dinamis ke tabel FPL mentah, sedangkan yang disimpan permanen hanyalah `newsletter_storylines` dan `Previous Newsletter Context`.

---

## 22. Final Core Newsletter Entities & Lifecycle

Bagian ini mengunci secara mendalam 7 entitas utama (*7 Core Newsletter Entities*) yang mendasari arsitektur sistem Newsletter FPL Kino Hub sebelum tabel database fisik diimplementasikan:

---

### Detail 7 Core Newsletter Entities:

#### 1. `newsletter_story_candidates`
- **Purpose**: Menyimpan rekam jejak setiap peristiwa menarik yang berhasil terdeteksi oleh 27 detector pemicu pada Gameweek berjalan. Entitas ini menyelesaikan kebutuhan audit, histori pemicu detector, serta menyediakan *Verified Fact Sheet* independen per kandidat cerita.
- **What It Stores**: Metadata kandidat cerita (`detector_id`, `category`, `gw_number`, `manager_id`), hasil ekstraksi *Verified Fact Sheet JSON* (poin, pemain, rank, delta), skor prioritas sistem Layer 1, serta status pemrosesan kandidat.
- **Source References**: Diekstrak langsung dari `FPL Database` mentah (`fpl_gameweeks`, `manager_gameweek_stats`, `manager_gameweek_picks`, `manager_transfers`, `fpl_players`).
- **Created When**: Dibuat secara otomatis oleh **Story Detection Engine** segera setelah data Gameweek selesai dipindai.
- **Updated When**: Diperbarui pada tahap *Story Scoring Engine* untuk menyuntikkan *Objective Dimension Scores* dan *Normalized Score*.
- **Consumed By**: Digunakan oleh *Story Clustering Engine*, *Duplicate & Diversity Filter*, dan disajikan ke AI Editor sebagai bagian dari *Fact Sheet*.
- **Lifecycle**: `DETECTED` ──► `SCORED` ──► `CLUSTERED` ──► `SELECTED` / `NOT_SELECTED`
- **Immutability Rules**: *Verified Fact Sheet JSON* dan metadata detector menjadi **final & immutable** setelah status berubah menjadi `CLUSTERED`. Data fakta tidak boleh diubah oleh tahap selanjutnya.

#### 2. `newsletter_story_clusters`
- **Purpose**: Menghubungkan beberapa *Story Candidate* yang memiliki irisan narasi atau melibatkan manager/peristiwa yang sama menjadi satu unit cerita terpadu. Entitas ini menyelesaikan masalah fragmentasi cerita tanpa menduplikasi data fakta mentah.
- **What It Stores**: Identitas cluster (`cluster_id`, `primary_candidate_id`), himpunan kandidat beririsan (array ID candidates), gabungan *Verified Fact Sheet JSON*, total *System Priority Score*, dan rekomendasi tier awal (*Recommended Tier*).
- **Source References**: Berelasi langsung dengan 1 atau lebih entitas `newsletter_story_candidates`.
- **Created When**: Dibuat oleh **Story Clustering Engine** setelah tahap scoring dan eliminasi duplikasi selektif.
- **Updated When**: Diperbarui saat status pemrosesan berubah (misal: saat disetujui atau diabaikan oleh filter diversitas).
- **Consumed By**: Digunakan langsung oleh **AI Editor** (Layer 2) sebagai unit input utama untuk menyusun dokumen *Editorial Plan*.
- **Lifecycle**: `CREATED` ──► `PRIORITIZED` ──► `SELECTED_FOR_PLAN` / `NOT_SELECTED`
- **Immutability Rules**: Bersifat **immutable** begitu disetujui oleh AI Editor dan diikat oleh dokumen `newsletter_editorial_plans`.

#### 3. `newsletter_storylines`
- **Purpose**: Menyimpan dan melacak alur cerita berkelanjutan liga (*recurring storylines*) yang membentang lintas-Gameweek. Entitas ini memberikan kontinuitas historis liga sehingga edisi Newsletter tidak diperlakukan secara terisolasi.
- **What It Stores**: Judul storyline, daftar manager terlibat, status siklus hidup alur cerita, rekam jejak Gameweek pemicu, *Verified Historical Context JSON* (fakta sah), dan *AI Editorial Interpretation JSON* (sudut pandang naratif terdahulu).
- **Source References**: Berelasi dengan `newsletter_story_clusters`, `newsletter_issues`, dan data historis FPL.
- **Created When**: Dibuat saat pemicu *storyline* baru terdeteksi oleh *League Memory Engine* atau diinisiasi oleh keputusan AI Editor.
- **Updated When**: Diperbarui di setiap Gameweek baru saat ketegangan meningkat (*ESCALATING*), berlanjut (*CONTINUING*), atau selesai (*RESOLVED*).
- **Consumed By**: Digunakan oleh **League Memory Engine** untuk menyuplai *Relevant Historical Context* kepada AI Editor dan AI Writer.
- **Lifecycle**: `CREATED` ──► `ACTIVE` ──► `ESCALATING` ──► `RESOLVED` ──► `ARCHIVED`
- **Immutability Rules**: *Verified Historical Context* yang sudah tercatat bersifat **immutable**, sedangkan status siklus hidup (*lifecycle status*) dan interpretasi naratif dapat terus berkembang.

#### 4. `newsletter_editorial_plans`
- **Purpose**: Menyimpan rancangan instruksi dan batasan penulisan terstruktur yang dihasilkan oleh AI Editor. Entitas ini mengunci *editorial direction* sebelum AI Writer mulai menyusun naskah.
- **What It Stores**: Sudut pandang berita utama (*final_editorial_angle*), tema narasi, *Final Tier Assignment* (Tier 1 s/d Tier 4), *tone*, *title direction*, daftar fakta wajib (*key_facts_required_json*), konteks historis yang diizinkan (*allowed_historical_context_json*), dan instruksi khusus untuk AI Writer.
- **Source References**: Berelasi 1-to-1 dengan `newsletter_story_clusters` dan merujuk pada `newsletter_storylines` yang relevan.
- **Created When**: Dibuat oleh **AI Editor** (Layer 2) setelah meninjau kandidat cerita dan rekomendasi prioritas sistem.
- **Updated When**: Diperbarui jika AI Editor melakukan penyesuaian instruksi sebelum tahap penulisan dimulai.
- **Consumed By**: Digunakan secara mutlak oleh **AI Writer** sebagai panduan penulisan naskah dan oleh **AI Fact Checker** untuk menguji kesesuaian output.
- **Lifecycle**: `DRAFTED` ──► `APPROVED_FOR_WRITING`
- **Immutability Rules**: Berstatus **final & immutable** setelah disetujui (`APPROVED_FOR_WRITING`). AI Writer maupun AI Fact Checker DILARANG KERAS mengubah dokumen ini.

#### 5. `newsletter_articles`
- **Purpose**: Menyimpan naskah draf dan terbitan artikel berita yang disusun oleh AI Writer beserta riwayat versi/revisinya. Entitas ini memfasilitasi siklus revisi (*Revision Loop*) dalam 1 struktur tanpa membuat tabel draf/revisi terpisah.
- **What It Stores**: Judul (*headline*), subjudul, naskah tubuh artikel (*article_body*), alokasi tier, daftar fakta yang digunakan (*key_facts_used_json*), memori historis yang digunakan (*historical_context_used_json*), tingkat trashtalk (*trash_talk_level*), nomor versi (`version`), dan status kesiapan publikasi (`readiness_status`).
- **Source References**: Berelasi dengan `newsletter_editorial_plans` dan secara opsional berelasi dengan `newsletter_issues`.
- **Created When**: Dibuat oleh **AI Writer** saat menggenerasi naskah artikel versi pertama (`v1`).
- **Updated When**: Diperbarui versi naskahnya (`v2`, `v3`) oleh **AI Writer** ketika menerima instruksi perbaikan dari *Fact Check Safety Gate*. Statusnya diperbarui menjadi `APPROVED_PASS` setelah lolos validasi.
- **Consumed By**: Digunakan oleh **AI Fact Checker** untuk diuji dan oleh **Frontend Web App** untuk ditampilkan dalam edisi Newsletter Issue.
- **Lifecycle**: `DRAFT` ──► `UNDER_VALIDATION` ──► `REVISION_REQUIRED` ──► `APPROVED_PASS` / `REJECTED`
- **Immutability Rules**: Berstatus **final & immutable** begitu naskah artikel berstatus `APPROVED_PASS` dan dipublikasikan ke dalam `newsletter_issues`.

#### 6. `newsletter_fact_checks`
- **Purpose**: Menyimpan rekam jejak laporan pengujian validasi independen yang dilakukan oleh AI Fact Checker untuk setiap iterasi naskah artikel. Entitas ini menjamin akuntabilitas audit dan transparansi siklus revisi.
- **What It Stores**: Status validasi (`PASS`, `REVISION_REQUIRED`, `REJECTED`), ringkasan hasil pengujian, daftar layer validasi yang gagal (*failed_layers_json*), temuan kesalahan (*detected_issues_json*), instruksi perbaikan (*required_corrections_text*), dan nomor versi naskah yang diuji (`version_tested`).
- **Source References**: Berelasi langsung dengan `newsletter_articles` dan merujuk pada `newsletter_editorial_plans`.
- **Created When**: Dibuat secara otomatis oleh **AI Fact Checker** setiap kali pengujian 4 layer selesai dijalankan atas suatu versi naskah artikel.
- **Updated When**: Entitas ini bersifat *append-only* (laporan baru dicatat per iterasi pengujian) dan tidak diperbarui setelah dicatat.
- **Consumed By**: Digunakan oleh **AI Writer** (saat butuh instruksi revisi) dan oleh **System Workflow** untuk menentukan apakah artikel berlanjut ke publikasi atau revisi.
- **Lifecycle**: `RECORDED` (Laporan pengujian langsung bersifat final setelah dicatat).
- **Immutability Rules**: Berstatus **100% immutable** sejak awal dicatat untuk menjaga keabsahan rekam jejak audit (*audit trail*).

#### 7. `newsletter_issues`
- **Purpose**: Merepresentasikan satu edisi majalah digital *Newsletter Issue* terpublikasi untuk Gameweek tertentu. Entitas ini mengelompokkan multi-artikel dari Tier 1 hingga Tier 4 secara teratur bagi pengguna akhir.
- **What It Stores**: Metadata edisi terbitan (`issue_id`, `gw_number`, `issue_title`, `published_at`, `publication_status`), daftar artikel terpublikasi beserta urutan tampilan (*article_placement_json* atau relasi junction), dan ringkasan edisi.
- **Source References**: Berelasi dengan `fpl_gameweeks` dan menyatukan banyak entitas `newsletter_articles` berstatus `APPROVED_PASS`.
- **Created When**: Dibuat oleh sistem publikasi saat persiapan penerbitan edisi Gameweek dimulai.
- **Updated When**: Diperbarui statusnya dari `PREPARING` menjadi `PUBLISHED` setelah seluruh artikel terpilih berstatus `APPROVED_PASS`.
- **Consumed By**: Digunakan langsung oleh **Frontend Web App** untuk menampilkan halaman Newsletter edisi mingguan kepada pengguna.
- **Lifecycle**: `PREPARING` ──► `PUBLISHED` ──► `ARCHIVED`
- **Immutability Rules**: Berstatus **final & immutable** setelah diterbitkan (`PUBLISHED`). Artikel di dalam edisi terbitan tidak boleh diubah tanpa proses re-publish resmi.

---

## Final Entity Relationship Map

Master Relationship Flow yang menghubungkan seluruh 7 entitas dari data mentah FPL hingga terbitan Newsletter Issue:

```
┌─────────────────┐
│ FPL SOURCE DATA │ ── (Extracted by Story Detection Engine)
└────────┬────────┘
         │
         ▼
┌────────────────────────────────┐
│ newsletter_story_candidates   │ ── (Scored & Clustered by System)
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│   newsletter_story_clusters    │ ── (Enriched with Memory Context)
└────────┬───────────────────────┘
         │
         ├────────────────────────────────────────┐
         │                                        │
         ▼                                        ▼
┌────────────────────────────────┐       ┌─────────────────────────┐
│ newsletter_editorial_plans     │       │  newsletter_storylines  │
└────────┬───────────────────────┘       └─────────────────────────┘
         │
         ▼
┌────────────────────────────────┐       (Validation Failed)      ┌─────────────────────────┐
│      newsletter_articles       │ ─────────────────────────────► │ REVISION LOOP           │
└────────┬───────────────────────┘                                │ (AI Writer Fix Draft)   │
         │                                                        └──────────┬──────────────┘
         │                                                                   │
         ▼                                                                   │ (Re-tested)
┌────────────────────────────────┐                                           │
│    newsletter_fact_checks      │ ◄─────────────────────────────────────────┘
└────────┬───────────────────────┘
         │ (Validation Status = PASS)
         ▼
┌────────────────────────────────┐
│      newsletter_issues         │ ── (Multi-Article Issue Published)
└────────────────────────────────┘
```

### Arah Data & Relasi Antar Entity:

1. `FPL SOURCE DATA` ──► `newsletter_story_candidates`: Data mentah SQL dipindai oleh 27 detector untuk menghasilkan fakta kandidat cerita terverifikasi (*Fact Sheet*).
2. `newsletter_story_candidates` ──► `newsletter_story_clusters`: Kandidat-kandidat cerita beririsan dikelompokkan oleh sistem menjadi satu unit *Story Cluster*.
3. `newsletter_story_clusters` + `newsletter_storylines` ──► `newsletter_editorial_plans`: *Story Cluster* yang dikaya konteks memori historis disetujui oleh AI Editor untuk menjadi rencana kerja *Editorial Plan*.
4. `newsletter_editorial_plans` ──► `newsletter_articles`: AI Writer menyusun draf naskah artikel berita (`newsletter_articles`) berdasarkan instruksi di Editorial Plan.
5. `newsletter_articles` ──► `newsletter_fact_checks`: Naskah artikel diuji oleh AI Fact Checker. Jika gagal, temuan kesalahan dicatat di `newsletter_fact_checks` dan artikel kembali ke AI Writer via *Revision Loop* (memperbarui `version` naskah).
6. `newsletter_articles` (Status `PASS`) ──► `newsletter_issues`: Seluruh artikel yang lolos 100% validasi digabungkan ke dalam 1 edisi `newsletter_issues` untuk dipublikasikan secara bersamaan.

---

## Final Storage Decision

Pengelompokan tegas kebijakan penyimpanan data (*Storage Decision*) untuk seluruh jenis data di dalam Newsletter System:

| Jenis Data / Objek | Categorized Storage Decision | Alasan & Aturan Persistensi |
| :--- | :--- | :--- |
| Data Poin, Transaksi, Lineup, & Stats Mentah FPL | **REFERENCE FROM EXISTING FPL TABLES** | Tetap berada di tabel FPL mentah (`fpl_gameweeks`, `manager_gameweek_stats`, dll). Dilarang duplikasi. |
| Detector Triggers & Verified Fact Sheet JSON | **STORE PERMANENTLY** | Disimpan di `newsletter_story_candidates` untuk keperluan audit dan rujukan historis. |
| Score 6 Dimensi & System Recommended Tier | **STORE PERMANENTLY** | Disimpan di `newsletter_story_candidates` / `newsletter_story_clusters` untuk mengabadikan kalkulasi Layer 1. |
| Variabel Kalkulasi Intermediat (misal Z-Score temp) | **COMPUTE DYNAMICALLY** | Dihitung sementara di memori aplikasi saat eksekusi algoritma, tidak perlu disimpan ke database. |
| Rencana Kerja Editorial (*Editorial Plan*) | **STORE PERMANENTLY** | Disimpan di `newsletter_editorial_plans` sebagai rujukan instruksi resmi AI Editor. |
| Draf Naskah Artikel & Versi Revisinya | **STORE AS VERSION HISTORY** | Disimpan di `newsletter_articles` dengan kolom `version` untuk mendukung siklus revisi. |
| Laporan Pengujian Fact Check (Audit Laporan) | **STORE PERMANENTLY** | Disimpan di `newsletter_fact_checks` sebagai rekam jejak audit (*append-only*). |
| Terbitan Newsletter Issue & Tata Letak Artikel | **STORE PERMANENTLY** | Disimpan di `newsletter_issues` untuk menyajikan majalah digital di frontend web. |
| Alur Cerita Musim Berjalan (*Storylines*) | **STORE PERMANENTLY** | Disimpan di `newsletter_storylines` untuk melacak status siklus hidup cerita lintas-Gameweek. |
| Profil Historis Manager Dinamis | **COMPUTE DYNAMICALLY** | Dihitung secara dinamis melalui query SQL agregasi ke data FPL mentah saat dibutuhkan. |

---

## Final Newsletter Persistence Model

Rekomendasi final implementasi model persistensi data sebelum penulisan skema database fisik:

### 1. Minimal Viable Product (MVP Core Entities — Wajib Ada)
Untuk meluncurkan versi awal Newsletter System secara sempurna, 6 entitas berikut **wajib diimplementasikan**:
1. `newsletter_issues` (Metadata terbitan edisi mingguan).
2. `newsletter_articles` (Naskah berita, versi, status `PASS`, tier, & urutan tampilan).
3. `newsletter_editorial_plans` (Rencana kerja editorial AI Editor).
4. `newsletter_story_clusters` (Pengelompokan kandidat cerita & Fact Sheet JSON).
5. `newsletter_fact_checks` (Rekam audit 4 layer validasi AI Fact Checker).
6. `newsletter_storylines` (Pelacak alur cerita berkelanjutan liga).

### 2. Entity Consolidation (Dapat Digabung / Dioptimasi)
- `newsletter_story_candidates` dapat disimpan langsung di dalam `newsletter_story_clusters` sebagai kumpulan array JSON kandidat cerita sumber untuk menyederhanakan jumlah tabel fisik di tahap MVP.
- Junction table urutan artikel edisi terbitan dapat disederhanakan dengan memasukkan `issue_id` dan `display_order` langsung ke dalam entitas `newsletter_articles`.

### 3. Data Computed Dynamically (Tidak Perlu Tabel Terpisah)
- Perhitungan statistik rata-rata liga, pergerakan rank 5 GW terakhir, dan profil manajerial tidak perlu dibuatkan tabel fisik baru, cukup dihitung secara dinamis via SQL query agregasi.

### 4. Data Stored for Audit & Historical Continuity (Wajib Permanen)
- *Verified Fact Sheet JSON*, dokumen *Editorial Plan*, naskah *Article Draft* (beserta `version`), laporan *Fact Check Result*, dan metadata *Newsletter Issue* **wajib disimpan permanen** untuk mempertahankan *traceability* (keterlacakan fakta 1-to-1) dan kontinuitas historis liga FPL Kino Indonesia.

---

## 23. Final Lean Newsletter Database Model — MVP

Section ini mengunci arsitektur basis data sistem Newsletter versi MVP secara sangat padat, efisien dalam penyimpanan (*storage-efficient*), dan bebas *over-engineering*.

### Formulasi Prinsip Utama Persistensi MVP:

```
EXISTING FPL TABLES
= Source of Truth mutlak untuk data mentah & statistik historis

NEWSLETTER TABLES
= Hanya menyimpan 4 entitas utama turunan editorial, status penerbitan, & rekam jejak validasi
```

Untuk tahap MVP, sistem **HANYA menggunakan 4 entitas inti (*4 Core Entities*)**:
1. `newsletter_story_clusters`
2. `newsletter_articles`
3. `newsletter_fact_checks`
4. `newsletter_issues`

---

### Detail 4 Lean Core Entities:

#### 1. `newsletter_story_clusters`
Entitas ini menggabungkan seluruh tahapan data-processing awal (*Story Candidate*, *Story Cluster*, *Detector Result*, *Objective Score*, *System Priority*, dan *Recommended Tier*) ke dalam 1 entitas tunggal yang efisien.
- **Purpose**: Mengabadikan hasil pemindaian detector, pengelompokan kandidat cerita beririsan, dan kalkulasi prioritas data-driven Layer 1 dalam 1 tempat untuk dijadikan rujukan *Fact Sheet* bagi AI Editor.
- **Data Konseptual Yang Disimpan**:
  - `Verified Fact Sheet JSON`: Data fakta terverifikasi (poin, pemain, rank, delta).
  - `Detection Metadata`: Rincian detector pemicu (`detector_id`, `category`, `gw_number`).
  - `Involved Managers / Players`: Array ID manager & ID pemain FPL yang terlibat.
  - `Score Summary`: Rincian skor 6 dimensi (Impact, Rarity, Drama, History, Rivalry, Entertainment) dan *Normalized Score*.
  - `Recommended Tier`: Tier awal rekomendasi sistem (Tier 1 s/d Tier 4).
  - `Processing Status`: Status pemrosesan cluster (`CLUSTERED`, `SELECTED_FOR_PLAN`, `NOT_SELECTED`).
- **Relationship dengan Existing FPL Data**: Berelasi langsung dengan `fpl_gameweeks` via `gw_number` dan merujuk Foreign Key ke `managers` & `fpl_players`. Raw facts **dilarang diduplikasi** jika masih dapat direferensikan via Foreign Key.
- **Lifecycle**: `CLUSTERED` ──► `SELECTED_FOR_PLAN` / `NOT_SELECTED`

#### 2. `newsletter_articles`
Entitas ini menggabungkan secara *lean* rancangan instruksi *Editorial Plan*, draf naskah artikel berita, siklus revisi (*Revision Loop*), hingga naskah terbitan final ke dalam **1 entitas tunggal** berbasis *versioning*.
- **Purpose**: Menghilangkan kebutuhan tabel terpisah untuk *Editorial Plan*, *Drafts*, dan *Revisions*. Entitas ini mengelola seluruh siklus hidup penulisan naskah berita hingga siap diterbitkan.
- **Konsep Versioning & Revision Loop**:
  - Menggunakan kolom `version` (v1, v2, v3) dan `readiness_status` (`DRAFT`, `UNDER_VALIDATION`, `REVISION_REQUIRED`, `APPROVED_PASS`, `REJECTED`).
  - Saat AI Writer menerima revisi dari Fact Checker, naskah cukup diperbarui pada baris artikel yang sama dengan menaikkan nomor `version` dan memperbarui statusnya.
- **Data Konseptual Yang Disimpan**:
  - `Editorial Metadata`: *Editorial angle*, *narrative theme*, *tone*, *title direction*, dan instruksi khusus AI Writer (bagian dari Editorial Plan).
  - `Article Content`: Judul (*headline*), subjudul (*subheadline*), dan naskah tubuh berita (*article_body*).
  - `Tier`: Alokasi tier final yang disetujui (Tier 1 s/d Tier 4).
  - `Used Facts & Context`: `key_facts_used_json` & `allowed_historical_context_used_json`.
  - `Trash Talk Level`: Tingkat bobot trashtalk (*Low / Medium / High*).
  - `Publication Readiness`: `version` & `readiness_status`.
- **Lifecycle**: `DRAFT` ──► `UNDER_VALIDATION` ──► `REVISION_REQUIRED` ──► `APPROVED_PASS` / `REJECTED`

#### 3. `newsletter_fact_checks`
Entitas ini menyimpan seluruh riwayat hasil pengujian validasi 4 layer yang dilakukan oleh AI Fact Checker secara *append-only*.
- **Purpose**: Menjamin transparansi audit dan akuntabilitas siklus revisi tanpa mengotori tabel naskah artikel.
- **Relationship dengan Article Version**: Berelasi langsung ke `article_id` dan mencatat `version_tested` yang spesifik diuji.
- **Data Konseptual Yang Disimpan**:
  - `Validation Result`: Status keputusan (`PASS`, `REVISION_REQUIRED`, `REJECTED`).
  - `Failed Validation Layers`: Layer validasi yang mendeteksi kesalahan (Fact, Context, Safety, Output).
  - `Detected Issues`: Deskripsi detail temuan kesalahan fakta/trashtalk.
  - `Required Corrections`: Catatan instruksi perbaikan spesifik bagi AI Writer.
  - `Recheck History`: Timestamp dan rekam pengujian ulang.
- **Strict Rules**: DILARANG menyimpan ulang *Article Body* atau data mentah FPL. HANYA artikel dengan `validation_status = 'PASS'` yang diizinkan melangkah ke *Newsletter Issue*.

#### 4. `newsletter_issues`
Entitas ini merepresentasikan satu edisi terbitan majalah digital *Newsletter Issue* per Gameweek.
- **Purpose**: Mengelompokkan dan mengatur tata letak multi-artikel dari berbagai tier untuk disajikan di frontend web.
- **Data Konseptual Yang Disimpan**:
  - `Gameweek Relationship`: Berelasi 1-to-1 dengan `gw_number`.
  - `Issue Status`: `PREPARING` ──► `PUBLISHED` ──► `ARCHIVED`.
  - `Multi-Article Relationship`: Menyimpan pemetaan daftar artikel terpublikasi beserta urutan tampilan (*article_placement_json* / junction).
  - `Tier Placement & Ordering`: Menentukan tata letak artikel utama (*Tier 1 — Headline News*), pendukung (*Tier 2 — Featured Stories*), berita biasa (*Tier 3 — Regular Stories*), dan rangkuman singkat (*Tier 4 — Quick Hits / Fun Facts*).
- **Publication Lifecycle**: `PREPARING` ──► `PUBLISHED` ──► `ARCHIVED`

---

## Dynamic League Memory Strategy

Pada versi MVP, sistem **TIDAK MEMBUAT TABEL MEMORY TERPISAH**. Sebaliknya, memori historis liga disajikan secara dinamis (*Dynamic Editorial Context*) saat dibutuhkan pipeline:

```
┌─────────────────────────────────────────────────────────┐
│                      CURRENT STORY                      │
│            (Fact Sheet dari Story Cluster)              │
└────────────────────────────┬────────────────────────────┘
                             │
                             ├─► Existing FPL Historical Tables
                             ├─► Existing Manager History
                             └─► Previous Newsletter Articles
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               DYNAMIC EDITORIAL CONTEXT                 │
│      (Hanya konteks relevan yang disuplai ke AI)        │
└────────────────────────────┴────────────────────────────┘
```

### Prinsip Penyajian Dynamic Memory:
1. **Query On-Demand**: Konteks historis (seperti pergerakan rank 5 GW terakhir atau rekor poin bench) dihitung secara dinamis dari tabel FPL mentah (`manager_gameweek_stats`, `fpl_gameweeks`) melalui query agregasi SQL.
2. **Previous Newsletter Context**: Diambil langsung dari entitas `newsletter_articles` edisi sebelumnya yang berstatus `APPROVED_PASS`.
3. **No Raw Historical Data Dump**: Sistem HANYA menyalurkan potongan konteks historis yang secara langsung relevan dengan *Story Cluster* yang diulas, bukan seluruh isi database historis.

---

## Final MVP Pipeline

Alur kerja ujung-ke-ujung (*end-to-end*) sistem Newsletter versi MVP berbasis 4 entitas inti:

```
┌─────────────────────────────────────────────────────────┐
│                      FPL DATABASE                       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                Story Detection & Scoring                │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               newsletter_story_clusters                 │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                       AI Editor                         │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  newsletter_articles                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               AI Writer / Revision Loop                 │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 newsletter_fact_checks                  │
└────────────────────────────┬────────────────────────────┘
                             │ (Status = PASS 100%)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    newsletter_issues                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  PUBLISHED NEWSLETTER                   │
└────────────────────────────┬────────────────────────────┘
```

---

## Storage Efficiency Rules

Sistem menegaskan 9 aturan efisiensi penyimpanan (*storage efficiency rules*) mutlak untuk tahap MVP:

1. **No Duplicate Raw FPL Data**: Dilarang duplikasi data mentah FPL yang dapat direferensikan via Foreign Key.
2. **No Intermediate Calculation Variables**: Variabel kalkulasi algoritma sementara (seperti Z-score temporary) dihitung di memori aplikasi, tidak disimpan ke database.
3. **Store Only Essential Editorial Outputs**: Simpan hanya output editorial yang dibutuhkan untuk audit, revisi, dan publikasi.
4. **Pragmatic JSON Usage**: Gunakan format JSON hanya untuk data editorial terstruktur atau Fact Sheet yang tidak memerlukan query *relational join*.
5. **Single Entity Versioning**: Gunakan kolom `version` dan `readiness_status` pada `newsletter_articles` daripada membuat tabel draf/revisi/editorial plan terpisah.
6. **Append-Only Fact Checks**: Tabel `newsletter_fact_checks` bersifat *append-only* tanpa mengotori naskah artikel.
7. **Dynamic League Memory**: Memori liga dihitung secara dinamis dari query SQL dan artikel edisi sebelumnya.
8. **End-to-End Traceability Guarantee**: Setiap artikel terbit wajib dapat ditelusuri kembali ke `cluster_id` dan *Verified Fact Sheet* sumber.
9. **Strict 4-Entity Cap for MVP**: DILARANG KERAS menambah tabel fisik baru untuk kebutuhan yang masih dapat ditangani oleh 4 entitas MVP ini.

---

## Final MVP Decision

### Kesimpulan & Rekomendasi Final:

1. **Mengapa 4 Entitas Cukup untuk MVP**:
   - `newsletter_story_clusters` sudah mencakup seluruh proses detection, scoring, dan clustering.
   - `newsletter_articles` sudah menyatukan rancangan Editorial Plan, draf naskah, siklus revisi, dan naskah final.
   - `newsletter_fact_checks` sudah menangani seluruh rekam jejak audit validasi 4 layer.
   - `newsletter_issues` sudah menangani penerbitan multi-artikel berjenjang ke pengguna.

2. **Entitas Yang Sengaja Tidak Dibuat di MVP**:
   - *Tabel `newsletter_story_candidates` terpisah*: Digabungkan langsung ke `newsletter_story_clusters`.
   - *Tabel `newsletter_editorial_plans` terpisah*: Digabungkan sebagai bidang metadata editorial di `newsletter_articles`.
   - *Tabel `newsletter_storylines` / `league_memory` terpisah*: Dihitung secara dinamis via query SQL agregasi.

3. **Data Yang Diambil Secara Dinamis**:
   - Profil historis manager, tren pergerakan rank 5 GW, rekor poin bench, dan statistik liga diambil secara dinamis dari existing FPL tables (`manager_gameweek_stats`, `fpl_gameweeks`).

4. **Kondisi Untuk Menambahkan Tabel Baru di Masa Depan**:
   Penambahan tabel baru (seperti tabel `newsletter_storylines` atau `newsletter_editorial_plans` terpisah) HANYA dibenarkan jika di masa mendatang terdapat kebutuhan fitur analisis storyline kompleks lintas-musim yang tidak lagi efisien ditangani via query agregasi dinamis.

---

## 24. MVP Detector Implementation Priority

### Purpose

Section ini secara resmi mengunci prioritas implementasi awal Story Detection Engine untuk Newsletter MVP.

Semua 27 detector dalam `Story Detection Engine — Detailed Detector Catalog` (Section 9) TETAP merupakan bagian dari *Final Newsletter System Architecture*.

Namun, untuk implementasi MVP pertama, sistem TIDAK perlu langsung membangun seluruh 27 detector.

MVP menggunakan **11 detector prioritas** yang dipilih untuk memastikan *coverage* terhadap seluruh sumber utama cerita dan drama FPL Kino Indonesia.

---

### Official MVP Detector Set (11 Priority Detectors)

#### 1. Performance Coverage
- `DET_PERF_WEEKLY_CHAMPION` (Manager of the Week)
- `DET_PERF_WEEKLY_FLOOR` (Gameweek Disaster / Floor Score)
- `DET_PERF_LEAGUE_OUTLIER` (League Outlier Score)

*Tujuan*: Mendeteksi performa terbaik, performa terburuk, dan hasil Gameweek yang menjadi anomali statistik dibanding kondisi normal liga.

---

#### 2. Ranking Drama Coverage
- `DET_RANK_TITLE_CHANGE` (Title Race Shift / New League Leader)
- `DET_RANK_FREEFALL` (Freefall Warning / Biggest Rank Drop)
- `DET_RANK_CLIMBER` (Climber of the Week / Biggest Rank Gain)

*Tujuan*: Mendeteksi perubahan penting dalam perebutan posisi mahkota puncak liga, lonjakan posisi signifikan, dan kejatuhan drastis di klasemen overall.

---

#### 3. Bench Drama Coverage
- `DET_BENCH_EXPLOSION` (Benched Explosion / High Bench Score)

*Tujuan*: Mendeteksi poin besar yang tertinggal di bangku cadangan dan berpotensi menjadi sumber cerita komedi, penyesalan taktis (*tactical regret*), atau bahan trashtalk *office-safe*.

---

#### 4. Captain Drama Coverage
- `DET_CAPT_BLANK_DISASTER` (Captain Blank / Vice-Captain Betrayal)

*Tujuan*: Mendeteksi keputusan kapten yang menghasilkan kegagalan signifikan (*blank* <= 2 pts) dan memiliki potensi drama editorial tinggi (terutama saat Vice-Captain meledak).

---

#### 5. Transfer Drama Coverage
- `DET_XFER_MASTERSTROKE` (Masterstroke Transfer / Instant Haul)
- `DET_XFER_NIGHTMARE` (Transfer Nightmare / Red Card / Injury)
- `DET_XFER_HIT_GAMBIT` (Points Hit Gambit / Heavy Hit ROI)

*Tujuan*: Mendeteksi keputusan transfer yang menghasilkan keuntungan instan besar, bencana kesalahan transfer baru (kartu merah/cedera), serta pertaruhan transfer menggunakan pengorbanan poin *hit* (-4, -8, -12+).

##### Evaluasi Khusus `DET_XFER_HIT_GAMBIT`:
Detector ini wajib secara khusus mampu mengevaluasi alur logis:
```
Transfer Action
  ──► Transfer Cost / Points Hit
  ──► Points Generated by Incoming Players
  ──► Net Transfer Outcome
  ──► Editorial Story Potential
```

- *Contoh Konseptual*:
  Manager mengambil transfer dengan pengorbanan poin *hit* `-8`. Total poin yang dihasilkan oleh pemain baru yang ditransfer masuk hanya `6`.
  Net Transfer Outcome sebelum evaluasi kontekstual: `6 - 8 = -2 net points`.
- *Catatan Penting*: Kejadian tersebut menjadi kandidat cerita jika memenuhi ambang batas *threshold* detector dan memiliki *editorial story potential*. Sistem **TIDAK BOLEH** secara otomatis menyimpulkan bahwa setiap *negative net transfer* otomatis menjadi cerita besar. Kejadian tetap wajib melalui tahapan:
  1. Story Detection
  2. Objective System Scoring
  3. Story Clustering
  4. Diversity Filtering
  5. AI Editorial Review

---

### MVP Coverage Principle

Ke-11 detector MVP ini dipilih berdasarkan liputan (*coverage*) menyeluruh terhadap 10 sumber utama drama newsletter:

1. **Outstanding Performance** (`DET_PERF_WEEKLY_CHAMPION`)
2. **Poor Performance** (`DET_PERF_WEEKLY_FLOOR`)
3. **Statistical Anomaly** (`DET_PERF_LEAGUE_OUTLIER`)
4. **Ranking Movement** (`DET_RANK_CLIMBER`)
5. **Ranking Collapse** (`DET_RANK_FREEFALL` & `DET_RANK_TITLE_CHANGE`)
6. **Bench Regret** (`DET_BENCH_EXPLOSION`)
7. **Captain Disaster** (`DET_CAPT_BLANK_DISASTER`)
8. **Transfer Genius** (`DET_XFER_MASTERSTROKE`)
9. **Transfer Failure** (`DET_XFER_NIGHTMARE`)
10. **Transfer Hit Gamble** (`DET_XFER_HIT_GAMBIT`)

*Tujuan MVP*: Bukan membangun sebanyak mungkin detector di awal, melainkan memastikan terbitan Newsletter pertama sudah 100% mampu menemukan cerita menarik dari berbagai jenis kejadian utama liga.

---

### Relationship With The Full 27 Detector Catalog

Prinsip hubungan antara Katalog Utuh dan Prioritas MVP:

```
FULL DETECTOR CATALOG (27 Detectors)
= Final detection capability roadmap

MVP DETECTOR IMPLEMENTATION PRIORITY (11 Detectors)
= First implementation subset
```

- Kesebelas detector MVP **tidak menggantikan, menghapus, atau mengubah** 27 detector dalam *Final Newsletter System Architecture*.
- Detector lainnya (seperti detector chip, duel rivalitas 1 poin, atau bek cleansheet sweep) tetap dapat diimplementasikan secara bertahap setelah pipeline MVP berhasil berjalan *end-to-end*.

---

### Implementation Priority Rule

Urutan implementasi teknis awal (1 s/d 11):

1. `DET_PERF_WEEKLY_CHAMPION`
2. `DET_PERF_WEEKLY_FLOOR`
3. `DET_PERF_LEAGUE_OUTLIER`
4. `DET_RANK_TITLE_CHANGE`
5. `DET_RANK_FREEFALL`
6. `DET_RANK_CLIMBER`
7. `DET_BENCH_EXPLOSION`
8. `DET_CAPT_BLANK_DISASTER`
9. `DET_XFER_MASTERSTROKE`
10. `DET_XFER_NIGHTMARE`
11. `DET_XFER_HIT_GAMBIT`

*Aturan Eksekusi Pipeline*: Urutan implementasi di atas tidak mengubah prinsip bahwa seluruh detector bermuara pada pipeline yang seragam:
```
FPL SOURCE DATA
  ──► Detector Trigger
  ──► Verified Fact Sheet
  ──► Objective System Scoring
  ──► Story Cluster
  ──► System Priority
  ──► AI Editorial Pipeline
```

---

### Final MVP Decision

1. Newsletter Story Detection Engine versi MVP secara resmi dimulai dengan **tepat 11 detector prioritas**.
2. Database MVP **tetap menggunakan tepat 4 core entities**:
   - `newsletter_story_clusters`
   - `newsletter_articles`
   - `newsletter_fact_checks`
   - `newsletter_issues`
3. **Tidak ada perubahan** pada *Final Newsletter System Architecture* yang telah disepakati.
4. **Tidak ada penambahan tabel baru** atau skema database baru pada tahap ini.

---

## 25. Final Newsletter Database Schema Blueprint — MVP

Tujuan section ini adalah mengunci blueprint database konseptual final yang siap diterjemahkan menjadi skema SQL Supabase pada tahap selanjutnya.

Sistem secara ketat menggunakan **TEPAT 4 physical core entities**:
1. `newsletter_story_clusters`
2. `newsletter_articles`
3. `newsletter_fact_checks`
4. `newsletter_issues`

DILARANG KERAS menambahkan tabel fisik baru. DILARANG membuat SQL, migration script, Supabase query, Edge Function, API integration, atau code pada section ini.

---

### 1. General Blueprint Principles

Sistem menerapkan formulasi prinsip dasar persistensi:

```
EXISTING FPL TABLES
= Source of Truth mutlak untuk data mentah & statistik historis

NEWSLETTER TABLES
= Derived editorial, processing, validation, dan publication data
```

#### Aturan Baku Blueprint Persistensi:
1. **No Duplicate Raw FPL Facts**: Dilarang menduplikasi data fakta mentah FPL jika masih dapat direferensikan via Foreign Key atau relasi ID ke existing FPL tables (`fpl_gameweeks`, `managers`, `fpl_players`).
2. **Store Verified Derived Facts**: Simpan *derived facts* dan *Verified Fact Sheet JSON* yang sudah dikurasi untuk menjamin auditabilitas (*auditability*) dan kemampuan reka ulang (*reproducibility*).
3. **Explicit Separation**: Interpretasi editorial hasil AI (*AI-generated editorial interpretation*) wajib dipisahkan secara tegas dari fakta sah terverifikasi (*verified facts*).
4. **Normal Fields for Querying**: Data yang sering digunakan untuk *query*, *filtering*, atau *sorting* wajib ditaruh di *normal fields* (kolom fisik standar).
5. **Structured JSON for Variables**: Metadata terstruktur dan variabel berukuran dinamis wajib ditaruh dalam format JSON.
6. **No Over-Engineering**: Hindari pembuatan tabel junction atau tabel draf/revisi berlebihan.
7. **Strict 4 Physical Tables Cap**: Tepat 4 tabel fisik untuk versi MVP.

---

### 2. Entity Blueprint — `newsletter_story_clusters`

Entity ini menjadi pusat penampungan hasil pemrosesan awal: *Story Candidate*, *Story Cluster*, *Detector Results*, *Objective Scoring*, *System Priority*, *Recommended Tier*, dan *Verified Fact Sheet*.

#### A. Identity & Scope
- `id` (Cluster Identity / Primary Key UUID)
- `gw_number` (Source Gameweek Number — Normal Field)
- `primary_story_type` (Nama/Tipe cerita utama dari detector — Normal Field)
- `story_category` (Kategori cerita dari 10 kategori — Normal Field)
- `created_at` (Timestamp pembuatan record)
- `updated_at` (Timestamp pembaruan record jika terjadi perubahan status)

#### B. Story Participants
- `primary_manager_id` (Manager utama yang menjadi subjek cerita — Normal Field untuk kemudahan filter & query)
- `involved_managers_json` (Array ID & nama manager lain yang terlibat dalam cluster — Structured JSON)
- `involved_players_json` (Array ID & nama pemain FPL yang menjadi bagian dari cerita — Structured JSON)

#### C. Detection Metadata
- `primary_detector` (ID detector utama pemicu cerita — Normal Field)
- `triggered_detectors_json` (Daftar seluruh detector pemicu yang terhubung — Structured JSON)
- `detection_summary` (Ringkasan teks objektif yang menjelaskan alasan mengapa cerita ini terdeteksi — Normal Field)

#### D. Verified Fact Sheet
- `verified_fact_sheet_json` (Snapshot fakta terverifikasi berisi poin, rank, delta, transaksi, dan susunan lineup yang menjadi rujukan sah bagi AI Editor & AI Writer tanpa membaca *raw database dump* — Structured JSON)
- `fpl_source_references_json` (Pemetaan ID rujukan ke data sumber FPL mentah — Structured JSON)
- `verified_source_context` (Ringkasan konteks sumber terverifikasi — Normal Field)

#### E. Objective Scoring
- `impact_score` (Skor dampak liga 0.0 - 10.0 — Normal Field)
- `rarity_score` (Skor kelangkaan statistik 0.0 - 10.0 — Normal Field)
- `drama_score` (Skor kedramatisan 0.0 - 10.0 — Normal Field)
- `historical_context_score` (Skor bobot historis 0.0 - 10.0 — Normal Field)
- `rivalry_score` (Skor rivalitas 0.0 - 10.0 — Normal Field)
- `entertainment_score` (Skor potensi trashtalk 0.0 - 10.0 — Normal Field)
- `normalized_priority_score` (Total skor terbobot ter-normalisasi Layer 1 — Normal Field)
- `recommended_tier` (Rekomendasi tier awal dari sistem: Tier 1 s/d Tier 4 — Normal Field)

#### F. Processing Status
- `processing_status` (Status siklus hidup pemrosesan cluster — Normal Field)
- **Lifecycle**: `DETECTED` ──► `SCORED` ──► `CLUSTERED` ──► `SELECTED` / `NOT_SELECTED`
- **Immutability Rule**: Begitu status berubah menjadi `SELECTED` dan diikat oleh `newsletter_articles`, seluruh isi `verified_fact_sheet_json` dan metadata scoring menjadi **100% immutable**.

---

### 3. Entity Blueprint — `newsletter_articles`

Entity ini secara *lean* menggabungkan rancangan *Editorial Plan*, draf naskah *AI Writer*, revisi naskah (*Revision Loop*), hingga naskah terbitan final ke dalam **1 entitas tunggal**.

#### A. Identity & Relationship
- `id` (Article Row Identity / Primary Key UUID)
- `logical_article_id` (Identitas unik cerita yang konsisten lintas revisi — Normal Field)
- `story_cluster_id` (Foreign Key merujuk ke `newsletter_story_clusters` — Normal Field)
- `issue_id` (Foreign Key opsional merujuk ke `newsletter_issues` jika terbit — Normal Field)
- `version` (Nomor versi naskah: 1, 2, 3 — Normal Field)

#### B. Editorial Plan Data
Simpan output editorial terstruktur yang dihasilkan oleh AI Editor (AI Editor bukan *source of truth* fakta):
- `final_editorial_angle` (Sudut pandang berita utama — Normal Field)
- `narrative_theme` (Tema besar narasi berita — Normal Field)
- `tone` (Gaya bahasa yang ditentukan — Normal Field)
- `title_direction` (Petunjuk arah judul berita — Normal Field)
- `why_story_matters` (Justifikasi relevansi berita bagi liga — Normal Field)
- `editorial_plan_details_json` (Instruksi struktur narasi, *writing instructions*, *trash talk opportunity*, dan *facts that must not be inferred* — Structured JSON)

#### C. Article Content
- `headline` (Judul utama artikel berita — Normal Field)
- `subheadline` (Judul sekunder / rangkuman ulasan — Normal Field)
- `article_body` (Naskah tubuh artikel berita lengkap — Normal Field)

#### D. Traceability
- `key_facts_used_json` (Daftar fakta sah yang dipakai dalam artikel — Structured JSON)
- `historical_context_used_json` (Memori historis yang dimasukkan ke naskah — Structured JSON)
- `fact_sheet_references_json` (Pemetaan 1-to-1 fakta naskah kembali ke `verified_fact_sheet_json` — Structured JSON)

#### E. Editorial & Publication Metadata
- `final_tier` (Tier publikasi final yang disetujui: Tier 1 s/d Tier 4 — Normal Field)
- `trash_talk_level` (Tingkat bobot trashtalk: `LOW`, `MEDIUM`, `HIGH` — Normal Field)
- `display_order` (Urutan posisi tampilan dalam Newsletter Issue — Normal Field)
- `readiness_status` (Status kesiapan publikasi artikel — Normal Field)

#### F. Lifecycle
- `readiness_status`: `DRAFT` ──► `UNDER_VALIDATION` ──► `REVISION_REQUIRED` ──► `APPROVED_PASS` / `REJECTED`
- **Publication Gate Rule**: Artikel HANYA boleh dianggap *publication-ready* dan dikaitkan dengan `issue_id` jika memiliki `readiness_status = 'APPROVED_PASS'`.

---

### 4. Article Versioning Strategy

Sistem memilih dan mengunci **Option A (Multiple Rows for Version History)** sebagai strategi versioning final untuk MVP *lean*:

```
┌─────────────────────────────────────────────────────────┐
│        OPTION A: MULTIPLE ROWS PER REVISION             │
│  - 1 Logical Article memiliki beberapa baris fisik      │
│  - Setiap revisi menghasilkan baris baru (version +1)  │
│  - Menjamin 100% auditability & immutable history       │
└─────────────────────────────────────────────────────────┘
```

#### Justifikasi Keputusan Option A:
1. **Audit Revision Loop Sempurna**: Mengabadikan draf asli (`v1`) dan draf hasil perbaikan (`v2`, `v3`) tanpa menghapus riwayat terdahulu.
2. **Preservasi Rekam Audit Fact Check**: `newsletter_fact_checks` mereferensikan `article_id` fisik dan `version_tested` secara spesifik, sehingga laporan pengujian validasi selalu menunjuk tepat pada draf naskah yang diuji.
3. **Penerapan Lean pada Supabase Free Plan**: Hanya membutuhkan 1 tabel fisik `newsletter_articles` tanpa perlu tabel draf/revisi terpisah.
4. **Query Artikel Terbit Efisien**: Untuk mengambil naskah terbitan final, query cukup menyaring `issue_id = :id AND readiness_status = 'APPROVED_PASS'`.

---

### 5. Entity Blueprint — `newsletter_fact_checks`

Entity ini menyimpan seluruh hasil audit validasi 4 layer dari AI Fact Checker secara *append-only*.

#### A. Identity
- `id` (Fact Check Identity / Primary Key UUID)
- `article_id` (Foreign Key merujuk ke baris fisik `newsletter_articles` yang diuji — Normal Field)
- `version_tested` (Nomor versi naskah artikel yang spesifik diuji — Normal Field)
- `created_at` (Timestamp eksekusi pengujian validasi — Normal Field)

#### B. Validation Result
- `validation_status` (Status hasil pengujian: `PASS`, `REVISION_REQUIRED`, `REJECTED` — Normal Field)
- `overall_result` (Ringkasan kesimpulan hasil pengujian auditor — Normal Field)
- `recheck_required` (Flag apakah pengujian ulang wajib dilakukan setelah revisi: `TRUE / FALSE` — Normal Field)

#### C. Four Validation Layers
- `fact_validation_passed` (Flag kelulusan validasi fakta: `TRUE / FALSE` — Normal Field)
- `context_validation_passed` (Flag kelulusan validasi konteks historis: `TRUE / FALSE` — Normal Field)
- `safety_validation_passed` (Flag kelulusan validasi etika & trashtalk: `TRUE / FALSE` — Normal Field)
- `output_validation_passed` (Flag kelulusan validasi struktur & tier: `TRUE / FALSE` — Normal Field)

#### D. Validation Issues
- `failed_validation_layers_json` (Daftar layer validasi yang mendeteksi kesalahan — Structured JSON)
- `detected_issues_json` (Deskripsi rincian temuan kesalahan fakta/trashtalk — Structured JSON)
- `related_facts_or_rules_json` (Rujukan fakta sah Fact Sheet atau aturan etika yang dilanggar — Structured JSON)
- `required_corrections_text` (Instruksi perbaikan spesifik bagi AI Writer untuk proses revisi — Normal Field)

*Strict Rule*: DILARANG menyimpan ulang `article_body` atau data mentah FPL di tabel ini. Setiap record bersifat **immutable audit snapshot**.

---

### 6. Entity Blueprint — `newsletter_issues`

Entity ini merepresentasikan satu edisi majalah digital *Newsletter Issue* terpublikasi per Gameweek.

#### A. Identity
- `id` (Issue Identity / Primary Key UUID)
- `gw_number` (Source Gameweek Number — Normal Field & Unique Constraint)
- `issue_title` (Judul utama edisi terbitan majalah — Normal Field)

#### B. Issue Metadata
- `issue_summary` (Ringkasan ulasan edisi mingguan — Normal Field)
- `issue_status` (Status edisi: `PREPARING`, `PUBLISHED`, `ARCHIVED` — Normal Field)
- `created_at` (Timestamp inisiasi edisi terbitan — Normal Field)
- `published_at` (Timestamp resmi penerbitan edisi ke pengguna akhir — Normal Field)

#### C. Multi-Article Relationship
- Relasi diselesaikan secara *lean*: `One Newsletter Issue ──► Many Newsletter Articles`.
- Foreign Key `issue_id` dan `display_order` disimpan pada tabel `newsletter_articles`.
- Tabel `newsletter_issues` **TIDAK menyimpan** naskah `article_body` dalam format JSON.

#### D. Lifecycle
- `issue_status`: `PREPARING` ──► `PUBLISHED` ──► `ARCHIVED`
- **Immutability Rule**: Setelah status berubah menjadi `PUBLISHED`, seluruh konten edisi terbitan dianggap **final & immutable**.

---

### 7. Final Relationship Blueprint

Relasi konseptual antar-tabel dan rantai audit keterlacakan (*audit trail*):

```
Existing FPL Tables
       │
       ▼
newsletter_story_clusters
       │
       ▼
newsletter_articles (Logical Article ID + Version)
       │
       ├───────────────────────────┐
       ▼                           ▼
newsletter_fact_checks      newsletter_issues
(Append-Only Audit)        (One-to-Many Published)
```

#### Cardinality Konseptual:
- **One Gameweek** ──► **Many Story Clusters**
- **One Story Cluster** ──► **One Logical Article** ──► **Multiple Article Versions**
- **One Article Version** ──► **Many Fact Check Records** (jika terjadi pengujian ulang)
- **One Newsletter Issue** ──► **Many Approved Articles** (`readiness_status = 'APPROVED_PASS'`)

#### Audit Trail Traceability Chain:
```
Published Article (newsletter_articles)
  ──► Article Version (version)
  ──► Story Cluster (newsletter_story_clusters)
  ──► Verified Fact Sheet (verified_fact_sheet_json)
  ──► Existing FPL Source Data (fpl_gameweeks, manager_gameweek_stats)
```

---

### 8. JSON Storage Strategy

Strategi pemisahan eksplisit antara *Normal Fields* dan *Structured JSON*:

#### Normal Fields (Gunakan Kolom Fisik Standar)
Data berikut wajib berupa *normal fields* karena sering digunakan untuk *query*, *filtering*, *sorting*, *join*, atau *indexing*:
- `gw_number`, `primary_story_type`, `story_category`, `primary_detector`, `primary_manager_id`
- `impact_score`, `rarity_score`, `drama_score`, `historical_context_score`, `rivalry_score`, `entertainment_score`, `normalized_priority_score`, `recommended_tier`
- `version`, `final_tier`, `readiness_status`, `trash_talk_level`, `display_order`
- `validation_status`, `issue_status`

#### Structured JSON (Gunakan JSON Column)
Data berikut efisien disimpan dalam format JSON karena berukuran dinamis atau berstruktur kompleks:
- `verified_fact_sheet_json`, `fpl_source_references_json`
- `involved_managers_json`, `involved_players_json`
- `triggered_detectors_json`, `editorial_plan_details_json`
- `key_facts_used_json`, `historical_context_used_json`, `fact_sheet_references_json`
- `failed_validation_layers_json`, `detected_issues_json`, `related_facts_or_rules_json`

*Prinsip*: Dilarang menyimpan data ke dalam JSON hanya karena mudah; gunakan JSON HANYA untuk data terstruktur yang bersifat variabel.

---

### 9. Critical MVP Constraints

1. **Strict 4 Physical Tables Cap**: Tepat 4 tabel fisik newsletter untuk versi MVP.
2. **Cluster Source Traceability**: Setiap artikel terbit wajib merujuk ke `story_cluster_id` sumber.
3. **Verified Fact Sheet Mandatory**: Setiap `story_cluster` wajib mengantongi `verified_fact_sheet_json` yang valid.
4. **No AI Fact Fabrication**: Interpretasi editorial AI dilarang keras dianggap sebagai fakta terverifikasi.
5. **No Duplicate Raw FPL Data**: Data mentah FPL tidak diduplikasi secara penuh ke tabel newsletter.
6. **Append-Only Fact Checks**: Tabel `newsletter_fact_checks` bersifat *append-only*.
7. **Revision Loop Enabled**: `newsletter_articles` mendukung *Revision Loop* via Option A versioning.
8. **Strict Publication Gate**: HANYA artikel dengan `validation_status = 'PASS'` yang boleh dikaitkan ke `newsletter_issues`.
9. **Multi-Article Support**: Satu `newsletter_issues` dapat menampung banyak artikel dari Tier 1 hingga Tier 4.
10. **Single Headline Rule**: Tier 1 Headline News secara normal maksimal **1 artikel per edisi issue**.
11. **End-to-End Auditability**: Seluruh konten terbit wajib dapat ditelusuri 100% kembali ke data sumber FPL mentah.

---

### 10. Final Field Summary

Ringkasan bidang konseptual per entitas:

#### `newsletter_story_clusters`
- *Essential Normal Fields*: `id`, `gw_number`, `primary_story_type`, `story_category`, `primary_manager_id`, `primary_detector`, `detection_summary`, `verified_source_context`, `impact_score`, `rarity_score`, `drama_score`, `historical_context_score`, `rivalry_score`, `entertainment_score`, `normalized_priority_score`, `recommended_tier`, `processing_status`, `created_at`, `updated_at`.
- *Essential JSON Fields*: `involved_managers_json`, `involved_players_json`, `triggered_detectors_json`, `verified_fact_sheet_json`, `fpl_source_references_json`.
- *Relationship Fields*: `gw_number`, `primary_manager_id`.
- *Status Fields*: `processing_status`.

#### `newsletter_articles`
- *Essential Normal Fields*: `id`, `logical_article_id`, `final_editorial_angle`, `narrative_theme`, `tone`, `title_direction`, `why_story_matters`, `final_tier`, `trash_talk_level`, `display_order`, `readiness_status`, `version`, `created_at`, `updated_at`.
- *Essential Content Fields*: `headline`, `subheadline`, `article_body`.
- *Essential JSON Fields*: `editorial_plan_details_json`, `key_facts_used_json`, `historical_context_used_json`, `fact_sheet_references_json`.
- *Versioning & Publication Fields*: `logical_article_id`, `version`, `story_cluster_id`, `issue_id`, `readiness_status`, `display_order`.

#### `newsletter_fact_checks`
- *Essential Normal Fields*: `id`, `article_id`, `version_tested`, `validation_status`, `overall_result`, `recheck_required`, `fact_validation_passed`, `context_validation_passed`, `safety_validation_passed`, `output_validation_passed`, `required_corrections_text`, `created_at`.
- *Essential Validation JSON*: `failed_validation_layers_json`, `detected_issues_json`, `related_facts_or_rules_json`.
- *Audit Fields*: `article_id`, `version_tested`, `validation_status`, `created_at`.

#### `newsletter_issues`
- *Essential Identity Fields*: `id`, `gw_number`, `issue_title`.
- *Publication Metadata Fields*: `issue_summary`, `issue_status`, `created_at`, `published_at`.
- *Status Fields*: `issue_status`.

---

### 11. Final Schema Readiness Checklist

- [x] Exactly 4 physical entities locked (`newsletter_story_clusters`, `newsletter_articles`, `newsletter_fact_checks`, `newsletter_issues`)
- [x] Raw FPL data remains source of truth
- [x] Story clusters contain verified editorial-ready fact context
- [x] Article revision strategy is locked (Option A — Multiple Rows for Version History)
- [x] Fact check audit trail is preserved (Append-Only)
- [x] Publication gate is enforceable (`readiness_status = 'APPROVED_PASS'`)
- [x] Multi-article issue is supported (One Issue → Many Articles)
- [x] Tier 1 through Tier 4 are supported
- [x] JSON usage is controlled and explicitly categorized
- [x] Schema remains lean for Supabase Free Plan
- [x] Ready for SQL implementation

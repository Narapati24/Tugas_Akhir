# MASTER CONTEXT TUGAS AKHIR

> **Tujuan dokumen:** Handover menyeluruh agar percakapan baru dapat langsung melanjutkan pendampingan Tugas Akhir Narapati tanpa mengulang konteks dari awal.
>
> **Aturan interpretasi:** Informasi bertanda **[AKTIF]** adalah keputusan/kondisi terbaru. Informasi bertanda **[OBSOLETE]** adalah keputusan lama yang tidak boleh dianggap masih berlaku. Informasi bertanda **[PERLU KONFIRMASI]** belum final atau perlu diverifikasi lebih lanjut.
>
> **Catatan penting:** Dokumen ini disusun berdasarkan konteks percakapan TA yang masih dapat diakses dan laporan TA terbaru yang diunggah. Jika ada konflik antara percakapan lama dan laporan terbaru, prioritaskan keputusan terbaru, tetapi beberapa bagian laporan terbaru sendiri diketahui masih mengandung konsep lama yang sedang dalam proses revisi.

---

# 1. Identitas dan Gambaran Umum TA

## 1.1 Identitas

**Nama:** Narapati Keysa Anandi
**NRP:** 22.304.0155
**Program Studi:** Teknik Informatika
**Fakultas:** Fakultas Teknik
**Universitas:** Universitas Pasundan Bandung

User merupakan mahasiswa tingkat akhir yang sedang mengerjakan Tugas Akhir dan mengembangkan aplikasi yang sudah dapat berjalan sebagai prototype.

---

## 1.2 Judul TA Terbaru

### [AKTIF]

**Implementasi Agen Berbasis Gemini untuk Perencanaan Napak Tilas Sejarah Otomatis Berdasarkan Literatur Sejarah**

Judul ini tercantum pada laporan TA terbaru yang diunggah user. 

---

## 1.3 Judul/Topik Sebelumnya

### [OBSOLETE]

Pada fase sebelumnya, TA pernah berfokus pada konsep seperti:

* PustakaBot.
* Agen percakapan cerdas.
* Rekomendasi buku.
* Google Books/Open Library.
* Konteks pendidikan/literasi.
* Agent Development Kit (ADK).

Beberapa sisa istilah lama sempat ditemukan dalam laporan dan telah dilakukan proses pembersihan.

**Penting:** Jangan menghidupkan kembali PustakaBot, rekomendasi buku, Google Books, Open Library, atau ADK kecuali user secara eksplisit mengubah keputusan.

---

## 1.4 Latar Belakang Penelitian

Penelitian berangkat dari masalah bahwa perencanaan kegiatan napak tilas sejarah masih banyak dilakukan secara manual.

Penyelenggara perlu:

* membaca literatur sejarah;
* mencari lokasi yang relevan;
* mengidentifikasi tokoh;
* mengidentifikasi peristiwa;
* menghubungkan lokasi dengan cerita sejarah;
* menentukan aktivitas;
* menyusun urutan perjalanan;
* memperkirakan durasi;
* membentuk itinerary yang dapat digunakan.

Proses tersebut membutuhkan waktu dan bergantung pada pengalaman penyelenggara.

Solusi yang dikembangkan adalah sistem berbasis AI yang menerima gambar halaman literatur sejarah, mengubahnya menjadi teks melalui OCR, mengekstraksi informasi sejarah menggunakan Gemini, memungkinkan validasi oleh pengguna, kemudian menghasilkan itinerary napak tilas.

Laporan terbaru menjelaskan masalah manual tersebut dan peluang penggunaan LLM/Gemini untuk mengolah informasi sejarah. 

---

## 1.5 Masalah Utama

Masalah penelitian terbaru mencakup:

1. Bagaimana mengubah halaman literatur sejarah menjadi data teks yang dapat diproses.
2. Bagaimana menggunakan LLM untuk mengekstraksi lokasi, tokoh, dan peristiwa sejarah.
3. Bagaimana menggunakan agen AI untuk menghasilkan itinerary.
4. Bagaimana menjaga keterkaitan antara hasil itinerary dan sumber literatur.
5. Bagaimana memungkinkan pengguna memvalidasi hasil ekstraksi sebelum itinerary dibuat.

Rumusan ini muncul dalam BAB III laporan terbaru. 

---

## 1.6 Tujuan Penelitian

Secara konseptual, tujuan terbaru adalah membangun prototype sistem yang mampu:

* menerima gambar halaman literatur sejarah;
* melakukan OCR;
* mengekstraksi informasi sejarah;
* mengidentifikasi lokasi, tokoh, peristiwa, konteks, dan aktivitas;
* memungkinkan pengguna memvalidasi hasil extraction;
* menghasilkan itinerary napak tilas otomatis;
* menyesuaikan itinerary dengan konfigurasi perjalanan;
* mempertahankan keterkaitan antara itinerary dan literatur sumber.

Laporan terbaru masih mencantumkan tujuan penerapan ReAct secara eksplisit. Bagian ini **masih perlu direvisi** karena implementasi aktual lebih menyerupai pipeline dua agen daripada implementasi penuh ReAct. 

---

## 1.7 Ruang Lingkup dan Batasan

### [AKTIF]

Sistem:

* berbasis web;
* menggunakan Gemini sebagai LLM;
* menerima maksimal 10 gambar halaman literatur per proses menurut laporan terbaru;
* menggunakan OCR untuk mengubah gambar menjadi teks;
* mengekstraksi lokasi, tokoh, peristiwa, konteks sejarah, dan aktivitas;
* menghasilkan itinerary;
* menyimpan hasil ke database;
* memiliki validasi hasil extraction oleh pengguna;
* menerima konfigurasi perjalanan;
* menyediakan tautan Google Maps yang dapat dibuka pengguna.

### Batasan penting

* Tidak memvalidasi kebenaran akademik seluruh isi buku.
* Informasi sejarah bertumpu pada literatur input.
* Belum melakukan optimasi rute berdasarkan kondisi lalu lintas real-time.
* Tidak menangani keseluruhan event management seperti pendaftaran dan pembayaran.

Laporan terbaru saat ini mengatakan sistem tidak melakukan integrasi navigasi pihak ketiga. Ini **tidak sepenuhnya sinkron dengan implementasi**, karena aplikasi sudah menyediakan link Google Maps yang dapat diklik. Narasinya perlu diperjelas menjadi bahwa sistem **tidak melakukan integrasi API navigasi/routing real-time**, tetapi dapat menyediakan tautan menuju Google Maps. 

---

# 2. Konsep dan Ide Utama Sistem

## 2.1 Sistem yang Dibangun

### [AKTIF]

Sistem adalah:

> **Aplikasi Perencanaan Napak Tilas Sejarah Otomatis berbasis AI yang mengubah literatur sejarah menjadi itinerary perjalanan yang terstruktur dan dapat ditelusuri kembali ke sumber literatur.**

Nilai penting sistem bukan sekadar "Gemini membuat itinerary".

Pipeline-nya adalah:

**Literatur sejarah → OCR → Information Extraction → Human Validation → Trip Configuration → Itinerary Generation**

---

## 2.2 Target Pengguna

Target utama adalah pihak yang melakukan perencanaan kegiatan napak tilas sejarah.

Konteks penelitian menyebut penyelenggara kegiatan dan komunitas sejarah, khususnya Komunitas Aleut Bandung dalam konteks observasi/wawancara.

[PERLU KONFIRMASI] apakah target pengguna final harus ditulis khusus sebagai Komunitas Aleut Bandung atau lebih umum sebagai penyelenggara kegiatan napak tilas sejarah.

---

## 2.3 Alur Sistem Aktual

### Tahap 1: Upload

Pengguna mengunggah satu atau beberapa gambar halaman buku/literatur sejarah.

Aplikasi mendukung multiple images.

---

### Tahap 2: OCR

Backend menjalankan:

**Tesseract OCR melalui Pytesseract**

Output:

`raw_ocr_text`

OCR dilakukan secara lokal/offline.

Keputusan menggunakan OCR lokal muncul karena user memang meminta penggunaan Tesseract.

---

### Tahap 3: Historical Extraction Agent

Raw OCR text dikirim ke Gemini.

Agen melakukan structured information extraction terhadap:

* nama lokasi;
* konteks sejarah;
* source excerpt;
* related events;
* related figures;
* suggested activities.

Output menggunakan structured JSON/Pydantic.

---

### Tahap 4: Human Validation

Pengguna masuk ke halaman:

`/extract-review/[id]`

Pengguna dapat:

* mengubah nama lokasi;
* mengubah konteks sejarah;
* memeriksa kutipan OCR;
* menambah/menghapus peristiwa;
* menambah/menghapus tokoh;
* menambah/menghapus aktivitas;
* menghapus lokasi;
* menambah lokasi baru.

Ini merupakan keputusan penting. Awalnya sempat dipertanyakan apakah extraction langsung masuk itinerary atau editable. Keputusan akhirnya adalah **editable extraction wajib ada**.

---

### Tahap 5: Trip Configuration

Pengguna menentukan:

* participant count;
* event date;
* start time;
* end time;
* start location;
* budget opsional;
* additional notes.

Penambahan **jam mulai dan jam selesai** merupakan keputusan baru setelah user menyadari itinerary harus memiliki batas waktu yang jelas.

---

### Tahap 6: Itinerary Planning Agent

Data extraction yang sudah divalidasi + konfigurasi perjalanan diberikan kepada agen kedua.

Agen menghasilkan itinerary.

Output per aktivitas mencakup setidaknya:

* waktu;
* durasi;
* lokasi;
* aktivitas;
* konteks sejarah;
* source excerpt;
* event/peristiwa;
* tokoh;
* Google Maps link.

---

### Tahap 7: Hasil dan Riwayat

Itinerary disimpan di database dan dapat dilihat kembali melalui halaman riwayat.

Aplikasi juga memiliki opsi cetak itinerary.

---

## 2.4 Teknologi

### [AKTIF]

**Frontend**

* Next.js 14
* App Router
* React
* TailwindCSS
* TypeScript
* Port pengembangan yang pernah disebut: `3000`

**Backend**

* Python
* FastAPI
* Uvicorn
* Port pengembangan yang pernah disebut: `8000`

**Database**

* SQLite
* SQLAlchemy ORM
* Nama database yang pernah disebut: `napak_tilas.db`

**OCR**

* Tesseract OCR
* Pytesseract

**AI**

* Google Gemini API
* Model: `gemini-2.5-flash`

**Structured Output**

* Pydantic

---

## 2.5 Agent Architecture

### [AKTIF]

Ada dua logical agent:

### HistoricalExtractionAgent

Tugas:

* menerima raw OCR text;
* menemukan lokasi sejarah;
* menghasilkan konteks sejarah;
* mengambil source excerpt;
* mengidentifikasi events;
* mengidentifikasi figures;
* menyarankan activities.

Temperature yang pernah digunakan/didesain:

`0.2`

Tujuannya mengurangi kreativitas dan meningkatkan konsistensi extraction.

---

### ItineraryPlanningAgent

Tugas:

* menerima validated extraction;
* menerima trip configuration;
* menyusun itinerary;
* menjaga batas start/end time;
* menentukan durasi;
* membuat deskripsi kegiatan;
* menghubungkan aktivitas dengan konteks sejarah;
* menghasilkan link Google Maps.

Temperature yang pernah digunakan/didesain:

`0.5`

---

## 2.6 Autonomous Agent

### [PERLU KONFIRMASI DEFINISI]

Sistem disebut menggunakan agen berbasis LLM.

Namun, implementasi aktual tidak boleh otomatis disebut "autonomous agent penuh" tanpa justifikasi.

Sistem lebih tepat saat ini digambarkan sebagai:

> pipeline berbasis dua agen LLM dengan pembagian tanggung jawab extraction dan itinerary planning.

Ada human-in-the-loop melalui validation stage.

---

## 2.7 ReAct

### [PERLU REVISI]

ReAct masih tercantum kuat dalam laporan terbaru sebagai metode/arsitektur agen.

Contohnya laporan menyebut ReAct digunakan untuk menganalisis OCR dan menghasilkan itinerary secara bertahap. 

Namun berdasarkan implementasi aktual yang telah dibahas:

* tidak ada siklus eksplisit Thought → Action → Observation yang lengkap;
* tidak ada implementasi tool loop yang jelas;
* arsitektur lebih dekat ke multi-stage/multi-agent pipeline.

Keputusan kerja terbaru adalah:

> ReAct, jika tetap dipertahankan, sebaiknya diposisikan sebagai **landasan konseptual reasoning**, bukan klaim implementasi ReAct penuh.

Ini belum selesai direvisi di seluruh dokumen.

---

## 2.8 ADK

### [OBSOLETE]

Google Agent Development Kit sempat direncanakan/dibahas.

Keputusan final:

> **ADK tidak digunakan.**

Jangan memasukkan ADK sebagai teknologi aktif.

---

## 2.9 RAG

### [OBSOLETE / TIDAK DIGUNAKAN]

Tidak ada RAG dalam arsitektur aktif.

Sistem memproses literatur yang diunggah pengguna langsung melalui OCR dan Gemini.

Jangan mengarang vector database, embeddings, retrieval pipeline, atau knowledge base.

---

# 3. Metodologi Penelitian

## 3.1 Metodologi Utama

### [AKTIF]

User menegaskan sejak awal ingin menggunakan:

> **Prototyping**

Metode pengembangan sistem harus konsisten dengan Prototyping.

---

## 3.2 Masalah Metodologi Saat Ini

Narasi laporan terbaru masih terasa seperti:

* studi literatur;
* analisis kebutuhan;
* perancangan;
* implementasi;
* testing;
* evaluasi.

Struktur ini secara praktik masih terlihat linear, hampir seperti Waterfall.

Padahal user ingin Prototyping.

Laporan memang sudah menyebut "metodologi prototyping", tetapi iterasinya belum tergambarkan kuat. 

---

## 3.3 Rencana Penguatan Prototyping

### [DIRENCANAKAN]

Perlu menunjukkan siklus:

Communication
↓
Quick Plan
↓
Quick Design
↓
Build Prototype
↓
User Evaluation
↓
Refinement
↓
Final Prototype

Lalu dikaitkan dengan evolusi sistem aktual.

Contoh rekonstruksi iterasi yang pernah dibahas:

* Prototype awal: OCR + extraction.
* Iterasi berikutnya: validation.
* Iterasi berikutnya: trip configuration.
* Penambahan start time/end time.
* Penambahan source excerpt/traceability.
* Penambahan Google Maps.
* Final prototype: end-to-end itinerary + history/riwayat.

Urutan iterasi ini perlu disesuaikan dengan sejarah pengembangan nyata sebelum dimasukkan sebagai fakta penelitian.

---

## 3.4 Pengujian Sistem

### [AKTIF SECARA KONSEP, BELUM FINAL SECARA METRIK]

Laporan terbaru sudah merencanakan:

* Pengujian OCR.
* Pengujian Information Extraction.
* Pengujian Itinerary.

Tahap pengujian ini muncul pada skema penelitian. 

Namun metode pengukuran kuantitatifnya belum matang.

---

## 3.5 Evaluasi LLM

### [BARU DIRENCANAKAN]

Arahan dosen terbaru:

> Output LLM harus diuji/divalidasi. Harus ada cara untuk mengukur seberapa valid output AI.

User mendapat rekomendasi dari teman untuk menggunakan:

> **Precision@K**

Keputusan penggunaan Precision@K **belum final** dan masih harus divalidasi kesesuaiannya.

Rencana sementara:

* Tambahkan teori evaluasi LLM/Information Extraction di BAB II.
* Tambahkan instrumen pengujian/validasi di BAB III.
* Gunakan hasilnya di BAB implementasi/evaluasi.

### Catatan kritis

Precision@K mungkin cocok untuk menilai daftar item hasil extraction jika sistem menghasilkan ranked/top-K results.

Namun output sistem saat ini berupa structured extraction:

* lokasi;
* tokoh;
* peristiwa.

Belum jelas apakah item benar-benar memiliki ranking.

Karena itu perlu dipertimbangkan apakah:

* Precision;
* Recall;
* F1-score;

lebih tepat dibanding Precision@K.

Ini adalah **open question penting**.

Jangan otomatis mengunci Precision@K hanya karena direkomendasikan teman.

---

## 3.6 Evaluasi OCR

### [BELUM FINAL]

Perlu ditentukan apakah OCR diuji menggunakan:

* Character Error Rate (CER);
* Word Error Rate (WER);
* character accuracy;
* word accuracy;
* atau manual verification.

Belum ada keputusan final.

---

## 3.7 Evaluasi Itinerary

### [BELUM FINAL]

Belum ditentukan metrik formal untuk mengukur kualitas itinerary.

Kemungkinan pendekatan:

* expert judgement;
* rule-based validation;
* checklist kesesuaian;
* validasi pengguna/domain expert.

Belum final.

---

# 4. Struktur dan Status Dokumen TA

# BAB I

## Isi yang Sudah Ada

* Latar Belakang.
* Identifikasi Masalah.
* Tujuan Tugas Akhir.
* Lingkup Tugas Akhir.
* Metode Pelaksanaan Tugas Akhir.
* Standar dan Kakas.
* Sistematika Penulisan.

---

## Revisi yang Pernah Dilakukan

* Menghapus konteks PustakaBot/rekomendasi buku.
* Mengubah fokus menjadi napak tilas sejarah.
* Menyesuaikan tujuan.
* Menyesuaikan scope.
* Menyesuaikan teknologi dengan aplikasi aktual.
* Menambahkan OCR, Gemini, dan itinerary.
* Metodologi diarahkan ke Prototyping.

---

## Masalah yang Masih Ada

1. Klaim ReAct masih terlalu kuat.
2. Metodologi Prototyping belum menunjukkan iterasi.
3. Scope Google Maps belum sinkron dengan aplikasi.
4. Kontribusi traceability perlu dibuat lebih eksplisit.
5. Pengujian output AI perlu disebut lebih jelas setelah metode evaluasi final.

---

## Status

### [PERLU REVISI TERARAH]

Tidak perlu ditulis ulang total.

---

# BAB II

## Teori Saat Ini

Laporan terbaru memuat:

1. Large Language Model (LLM).
2. Google Gemini.
3. Agen Berbasis Large Language Model.
4. Reasoning and Acting (ReAct).
5. Optical Character Recognition (OCR).
6. Information Extraction.
7. Prompt Engineering.
8. Napak Tilas Sejarah.
9. Itinerary.

Daftar ini terlihat pada struktur laporan terbaru. 

---

## Teori yang Perlu Ditambahkan

### Prioritas utama

**Evaluasi output LLM/Information Extraction**

Kandidat:

* Precision;
* Recall;
* F1-score;
* Precision@K jika memang sesuai.

### Potensial

* Multi-Agent System / LLM-based multi-agent architecture.
* Traceability/provenance pada AI-generated output.
* Evaluasi OCR.

---

## Teori yang Dihapus/Diganti

### [OBSOLETE]

* ADK.
* Google Books.
* Open Library.
* PustakaBot.
* Teori yang hanya relevan ke rekomendasi buku.

---

## ReAct

### [PERLU REVISI]

Masih ada sebagai subbab teori.

Belum diputuskan apakah:

* tetap menjadi teori konseptual;
* diturunkan klaimnya;
* atau dihapus sepenuhnya.

Kecenderungan keputusan terbaru: **tetap dapat digunakan sebagai landasan konseptual reasoning, tetapi jangan mengklaim implementasi ReAct penuh**.

---

## Penelitian Terdahulu

Versi terbaru berisi:

* Kasneci dkk., 2023.
* Gemini Team, 2023.
* Xu et al., 2024.
* Xi dkk., 2025.
* Yao dkk., 2022.
* Yulistio dkk., 2025.

Penelitian terdahulu sudah dibersihkan dari narasi PustakaBot.

---

## Status

### [PERLU TAMBAHAN]

Fokus berikutnya adalah teori evaluasi AI.

---

# BAB III

## Isi Saat Ini

* Alur Penyelesaian Tugas Akhir.
* Perumusan Masalah.
* Analisis Masalah.
* Solusi Masalah.
* Skema Analisis.
* Profil Tempat Penelitian.
* Teknik Pengumpulan Data.
* Instrumen Pengumpulan Data.
* Instrumen Penelitian.
* Instrumen Validasi Sistem.

Struktur ini terlihat pada daftar isi laporan terbaru. 

---

## Diagram/Model

Yang pernah dibahas/digunakan:

* Fishbone Analisis Masalah.
* Fishbone Solusi Masalah.
* Skema Analisis.
* Alur Penyelesaian Tugas Akhir.

---

## Instrumen Penelitian

Ada:

* Instrumen Observasi.
* Instrumen Wawancara.
* Instrumen Dokumentasi.
* Instrumen Validasi Sistem.

---

## Pengujian

Skema penelitian sudah menyebut:

* Pengujian OCR.
* Pengujian Information Extraction.
* Pengujian Itinerary.

Namun metode pengukuran belum final.

---

## Masalah

1. Prototyping belum tercermin sebagai siklus iteratif.
2. Instrumen validasi AI perlu diperjelas.
3. Ground truth perlu didefinisikan.
4. Precision@K atau metrik alternatif perlu diputuskan.
5. Karakteristik data/dataset perlu dijelaskan lebih eksplisit.

---

## Status

### [PERLU REVISI CUKUP PENTING]

BAB III menjadi salah satu fokus revisi berikutnya.

---

# BAB IV

## Isi Aktual dalam Laporan Terbaru

Laporan terbaru menggunakan BAB IV sebagai:

> **Analisis & Perancangan**

Subbagian:

* 4.1 Analisis.
* 4.1.1 Graphical Abstract.
* 4.1.2 Teknik Analisis.
* 4.1.3 Analisis Kebutuhan Solusi.
* 4.1.4 Analisis Kebutuhan Fungsional.
* 4.2 Perancangan Sistem.
* 4.2.1 Perancangan Arsitektur Sistem.
* 4.2.2 Perancangan Alur Kerja Agen AI.
* 4.2.3 Perancangan Basis Data.
* 4.2.4 Perancangan Prompt dan Persona Pattern.
* 4.2.5 Perancangan Antarmuka Pengguna.
* 4.3 Kesimpulan Sementara.
* 4.4 Referensi.



---

## Bagian yang Sudah Direvisi

* Graphical Abstract sudah ada.
* ERD sudah ada.
* Sequence Diagram sudah dibahas.
* Prompt design sudah disesuaikan.
* 4.2.4 pernah diminta mengikuti struktur contoh milik "Dika":

  * Persona.
  * Pemicu Interaksi.
  * Tujuan Prompt.
  * System Prompt/template dasar.
* Screenshot UI sudah tersedia.
* Arsitektur sudah ada.

---

## Status

### [CUKUP MATANG, TETAPI PERLU SINKRONISASI]

Yang perlu diperiksa:

* klaim ReAct;
* dua-agent pipeline;
* Google Maps;
* source excerpt;
* human validation;
* evaluasi AI jika desain pengujian perlu masuk.

---

# BAB V

## Rencana

Menurut sistematika laporan:

> BAB V: Implementasi dan Evaluasi.

Direncanakan memuat:

* Implementasi OCR.
* Integrasi Google Gemini.
* Historical Extraction Agent.
* Itinerary Planning Agent.
* Database.
* Studi kasus literatur sejarah.
* Hasil pengujian.



---

## Status

### [BELUM DIKERJAKAN LENGKAP]

Aplikasi sudah berjalan sehingga bahan implementasi tersedia.

Namun evaluasi formal masih perlu dirancang sebelum BAB V dapat diselesaikan dengan kuat.

---

# 5. Feedback dan Arahan Dosen

## 5.1 Desain Sistem Sudah Cukup

Bapak Handoko menyampaikan secara substansi:

> Desain sudah komplit dan detail. Alurnya dapat dipahami.

Fokus berikutnya adalah melakukan implementasi dan melihat hasil.

### Status

Sudah ditindaklanjuti.

Aplikasi prototype sekarang sudah berjalan.

---

## 5.2 Demonstrasikan Buku → Sistem → Itinerary

Dosen meminta:

* ambil buku;
* gunakan beberapa halaman;
* proses dengan sistem;
* lihat apakah menghasilkan itinerary.

### Status

### [SEBAGIAN SELESAI]

Sistem sudah mampu menjalankan flow.

User berencana menunjukkan studi kasus OCR → extraction → itinerary langsung kepada dosen.

Dataset/buku final untuk pengujian formal masih perlu dipastikan.

---

## 5.3 Tidak Perlu UI Kompleks untuk Seminar

Dosen menyatakan prototype terbatas sudah cukup.

Tidak perlu:

* login;
* UI kompleks.

Yang penting:

* beberapa halaman discan;
* informasi napak tilas diekstraksi;
* itinerary dihasilkan.

### Dampak

MVP dikembangkan lebih cepat.

Namun user memilih membuat beberapa fitur tambahan karena waktu setelah seminar menuju sidang diperkirakan singkat.

---

## 5.4 Pengambilan Data Harus Nyata

Dosen menekankan:

* bukan hanya desain pengambilan data;
* harus ada hasil aktivitas pengambilan data;
* harus ada justifikasi kenapa data tersebut dipilih;
* buku diproses;
* hasil sistem ditunjukkan.

### Status

### [BELUM SEPENUHNYA SELESAI]

Perlu:

* menetapkan data/buku;
* menjelaskan karakteristik data;
* menjelaskan alasan pemilihan;
* melakukan pengujian.

---

## 5.5 Scope Seminar Bisa Dipotong

Dosen mengatakan untuk seminar cukup sampai:

* data buku;
* diproses sistem;
* menghasilkan output.

Bagian lebih sophisticated dapat dilanjutkan setelah seminar menuju sidang.

### Dampak

User memilih tetap mengembangkan beberapa fitur sekarang karena waktu menuju sidang nanti singkat.

---

## 5.6 Feedback Terbaru: Output LLM Harus Divalidasi

### [PRIORITAS TERTINGGI SAAT INI]

Menurut user, dosen menyampaikan bahwa LLM perlu memiliki metode pengujian untuk mengetahui:

> seberapa valid output yang dihasilkan.

Evaluasi ini perlu dimasukkan ke:

* teori yang digunakan;
* instrumen pengumpulan/penelitian/validasi.

User mendapat rekomendasi dari teman untuk menggunakan Precision@K.

### Status

### [BELUM DIKERJAKAN]

Perlu menentukan metrik yang paling tepat terlebih dahulu.

---

# 6. Keputusan Penting yang Sudah Dibuat

1. **[AKTIF] Judul:** Implementasi Agen Berbasis Gemini untuk Perencanaan Napak Tilas Sejarah Otomatis Berdasarkan Literatur Sejarah.

2. **[AKTIF] Metode pengembangan:** Prototyping.

3. **[AKTIF] OCR:** Tesseract/Pytesseract lokal.

4. **[AKTIF] LLM:** Google Gemini.

5. **[AKTIF] Model:** Gemini 2.5 Flash.

6. **[AKTIF] Backend:** FastAPI/Python.

7. **[AKTIF] Frontend:** Next.js 14/React/Tailwind/TypeScript.

8. **[AKTIF] Database:** SQLite + SQLAlchemy.

9. **[AKTIF] Agent:** Historical Extraction Agent + Itinerary Planning Agent.

10. **[AKTIF] Human-in-the-loop:** Hasil extraction dapat diedit sebelum itinerary.

11. **[AKTIF] Trip configuration:** start/end time, date, participant count, start location, optional budget/notes.

12. **[AKTIF] Traceability:** source excerpt dan konteks sejarah dipertahankan hingga itinerary.

13. **[AKTIF] Maps:** link Google Maps tersedia dan dapat dibuka.

14. **[OBSOLETE] ADK:** tidak digunakan.

15. **[OBSOLETE] RAG:** tidak digunakan.

16. **[OBSOLETE] PustakaBot:** bukan sistem aktif.

17. **[PERLU REVISI] ReAct:** jangan mengklaim implementasi penuh tanpa bukti arsitektural.

18. **[BELUM FINAL] Evaluasi LLM:** Precision@K sedang dipertimbangkan.

---

# 7. Riwayat Perubahan Penting

### Sistem rekomendasi buku/PustakaBot

**PustakaBot dan rekomendasi buku → scope TA berubah → sistem napak tilas sejarah otomatis berbasis literatur.**

### ADK

**Menggunakan Google ADK → implementasi tidak membutuhkan/akhirnya tidak menggunakan ADK → [OBSOLETE] ADK dihapus dari teknologi aktif.**

### OCR

**Pemrosesan dokumen berbasis AI saja → kebutuhan OCR lokal → [AKTIF] Tesseract/Pytesseract digunakan.**

### Extraction

**AI langsung memproses hasil → kebutuhan validasi → [AKTIF] pengguna dapat mengedit hasil extraction.**

### Itinerary

**Itinerary generik → kebutuhan jadwal realistis → [AKTIF] ditambahkan start time dan end time.**

### Duration

**Durasi deskriptif → kebutuhan waktu yang jelas → itinerary menggunakan waktu dan durasi aktivitas.**

### Maps

**Lokasi hanya berupa teks → pengguna perlu navigasi → [AKTIF] Google Maps link ditambahkan.**

### Historical context

**Itinerary hanya mengarahkan ke lokasi → muncul masalah "kenapa pengguna pergi ke sini?" → [AKTIF] setiap aktivitas harus memiliki konteks sejarah/source relation.**

### Traceability

**AI menghasilkan rekomendasi → risiko tidak jelas asal rekomendasinya → [AKTIF] source excerpt dipertahankan sebagai dasar keterlacakan.**

### ReAct

**[OBSOLETE SEBAGAI KLAIM KUAT] Implementasi ReAct penuh → implementasi aktual tidak menunjukkan siklus ReAct eksplisit → [AKTIF/PERLU REVISI] gunakan sebagai landasan reasoning jika tetap dipertahankan.**

### Metodologi

**Narasi proses linear → user menegaskan dari awal menggunakan Prototyping → [AKTIF] Prototyping harus diperkuat dengan iterasi nyata.**

### Evaluasi AI

**Demo output AI saja → feedback dosen bahwa validitas output harus diukur → [AKTIF] perlu metode evaluasi LLM/Information Extraction.**

---

# 8. Kondisi TA Saat Ini

## Yang Baru Selesai

* Prototype aplikasi sudah berjalan.
* OCR → extraction → validation → trip configuration → itinerary sudah dapat dilakukan.
* UI sudah tersedia.
* ERD sudah ada.
* Graphical Abstract sudah ada.
* Sequence Diagram sudah dibahas/dibuat.
* Prompt design sudah diperbaiki.
* Abstrak Indonesia sudah direvisi.
* Abstrak Inggris pernah diminta direvisi.
* Penelitian terdahulu sudah dibersihkan dari konteks PustakaBot.
* BAB I-IV sudah memiliki isi.

---

## Yang Sedang Direvisi

Fokus terbaru:

> **Memperkuat metodologi dan evaluasi akademik sistem AI.**

Secara khusus:

* teori evaluasi output LLM;
* instrumen validasi;
* metode/metrik pengujian;
* Prototyping;
* ReAct;
* sinkronisasi laporan dengan implementasi aktual.

---

## Masalah Saat Ini

Masalah terbesar bukan lagi "aplikasinya belum ada".

Masalah sekarang:

> **Bagaimana membuktikan secara akademik bahwa output AI valid/berkualitas.**

---

# 9. Prioritas Pekerjaan Selanjutnya

## 1. SANGAT MENDESAK

### A. Tentukan metode evaluasi Information Extraction

Evaluasi kandidat:

* Precision;
* Recall;
* F1-score;
* Precision@K.

**Dependency:** Harus menentukan bentuk ground truth dan unit evaluasi.

Contoh unit:

* lokasi;
* tokoh;
* peristiwa.

---

### B. Tambahkan teori evaluasi ke BAB II

Setelah metrik final dipilih.

Jangan menulis subbab Precision@K sebelum yakin memang cocok.

---

### C. Revisi Instrumen Validasi Sistem BAB III

Harus menjelaskan:

* data uji;
* ground truth;
* prosedur pengujian;
* metrik;
* cara menghitung.

---

## 2. PENTING

### D. Perkuat Prototyping

Buat iterasi pengembangan nyata.

### E. Revisi klaim ReAct

Audit seluruh dokumen.

### F. Definisikan Dataset

Jelaskan:

* buku;
* halaman;
* sumber;
* jumlah;
* alasan pemilihan.

### G. Tentukan evaluasi OCR

Pilih CER/WER/manual verification.

### H. Tentukan evaluasi itinerary

Kemungkinan expert judgement atau checklist.

---

## 3. BISA KEMUDIAN

* Tambahkan teori multi-agent.
* Tambahkan teori traceability/provenance.
* Tambahkan referensi heritage tourism.
* Tambahkan referensi itinerary planning.
* Polishing format.
* Perbaiki daftar tabel/gambar yang masih menampilkan `Error! Bookmark not defined.`

Catatan: laporan terbaru masih memiliki banyak bookmark error di Daftar Tabel dan Daftar Gambar. Ini kosmetik tetapi wajib dibereskan sebelum versi final. 

---

# 10. Open Questions / Hal yang Belum Diputuskan

1. **[PERLU KONFIRMASI] Apakah Precision@K benar-benar cocok?**

2. **[PERLU KONFIRMASI] Apa definisi ground truth extraction?**

   * Manual annotation oleh peneliti?
   * Divalidasi ahli sejarah?
   * Berdasarkan isi literal buku?

3. **[PERLU KONFIRMASI] Apakah lokasi, tokoh, dan peristiwa dihitung terpisah?**

4. **[PERLU KONFIRMASI] Bagaimana mengukur historical_context yang berbentuk teks bebas?**

5. **[PERLU KONFIRMASI] Bagaimana mengevaluasi itinerary?**

6. **[PERLU KONFIRMASI] Bagaimana mengukur OCR?**

7. **[PERLU KONFIRMASI] Buku/dataset final apa yang digunakan?**

8. **[PERLU KONFIRMASI] Berapa halaman/data uji yang cukup?**

9. **[PERLU KONFIRMASI] Apakah ReAct tetap berada di judul/substansi teori atau cukup sebagai landasan?**

10. **[PERLU KONFIRMASI] Apakah perlu istilah "multi-agent" secara formal?**

11. **[PERLU KONFIRMASI] Apakah traceability perlu menjadi subbab teori tersendiri?**

12. **[PERLU KONFIRMASI] Apakah validasi itinerary memerlukan ahli/domain expert dari komunitas sejarah?**

---

# 11. Informasi Teknis Penting

## Frontend

```text
Next.js 14
App Router
React
TypeScript
TailwindCSS
Port: 3000
```

## Backend

```text
Python
FastAPI
Uvicorn
Port: 8000
```

## Database

```text
SQLite
SQLAlchemy ORM
napak_tilas.db
```

### Tabel

#### historical_extraction

```text
id
source_title
raw_ocr_text
locations (JSON)
```

`locations` berisi:

```text
name
historical_context
source_excerpt
related_events
related_figures
suggested_activities
```

#### trip_configuration

```text
id
participant_count
event_date
start_time
end_time
start_location
budget
additional_notes
```

#### itinerary

```text
id
extraction_id
configuration_id
estimated_duration
estimated_cost
itinerary_result (JSON)
```

---

## OCR

```text
Tesseract OCR
Pytesseract
Local/offline OCR
```

---

## AI

```text
Google Gemini API
gemini-2.5-flash
```

Structured outputs:

```text
Pydantic
JSON
```

---

## Agent 1

```text
HistoricalExtractionAgent
temperature ≈ 0.2
```

Input:

```text
raw_ocr_text
```

Output:

```text
locations
historical_context
source_excerpt
related_events
related_figures
suggested_activities
```

---

## Agent 2

```text
ItineraryPlanningAgent
temperature ≈ 0.5
```

Input:

```text
validated locations
trip configuration
```

Output:

```text
summary
schedule
time
duration
location
activity
historical context
source excerpt
events
figures
maps link
```

---

## Halaman/Flow yang Diketahui

```text
/
Upload & OCR

/extract-review/[id]
Validation

/trip-config/[id]
Trip Configuration

/itinerary/[id]
Itinerary Result
```

Ada juga:

```text
Riwayat
Cetak Itinerary
```

---

## Prompting

Prompt design menggunakan pembagian peran/persona.

HistoricalExtractionAgent berperan sebagai:

* sejarawan;
* data miner/extractor.

ItineraryPlanningAgent berperan sebagai:

* perencana/pemandu perjalanan sejarah.

Prompt extraction menekankan source excerpt agar output dapat ditelusuri.

Prompt itinerary memiliki aturan waktu ketat agar aktivitas tidak melewati `end_time`.

---

## RAG

```text
Tidak digunakan.
```

## ADK

```text
Tidak digunakan.
```

## Deployment

```text
Belum ada informasi deployment final yang relevan.
```

## Repository

```text
Struktur repository lengkap belum tersedia dalam konteks ini.
```

---

# 12. File dan Dokumen Penting

## Laporan TA Terbaru

Nama file:

**`9 Proposal Tugas Akhir 2026 - Narapati Keysa Anandi 223040155(1).pdf`**

Status:

### [VERSI PALING BARU YANG DIUNGGAH DALAM PERCAKAPAN INI]

Isi:

* 55 halaman;
* BAB I-IV;
* abstrak;
* landasan teori;
* skema penelitian;
* analisis dan perancangan.

Judul:

**Implementasi Agen Berbasis Gemini untuk Perencanaan Napak Tilas Sejarah Otomatis Berdasarkan Literatur Sejarah**

Catatan:

File ini merupakan baseline laporan terbaru pada saat handover dibuat.

Namun, jangan berasumsi chat baru otomatis memiliki akses ke file tersebut. User perlu mengunggah ulang file jika chat baru membutuhkan pemeriksaan isi secara langsung.

---

## Screenshot Aplikasi

User pernah mengirim beberapa screenshot yang menunjukkan:

* halaman upload;
* halaman extraction validation;
* trip configuration;
* itinerary;
* historical context;
* source excerpt;
* events;
* figures;
* maps link;
* riwayat/cetak.

Screenshot membuktikan aplikasi sudah berjalan.

Chat baru mungkin tidak memiliki akses ke screenshot lama.

---

## Ringkasan Sistem

User pernah memberikan dokumen teks:

**Kesimpulan Sistem: Aplikasi Perencanaan Napak Tilas Sejarah Otomatis (MVP Seminar)**

Dokumen tersebut menjadi sumber penting untuk:

* tech stack;
* database;
* agent architecture;
* end-to-end flow.

---

# 13. Working Style untuk Chat Baru

User biasanya bekerja secara iteratif.

Pola kerja:

1. User mengirim bagian laporan.
2. ChatGPT mengevaluasi.
3. User meminta revisi satu bagian.
4. User copy-paste hasil ke Word.
5. User kembali dengan versi terbaru.
6. Proses berulang.

User sering meminta:

* "lanjut";
* "kita revisi satu-satu";
* "samain strukturnya kayak contoh";
* "kasih teks yang bisa langsung dicopy";
* "sitasi ini pakai referensi yang mana";
* "jangan kasih nomor referensi saja karena nomor di Mendeley bisa berbeda".

### Preferensi penting

Jika memberikan sitasi, sebutkan:

> **nama penulis + tahun + judul paper**

Jangan hanya:

> `[7]`

karena nomor bibliografi user bisa berubah.

### Jangan terlalu cepat mengubah keputusan

Sebelum mengusulkan perubahan besar:

* cek implementasi aktual;
* cek laporan terbaru;
* cek keputusan terbaru.

### Jangan menghidupkan konteks lama

Hindari:

* PustakaBot;
* rekomendasi buku;
* ADK;
* Google Books;
* Open Library;

kecuali user sendiri mengaktifkannya kembali.

### User ingin diskusi sebelum keputusan besar

Contohnya ketika membahas historical context pada itinerary, user meminta diskusi dulu sebelum implementasi.

Untuk keputusan metodologis seperti Precision@K, sebaiknya jelaskan kecocokan terlebih dahulu sebelum membuat teks final laporan.

### User ingin fokus satu per satu

Jangan sekaligus membombardir dengan 20 revisi jika sedang mengerjakan satu subbab.

Berikan:

> masalah → keputusan → teks revisi siap tempel.

### Aplikasi aktual adalah sumber kebenaran teknis

Jika laporan bertentangan dengan aplikasi, jangan memaksa aplikasi mengikuti laporan lama.

Biasanya:

> revisi laporan agar sesuai implementasi aktual,

kecuali perubahan aplikasi memang diperlukan secara akademik.

---

# 14. Executive Summary untuk AI

> **Jika kamu adalah AI yang baru menerima dokumen ini, berikut konteks minimum yang wajib kamu pahami sebelum membantu user.**

Narapati sedang mengerjakan TA berjudul **"Implementasi Agen Berbasis Gemini untuk Perencanaan Napak Tilas Sejarah Otomatis Berdasarkan Literatur Sejarah."**

Aplikasi prototype **sudah berjalan**.

Flow aktif:

```text
Upload gambar halaman literatur
↓
Tesseract OCR
↓
Historical Extraction Agent (Gemini)
↓
Structured extraction
↓
Human validation/editing
↓
Trip Configuration
↓
Itinerary Planning Agent (Gemini)
↓
Itinerary
↓
Historical context + source excerpt + events + figures + Maps link
↓
Database/Riwayat
```

Tech stack:

```text
Next.js 14
React
TypeScript
TailwindCSS
FastAPI
Python
SQLite
SQLAlchemy
Tesseract/Pytesseract
Gemini 2.5 Flash
Pydantic structured output
```

Ada dua agen:

```text
HistoricalExtractionAgent
ItineraryPlanningAgent
```

**ADK tidak digunakan.**

**RAG tidak digunakan.**

Metode pengembangan yang diinginkan user adalah:

```text
Prototyping
```

Namun laporan masih perlu diperkuat agar benar-benar menunjukkan siklus iterasi Prototyping.

**ReAct masih ada dalam laporan, tetapi implementasi aktual tidak menunjukkan implementasi ReAct penuh.** Jangan memperkuat klaim ReAct tanpa validasi. Arah revisi terbaru adalah memosisikan ReAct sebagai landasan konseptual reasoning atau mempertimbangkan reposisi lebih lanjut.

Nilai penting sistem adalah **traceability**: hasil itinerary memiliki hubungan dengan literatur melalui `source_excerpt`, konteks sejarah, tokoh, dan peristiwa.

Feedback dosen paling penting:

1. Desain sistem sudah cukup/detail.
2. Harus ada implementasi nyata buku → sistem → itinerary.
3. Data yang digunakan harus nyata dan pemilihannya harus dijustifikasi.
4. **Feedback terbaru: output LLM harus diuji agar dapat diketahui tingkat validitasnya.**

Masalah akademik paling mendesak saat ini adalah:

> **Menentukan metode evaluasi output AI.**

User mendapat rekomendasi teman menggunakan:

```text
Precision@K
```

Namun **Precision@K belum final**. Perlu dicek apakah tepat karena output HistoricalExtractionAgent berupa lokasi, tokoh, dan peristiwa yang belum tentu merupakan ranked top-K output. Pertimbangkan Precision, Recall, dan F1 jika lebih sesuai.

Setelah metrik diputuskan, pekerjaan berikutnya:

```text
1. Tambahkan teori evaluasi ke BAB II.
2. Tambahkan instrumen/metode validasi ke BAB III.
3. Tentukan ground truth.
4. Tentukan evaluasi OCR.
5. Tentukan evaluasi itinerary.
6. Perkuat narasi Prototyping.
7. Audit klaim ReAct.
8. Definisikan dataset/buku dan justifikasi pemilihannya.
9. Implementasikan hasil evaluasi di BAB V.
```

Jangan kembali membahas PustakaBot, rekomendasi buku, ADK, atau RAG sebagai arsitektur aktif.

**Titik kelanjutan percakapan yang paling tepat adalah:**

> **Diskusikan dan putuskan apakah Precision@K merupakan metrik yang tepat untuk mengevaluasi Historical Extraction Agent. Setelah itu, revisi teori BAB II dan instrumen validasi BAB III satu per satu.**

Itulah posisi TA saat handover ini dibuat.

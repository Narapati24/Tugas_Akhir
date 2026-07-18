# Kesimpulan Sistem: Aplikasi Perencanaan Napak Tilas Sejarah Otomatis (MVP Seminar)

Dokumen ini merangkum seluruh arsitektur, basis data, agen AI, dan alur kerja (workflow) dari aplikasi "Perencanaan Napak Tilas Sejarah Otomatis" yang telah dikembangkan sebagai Minimum Viable Product (MVP) untuk kebutuhan demonstrasi Tugas Akhir.

## 1. Tujuan Sistem
Sistem ini bertujuan untuk mengotomatisasi pembuatan jadwal perjalanan (itinerary) wisata sejarah (napak tilas) berdasarkan literatur mentah (foto buku/dokumen sejarah). Sistem ini dituntut untuk memiliki kemampuan **traceability** yang tinggi, yaitu setiap jadwal yang dihasilkan harus dapat dilacak kembali ke sumber sejarah aslinya (kutipan buku, tokoh, peristiwa).

## 2. Arsitektur & Teknologi (Tech Stack)
*   **Frontend**: Next.js 14 (App Router), React, TailwindCSS, TypeScript. (Berjalan di port `3000`).
*   **Backend**: FastAPI (Python), Uvicorn. (Berjalan di port `8000`).
*   **Database**: SQLite (`napak_tilas.db`) menggunakan SQLAlchemy ORM.
*   **OCR**: Tesseract OCR (Pytesseract) untuk pengenalan teks luring (offline) dari gambar.
*   **AI Engine**: Google Gemini API (`gemini-2.5-flash`) dengan pemanfaatan **Structured Outputs (Pydantic)** untuk memastikan respons agen AI selalu dalam format JSON baku yang dapat diproses sistem.

---

## 3. Alur Kerja Aplikasi (End-to-End Flow)

Sistem memproses masukan pengguna melalui 4 tahapan halaman utama:

1.  **Tahap 1: Upload & Ekstraksi OCR (`/`)**
    *   Pengguna mengunggah satu atau banyak foto halaman buku sejarah sekaligus.
    *   Sistem *backend* menggabungkan foto-foto tersebut dan menjalankan **Tesseract OCR** untuk mengubah gambar menjadi teks mentah (`raw_ocr_text`).
    *   Teks tersebut langsung dikirim ke agen AI pertama (**HistoricalExtractionAgent**).

2.  **Tahap 2: Validasi Ekstraksi AI (`/extract-review/[id]`)**
    *   AI mengembalikan daftar lokasi sejarah secara terstruktur.
    *   Pengguna ditampilkan antarmuka kartu *(card)* untuk setiap lokasi.
    *   Pengguna dapat **memvalidasi dan mengedit** hasil ekstraksi (memperbaiki nama lokasi, mengecek kutipan sumber dari buku, menambah/menghapus peristiwa dan tokoh terkait).

3.  **Tahap 3: Konfigurasi Perjalanan (`/trip-config/[id]`)**
    *   Pengguna mendefinisikan batas waktu dan parameter logistik untuk perjalanan.
    *   Input: *Tanggal Acara, Waktu Mulai (Start Time), Waktu Selesai (End Time), Lokasi Awal (Start Location), Jumlah Peserta,* dan *Catatan Tambahan.*

4.  **Tahap 4: Pembuatan Itinerary (`/itinerary/[id]`)**
    *   Data ekstraksi yang telah divalidasi dan konfigurasi perjalanan dikirim ke agen AI kedua (**ItineraryPlanningAgent**).
    *   AI menghasilkan jadwal bergaya *timeline* secara ketat sesuai batasan waktu pengguna.
    *   Hasil akhirnya mencakup jam kegiatan, durasi per kegiatan, konteks sejarah, kutipan asal buku, tautan Google Maps, serta rangkuman perjalanan yang disimpan persisten di *database*.

---

## 4. Skema Basis Data (Database Models)

Database menggunakan SQLite dengan 3 tabel utama yang saling berelasi:

### A. `historical_extraction`
Menyimpan data mentah dan hasil ekstraksi tahap pertama.
*   `id` (Integer, Primary Key)
*   `source_title` (String): Nama file gambar yang diunggah.
*   `raw_ocr_text` (Text): Teks mentah hasil bacaan OCR.
*   `locations` (JSON): Menyimpan *array of objects* dengan skema:
    *   `name` (String): Nama lokasi.
    *   `historical_context` (String): Cerita sejarah singkat di balik lokasi tersebut.
    *   `source_excerpt` (String): Kutipan **persis (exact match)** dari teks OCR yang mendasari ekstraksi.
    *   `related_events` (List of Strings): Peristiwa sejarah yang terkait.
    *   `related_figures` (List of Strings): Tokoh sejarah yang terlibat.
    *   `suggested_activities` (List of Strings): Saran kegiatan napak tilas.

### B. `trip_configuration`
Menyimpan batasan/konfigurasi waktu pengguna.
*   `id` (Integer, Primary Key)
*   `participant_count` (Integer)
*   `event_date` (String): Tanggal napak tilas (Format `YYYY-MM-DD`).
*   `start_time` (String): Jam mulai (Format `HH:MM`).
*   `end_time` (String): Jam harus selesai (Format `HH:MM`).
*   `start_location` (String): Titik temu/keberangkatan awal.
*   `budget` (Integer, opsional)
*   `additional_notes` (Text, opsional)

### C. `itinerary`
Menyimpan hasil akhir racikan jadwal yang siap pakai.
*   `id` (Integer, Primary Key)
*   `extraction_id` (Foreign Key -> `historical_extraction.id`)
*   `configuration_id` (Foreign Key -> `trip_configuration.id`)
*   `estimated_duration` (String): Total estimasi jam perjalanan.
*   `estimated_cost` (String)
*   `itinerary_result` (JSON): Struktur hasil *generate* AI yang berisi rangkuman (`summary`) dan jadwal detail (`schedule`). Setiap *item* jadwal (*schedule*) memiliki durasi spesifik, kutipan referensi, konteks, dan *link* navigasi.

---

## 5. Strategi Multi-Agent AI (Gemini)

Sistem ini menghindari pemanggilan satu *prompt* yang masif dengan cara membagi beban kognitif AI menjadi dua agen terpisah. Pendekatan ini secara drastis meningkatkan akurasi *output*.

### Agen 1: `HistoricalExtractionAgent`
*   **Peran**: Sebagai sejarawan dan *data miner*.
*   **Input**: Teks `raw_ocr_text`.
*   **Instruksi Utama**: Menemukan lokasi-lokasi penting dari teks. Agen ditugaskan secara eksplisit untuk **menyalin teks asli (source_excerpt)** untuk membuktikan bahwa AI tidak berhalusinasi dan lokasi tersebut benar-benar tertulis di buku.
*   **Konfigurasi Parameter**: Menggunakan `temperature = 0.2` karena tugas ini murni analitis (harus faktual dan tidak membutuhkan kreativitas).

### Agen 2: `ItineraryPlanningAgent`
*   **Peran**: Sebagai pemandu wisata logistik sejarah.
*   **Input**: `locations` (dari output Agen 1) dan Data Konfigurasi Perjalanan (`start_time`, `end_time`, dll).
*   **Instruksi Utama**: Meracik jadwal yang logis. Instruksinya menerapkan **"ATURAN WAKTU SANGAT KETAT"**, memaksa agen agar kegiatan tidak melampaui `end_time`. Agen ini juga bertugas memprediksi lama durasi per kegiatan (`duration_minutes`) dan merakit URL unik untuk **Google Maps** (`maps_link`).
*   **Konfigurasi Parameter**: Menggunakan `temperature = 0.5` agar AI bisa sedikit lebih luwes (kreatif) dalam mengarang deskripsi kegiatan dan memperkirakan jarak tempuh perjalanan antar lokasi tanpa menghilangkan landasan sejarahnya.

---

*Dokumen ini dirancang khusus untuk mempermudah penyusunan Bab 3 (Analisis dan Perancangan) serta Bab 4 (Implementasi) pada dokumen Tugas Akhir Anda.*

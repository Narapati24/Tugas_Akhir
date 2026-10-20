# PROJECT CONTEXT: NAPAK TILAS HISTORY PLANNER

## 1. Identitas Proyek

Nama proyek: Aplikasi Perencanaan Napak Tilas Sejarah Otomatis Berbasis Gemini.

Judul Tugas Akhir:
"Implementasi Agen Berbasis Gemini untuk Perencanaan Napak Tilas Sejarah Otomatis Berdasarkan Literatur Sejarah."

Tujuan utama:
Membangun aplikasi web yang mengubah literatur sejarah menjadi itinerary napak tilas yang terstruktur, dapat ditinjau pengguna, dan tetap memiliki keterkaitan dengan sumber literatur.

## 2. Status Aplikasi

Aplikasi SUDAH ADA dan sudah dapat berjalan sebagai prototipe.

Tugas kamu bukan membuat ulang aplikasi dari nol, bukan mengganti framework, dan bukan melakukan redesign besar-besaran tanpa alasan. Tugas kamu adalah mengaudit kode yang ada, memahami alur implementasi aktual, lalu melengkapi fitur yang belum sesuai dengan kebutuhan penelitian.

## 3. Teknologi yang Digunakan

Gunakan teknologi yang sudah ada di repository. Konteks teknologi saat ini:

- Frontend: Next.js 14, React, TypeScript, Tailwind CSS.
- Backend: Python, FastAPI, Uvicorn.
- Database: SQLite dengan SQLAlchemy ORM.
- OCR: Tesseract OCR melalui Pytesseract.
- LLM: Google Gemini API, model yang digunakan dalam rancangan saat ini adalah Gemini 2.5 Flash.
- Validasi data terstruktur: Pydantic.
- Penyimpanan hasil ekstraksi dan itinerary ke database.

Jangan mengganti stack teknologi kecuali ditemukan masalah nyata yang tidak dapat diselesaikan dengan arsitektur sekarang. Verifikasi versi dan implementasi aktual dari file proyek.

## 4. Alur Sistem Utama

Alur sistem yang diharapkan:

1. Pengguna mengunggah gambar halaman literatur sejarah.
2. Sistem mengekstraksi teks dari gambar menggunakan Tesseract OCR melalui Pytesseract.
3. Historical Extraction Agent memproses hasil OCR menggunakan Gemini.
4. Sistem menghasilkan informasi terstruktur yang mencakup:
   - Nama lokasi sejarah.
   - Konteks sejarah.
   - Kutipan teks sumber.
   - Peristiwa terkait.
   - Tokoh terkait.
   - Saran aktivitas.
5. Pengguna meninjau dan dapat mengedit hasil ekstraksi sebelum melanjutkan.
6. Pengguna mengisi konfigurasi perjalanan:
   - Jumlah peserta.
   - Tanggal kegiatan.
   - Waktu mulai.
   - Waktu selesai.
   - Lokasi awal.
   - Anggaran opsional.
   - Catatan tambahan.
7. Itinerary Planning Agent menerima hasil ekstraksi yang telah divalidasi dan konfigurasi perjalanan.
8. Sistem menghasilkan itinerary dengan urutan aktivitas, waktu, durasi, lokasi, konteks sejarah, kutipan sumber, tokoh, peristiwa, dan tautan Google Maps jika tersedia.
9. Sistem menampilkan dan menyimpan hasil itinerary serta mendukung riwayat dan pencetakan jika fitur tersebut sudah tersedia.

Pertahankan mekanisme validasi pengguna di antara ekstraksi dan penyusunan itinerary. Jangan menghilangkan langkah ini demi menyederhanakan implementasi.

## 5. Arsitektur Agen

Sistem menggunakan dua agen logis dengan pembagian tugas yang berbeda.

### Historical Extraction Agent

Input:
- Teks hasil OCR.

Tanggung jawab:
- Mengekstraksi informasi sejarah.
- Mengidentifikasi lokasi, tokoh, peristiwa, konteks sejarah, kutipan sumber, dan saran aktivitas.
- Menghasilkan keluaran terstruktur yang dapat divalidasi pengguna.

### Itinerary Planning Agent

Input:
- Hasil ekstraksi yang telah divalidasi pengguna.
- Konfigurasi perjalanan.

Tanggung jawab:
- Menyusun itinerary.
- Menentukan urutan kegiatan dan alokasi waktu.
- Menyesuaikan jadwal dengan waktu mulai dan selesai.
- Menghubungkan aktivitas dengan konteks sejarah.
- Menyertakan tautan Google Maps jika didukung implementasi.
- Menghasilkan estimasi biaya berdasarkan data dan asumsi yang tersedia.

Jangan menambahkan agen ketiga hanya untuk menangani estimasi biaya. Pertahankan dua agen utama, kecuali audit kode menunjukkan kebutuhan arsitektural yang benar-benar tidak dapat diatasi dengan desain saat ini.

## 6. Ruang Lingkup dan Batasan

Sistem berfokus pada:
- Pemrosesan literatur sejarah.
- Ekstraksi informasi sejarah.
- Validasi hasil ekstraksi oleh pengguna.
- Penyusunan itinerary.
- Estimasi durasi dan biaya perjalanan.
- Keterkaitan keluaran dengan literatur sumber.

Sistem tidak dimaksudkan untuk:
- Memvalidasi seluruh kebenaran sejarah secara akademik.
- Menjamin semua lokasi atau rute layak dilalui di lapangan.
- Melakukan optimasi rute berdasarkan kondisi lalu lintas real-time.
- Mengintegrasikan Google Maps Directions API atau routing API kompleks jika fitur tersebut memang belum tersedia.
- Menangani pembayaran, tiket, atau keseluruhan manajemen acara.

Tautan Google Maps yang dapat dibuka pengguna tidak sama dengan integrasi API navigasi atau optimasi rute.

## 7. Estimasi Biaya: Fitur yang Perlu Dilengkapi

Estimasi biaya merupakan bagian dari pengembangan yang ingin dilengkapi pada aplikasi yang sudah ada.

Konfigurasi perjalanan sudah dirancang untuk menerima jumlah peserta dan anggaran opsional. Itinerary Planning Agent perlu diperiksa agar prompt, model keluaran, penyimpanan, backend, dan halaman hasil itinerary mendukung estimasi biaya secara konsisten.

Komponen biaya yang dapat dipertimbangkan:
- Transportasi.
- Tiket masuk jika relevan dan tersedia.
- Komponen biaya lain yang relevan dengan kegiatan.

Ketentuan:
- Jangan mengarang tarif resmi.
- Jika harga aktual tidak tersedia, tandai sebagai estimasi dan tampilkan asumsi.
- Bedakan biaya per peserta dan biaya keseluruhan jika datanya mendukung.
- Periksa apakah biaya dihitung berdasarkan jumlah peserta.
- Jika anggaran diberikan, tampilkan perbandingan estimasi total dengan anggaran.
- Jika anggaran tidak diberikan, sistem tetap dapat menyusun estimasi jika informasi pendukung cukup.
- Jika informasi tidak cukup, tampilkan bahwa komponen tersebut belum dapat diperkirakan, bukan membuat angka palsu.
- Pastikan total biaya konsisten dengan rincian komponennya.
- Jangan menyatakan biaya telah diverifikasi jika sistem tidak memiliki sumber harga yang dapat diverifikasi.

Jangan menambahkan integrasi eksternal, layanan berbayar, atau API baru hanya untuk menghasilkan estimasi biaya. Mulai dari informasi yang tersedia dalam sistem dan kemampuan prompt Gemini.

## 8. Prinsip Implementasi

- Pertahankan struktur repository dan gaya kode yang sudah ada.
- Jangan menghapus fitur yang sudah berfungsi.
- Jangan mengarang fitur yang belum diimplementasikan.
- Jangan mengubah database secara destruktif.
- Jangan menaruh API key atau secret di frontend.
- Validasi masukan dan keluaran model.
- Tangani respons Gemini yang tidak valid dan kegagalan API.
- Jaga kompatibilitas data lama.
- Hindari perubahan yang tidak berkaitan dengan kebutuhan.
- Jangan mengklaim ReAct telah diterapkan secara penuh jika kode tidak menunjukkan siklus reasoning, action, dan observation yang eksplisit.

## 9. Prioritas

Prioritas pertama adalah mengaudit aplikasi yang sudah ada dan melengkapi estimasi biaya dari prompt sampai tampilan hasil.

Prioritas berikutnya adalah memastikan itinerary tetap mengikuti informasi sejarah yang telah divalidasi dan konfigurasi pengguna.

Seluruh perubahan harus dapat ditelusuri ke kebutuhan Tugas Akhir dan tidak boleh memperluas ruang lingkup penelitian tanpa alasan yang jelas.
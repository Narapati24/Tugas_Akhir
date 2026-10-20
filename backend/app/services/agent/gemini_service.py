from google import genai
from google.genai import types
from app.core.config import settings
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Ensure API Key is available
if not settings.GEMINI_API_KEY:
    # We will instantiate the client when called, but warn if no key
    print("Warning: GEMINI_API_KEY is not set in environment.")

client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
    http_options=types.HttpOptions(timeout=30000)
) if settings.GEMINI_API_KEY else None

class LocationExtractionItem(BaseModel):
    name: str
    historical_context: str
    source_excerpt: str
    related_events: list[str]
    related_figures: list[str]
    suggested_activities: list[str]

class ExtractionFormat(BaseModel):
    locations: list[LocationExtractionItem]

class CostBreakdownItem(BaseModel):
    category: str = Field(description="Kategori: 'transportasi', 'tiket_masuk', 'konsumsi', atau 'operasional_lainnya'")
    name: str = Field(description="Nama pengeluaran/kegiatan")
    estimated_amount: float = Field(
        default=0.0,
        description="Nominal harga/biaya SATUAN dalam IDR. JIKA unit_scope='per_peserta', isi harga untuk 1 ORANG saja (misal Rp 25.000, JANGAN dikalikan jumlah peserta). JIKA unit_scope='total_kelompok', isi total biaya untuk rombongan. Isi 0 jika gratis atau belum tersedia."
    )
    unit_scope: str = Field(description="Cakupan: 'per_peserta' (akan dikalikan jumlah peserta oleh sistem) atau 'total_kelompok' (biaya flat rombongan)")
    status: str = Field(description="Status: 'tersedia', 'estimasi', 'belum_tersedia', atau 'gratis'")
    note: str = Field(default="", description="Dasar asumsi, kutipan, atau alasan harga belum tersedia")

class CostEstimation(BaseModel):
    items: list[CostBreakdownItem]
    total_estimated_cost: float = Field(description="Total akumulasi nominal biaya kelompok dalam IDR")
    cost_per_participant: float = Field(description="Estimasi biaya per orang")
    currency: str = "IDR"
    summary_notes: str = Field(description="Penjelasan dasar perhitungan dan catatan")
    has_unknown_costs: bool = False  # True jika ada komponen yang statusnya belum_tersedia

class ScheduleItem(BaseModel):
    time: str
    duration_minutes: int
    activity: str
    location: str
    historical_context: str
    source_excerpt: str
    related_events: list[str]
    related_figures: list[str]
    maps_link: str

class ItineraryFormat(BaseModel):
    summary: str
    locations: list[str]
    activities: list[str]
    schedule: list[ScheduleItem]
    estimated_duration: str
    estimated_cost: str
    cost_estimation: Optional[CostEstimation] = None

FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite']

def call_gemini_with_fallback(**kwargs):
    last_err: Exception = RuntimeError("Semua model Gemini gagal merespons.")
    for model_name in FALLBACK_MODELS:
        try:
            kwargs['model'] = model_name
            return client.models.generate_content(**kwargs)
        except Exception as e:
            last_err = e
            clean_msg = str(e)
            if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in clean_msg:
                clean_msg = clean_msg.replace(settings.GEMINI_API_KEY, "***REDACTED***")
            print(f"Model {model_name} warning: {clean_msg}. Trying fallback model...")
            continue
    raise last_err

def ocr_with_gemini_vision(image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    """
    Fallback OCR using Gemini Vision if traditional Tesseract fails to detect text.
    """
    if not client:
        return ""
    try:
        if not mime_type or mime_type == "application/octet-stream":
            mime_type = "image/jpeg"
        part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        response = call_gemini_with_fallback(
            contents=[
                part,
                "Ekstrak dan salin seluruh teks yang tertulis pada gambar dokumen/buku sejarah ini apa adanya secara lengkap. Jangan menambahkan komentar pembuka atau penutup."
            ]
        )
        return (response.text or "").strip()
    except Exception as e:
        print(f"Gemini Vision OCR Error: {e}")
        return ""

def extract_historical_info(text: str) -> dict:
    """
    Agent 1: HistoricalExtractionAgent
    Extracts historical information from OCR text using Gemini structured outputs.
    """
    if not client:
        raise ValueError("Gemini Client not initialized. Check GEMINI_API_KEY.")

    prompt = f"""
    Anda adalah HistoricalExtractionAgent. Ekstrak entitas sejarah dari teks berikut menjadi format terstruktur yang kaya.
    Untuk setiap lokasi yang teridentifikasi, berikan nama lokasi, konteks sejarahnya, KUTIPAN LANGSUNG (source_excerpt) dari teks yang mendasari lokasi tersebut, tokoh yang terlibat, peristiwa yang terjadi, dan saran aktivitas napak tilas.
    SELURUH HASIL HARUS DALAM BAHASA INDONESIA. Kutipan (source_excerpt) harus disalin persis sesuai teks asli.
    
    Teks:
    {text}
    """

    response = call_gemini_with_fallback(
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ExtractionFormat,
            temperature=0.2,
        ),
    )
    
    if hasattr(response, 'parsed') and response.parsed:
        return response.parsed.model_dump()

    import json
    raw_text = (response.text or "{}").strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    return json.loads(raw_text.strip())

def validate_and_enrich_cost_estimation(itinerary_data: dict, trip_config: dict) -> dict:
    """
    Validates, normalizes, and enriches the cost estimation within itinerary_data.
    Ensures non-negative costs, mathematical consistency, participant multiplier,
    budget comparison, and proper unknown cost marking.
    """
    participant_count = trip_config.get("participant_count") or 1
    if participant_count < 1:
        participant_count = 1

    budget = trip_config.get("budget")
    if budget is not None:
        try:
            budget = float(budget)
        except (ValueError, TypeError):
            budget = None

    cost_data = itinerary_data.get("cost_estimation")
    if not isinstance(cost_data, dict):
        cost_data = {}

    raw_items = cost_data.get("items") or []
    normalized_items = []
    has_unknown = False
    calculated_total = 0.0

    for item in raw_items:
        if not isinstance(item, dict):
            continue
        category = str(item.get("category") or "operasional_lainnya").strip().lower()
        name = str(item.get("name") or "Komponen Biaya").strip()
        status = str(item.get("status") or "estimasi").strip().lower()
        unit_scope = str(item.get("unit_scope") or "total_kelompok").strip().lower()
        note = str(item.get("note") or "").strip()

        try:
            amount = float(item.get("estimated_amount", 0.0))
        except (ValueError, TypeError):
            amount = 0.0
        if amount < 0:
            amount = 0.0

        if status not in ["tersedia", "estimasi", "belum_tersedia", "gratis"]:
            status = "estimasi" if amount > 0 else "belum_tersedia"

        if status == "belum_tersedia":
            has_unknown = True
            unit_price = 0.0
            subtotal = 0.0
            if not note:
                note = "Informasi tarif/biaya belum tersedia dan memerlukan konfirmasi langsung di lokasi."
        elif status == "gratis":
            unit_price = 0.0
            subtotal = 0.0
            if not note:
                note = "Gratis / fasilitas ruang publik tanpa pungutan biaya tiket."
        else:
            unit_price = amount
            if unit_scope == "per_peserta":
                # Kontrak eksplisit: Biaya per peserta dikalikan jumlah peserta tepat satu kali
                subtotal = unit_price * participant_count
            else:
                # Kontrak eksplisit: Biaya total kelompok tidak dikalikan lagi
                unit_scope = "total_kelompok"
                subtotal = unit_price
            calculated_total += subtotal

        normalized_items.append({
            "category": category,
            "name": name,
            "unit_price": unit_price,
            "estimated_amount": unit_price,
            "unit_scope": unit_scope,
            "status": status,
            "subtotal": subtotal,
            "note": note
        })

    cost_per_participant = calculated_total / participant_count if participant_count > 0 else calculated_total

    if budget is not None:
        budget_diff = budget - calculated_total
        if budget_diff < 0:
            budget_status = "melebihi_anggaran"
        elif has_unknown:
            # Jika ada biaya yang belum diketahui, status belum lengkap (jangan nyatakan pasti aman)
            budget_status = "belum_lengkap"
        else:
            budget_status = "dalam_anggaran"
    else:
        budget_diff = None
        budget_status = "tanpa_anggaran"

    summary_notes = cost_data.get("summary_notes") or ""
    if not summary_notes or budget_status == "belum_lengkap":
        if budget is not None:
            if budget_status == "belum_lengkap":
                summary_notes = (
                    f"Biaya yang sementara teridentifikasi adalah Rp {calculated_total:,.0f} "
                    f"dari anggaran Rp {budget:,.0f} (sisa anggaran sementara Rp {budget_diff:,.0f}). "
                    f"Total akhir belum dapat dipastikan di bawah anggaran karena terdapat komponen "
                    f"yang belum diketahui tarif resminya."
                )
            elif budget_status == "dalam_anggaran":
                summary_notes = (
                    f"Berdasarkan perkiraan wajar komponen yang tersedia, total estimasi biaya perjalanan "
                    f"(Rp {calculated_total:,.0f}) berada dalam batas anggaran pengguna (Rp {budget:,.0f}) "
                    f"dengan potensi selisih hemat Rp {budget_diff:,.0f}."
                )
            else:
                summary_notes = (
                    f"Estimasi total biaya perjalanan (Rp {calculated_total:,.0f}) berpotensi melebihi "
                    f"anggaran pengguna (Rp {budget:,.0f}) sebesar Rp {abs(budget_diff):,.0f}."
                )
        else:
            summary_notes = f"Estimasi total biaya kelompok dihitung untuk {participant_count} peserta berdasarkan asumsi operasional umum."
            if has_unknown:
                summary_notes += " Perhatian: Sejumlah komponen belum memiliki informasi tarif resmi sehingga belum dimasukkan ke nominal total."
    elif budget_status == "belum_lengkap" and "belum dapat dipastikan" not in summary_notes and "belum diketahui" not in summary_notes:
        summary_notes += " Peringatan: Terdapat komponen biaya belum tersedia, sehingga status anggaran saat ini bersifat sementara."

    itinerary_data["cost_estimation"] = {
        "items": normalized_items,
        "total_estimated_cost": calculated_total,
        "cost_per_participant": round(cost_per_participant, 2),
        "currency": "IDR",
        "participant_count": participant_count,
        "user_budget": budget,
        "budget_difference": budget_diff,
        "budget_status": budget_status,
        "has_unknown_costs": has_unknown,
        "summary_notes": summary_notes
    }

    if calculated_total > 0:
        base_str = f"Rp {calculated_total:,.0f}".replace(",", ".")
        if has_unknown:
            itinerary_data["estimated_cost"] = f"{base_str} (Estimasi parsial untuk {participant_count} orang; terdapat komponen belum terkonfirmasi)"
        else:
            itinerary_data["estimated_cost"] = f"{base_str} (Estimasi total untuk {participant_count} orang)"
    else:
        if has_unknown:
            itinerary_data["estimated_cost"] = "Belum dapat dipastikan (informasi tarif belum tersedia)"
        else:
            itinerary_data["estimated_cost"] = "Rp 0 (Kegiatan gratis/tanpa pungutan biaya)"

    return itinerary_data

def generate_itinerary(extraction_data: dict, trip_config: dict) -> dict:
    """
    Agent 2: ItineraryPlanningAgent
    Generates a historical trail itinerary based on extraction data and trip config.
    """
    if not client:
        raise ValueError("Gemini Client not initialized. Check GEMINI_API_KEY.")

    participant_count = trip_config.get("participant_count") or 1
    budget = trip_config.get("budget")
    budget_info = f"Rp {budget:,.0f}" if budget is not None else "Tidak ditentukan / opsional"

    prompt = f"""
    Anda adalah ItineraryPlanningAgent, seorang perencana perjalanan napak tilas sejarah yang cermat, realistis, dan objektif.
    Tugas Anda adalah menyusun jadwal perjalanan napak tilas dan estimasi biaya berdasarkan data sejarah tervalidasi serta konfigurasi perjalanan pengguna.
    SELURUH HASIL, DESKRIPSI, RINGKASAN, AKTIVITAS, DAN CATATAN BIAYA HARUS DALAM BAHASA INDONESIA YANG BAIK DAN BENAR.

    Data Sejarah Tervalidasi:
    {extraction_data}

    Konfigurasi Perjalanan Pengguna:
    - Tanggal Acara: {trip_config.get("event_date")}
    - Waktu Mulai: {trip_config.get("start_time")}
    - Waktu Selesai: {trip_config.get("end_time")}
    - Lokasi Awal: {trip_config.get("start_location")}
    - Jumlah Peserta: {participant_count} orang
    - Anggaran Pengguna: {budget_info}
    - Catatan Tambahan: {trip_config.get("additional_notes") or "Tidak ada"}

    ATURAN WAKTU DAN JADWAL (SANGAT KETAT):
    - Jadwal harus HANYA untuk tanggal: {trip_config.get("event_date")}
    - Aktivitas pertama dimulai pada pukul: {trip_config.get("start_time")} dari/di {trip_config.get("start_location")}
    - Seluruh aktivitas harus selesai SEBELUM atau tepat pukul: {trip_config.get("end_time")}
    - Alokasikan waktu perjalanan dan istirahat yang realistis antar lokasi.
    - Untuk setiap item jadwal, tentukan perkiraan durasi kegiatan/perjalanan dalam menit ('duration_minutes').
    - Untuk setiap item jadwal, sertakan 'historical_context', 'source_excerpt', 'related_events', dan 'related_figures' yang diambil dari Data Sejarah.
    - Sediakan 'maps_link' pencarian Google Maps untuk lokasi tersebut (format: https://www.google.com/maps/search/?api=1&query=Nama+Lokasi). JANGAN pernah mengklaim tautan Google Maps ini sebagai bukti jarak tempuh aktual, navigasi turn-by-turn, atau optimasi rute lalu lintas real-time.

    ATURAN ESTIMASI BIAYA PERJALANAN (SANGAT PENTING):
    1. Rincian Komponen:
       - Pisahkan estimasi biaya berdasarkan komponen relevan: "transportasi" (misal sewa angkutan lokal / bbm), "tiket_masuk" (jika lokasi memiliki tiket resmi atau infak sukarela), "konsumsi" (makan siang / air mineral), atau "operasional_lainnya".
    2. Kejujuran Informasi & Pencegahan Halusinasi Tarif:
       - JANGAN mengarang tarif resmi, harga tiket, atau biaya transportasi yang tidak berdasar.
       - Jika suatu komponen TIDAK memiliki informasi harga yang dapat diandalkan, tandai dengan status: "belum_tersedia", estimated_amount: 0, dan jelaskan di 'note' bahwa harga belum diketahui atau harus dikonfirmasi di lokasi. JANGAN menganggap komponen tersebut gratis (Rp 0) hanya karena harganya belum diketahui.
       - Jika lokasi memang terbuka umum dan gratis (seperti monumen terbuka/alun-alun), gunakan status: "tersedia" atau "gratis", estimated_amount: 0, dan tuliskan keterangan bahwa lokasi bebas tiket.
       - Jika biaya berupa estimasi standar umum (seperti konsumsi atau parkir), gunakan status: "estimasi" dan jelaskan dasar perhitungannya di 'note'.
    3. Perhitungan Jumlah Peserta ({participant_count} orang):
       - 'unit_scope': gunakan "per_peserta" untuk biaya individu per orang (tiket masuk, konsumsi per orang), atau "total_kelompok" untuk biaya bersama rombongan (sewa 1 armada kendaraan, parkir rombongan).
       - KONTRAK HARGA SATUAN (MUTLAK):
         * Isi 'estimated_amount' HANYA dengan TARIF SATUAN (misal: jika unit_scope='per_peserta', isi biaya untuk 1 ORANG saja, contoh tiket Rp 20.000/orang). JANGAN PERNAH mengalikan dengan jumlah peserta! Sistem backend yang akan mengalikan tarif satuan tersebut tepat satu kali dengan {participant_count} orang.
         * Jika unit_scope='total_kelompok', isi dengan total biaya untuk 1 rombongan (contoh sewa angkutan: Rp 150.000). Sistem backend tidak akan mengalikannya lagi.
       - Total estimasi biaya kelompok ('total_estimated_cost') harus dihitung secara konsisten: akumulasi subtotal biaya kelompok untuk {participant_count} peserta (hanya menjumlahkan komponen yang berstatus 'tersedia' atau 'estimasi').
       - Hitung 'cost_per_participant' = total_estimated_cost / {participant_count}.
    4. Perbandingan Anggaran:
       - Anggaran pengguna saat ini: {budget_info}.
       - Jika anggaran diberikan, bandingkan total estimasi dengan anggaran di 'summary_notes'. Jika ada komponen belum tersedia, jelaskan bahwa kepastian anggaran masih bersifat sementara.
       - Jika tidak ada anggaran yang dimasukkan, jelaskan rangkuman biaya dan asumsinya tanpa memaksakan perbandingan.
    5. Ringkasan Singkat:
       - Kolom 'estimated_cost' (string) harus berisi kesimpulan ringkas 1 kalimat tentang perkiraan biaya kelompok.
    """

    response = call_gemini_with_fallback(
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ItineraryFormat,
            temperature=0.4,
        ),
    )

    if hasattr(response, 'parsed') and response.parsed:
        result = response.parsed.model_dump()
        return validate_and_enrich_cost_estimation(result, trip_config)

    import json
    raw_text = (response.text or "{}").strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    parsed_json = json.loads(raw_text.strip())
    return validate_and_enrich_cost_estimation(parsed_json, trip_config)

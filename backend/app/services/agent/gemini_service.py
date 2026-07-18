from google import genai
from google.genai import types
from app.core.config import settings
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Ensure API Key is available
if not settings.GEMINI_API_KEY:
    # We will instantiate the client when called, but warn if no key
    print("Warning: GEMINI_API_KEY is not set in environment.")

client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

class LocationExtractionItem(BaseModel):
    name: str
    historical_context: str
    source_excerpt: str
    related_events: list[str]
    related_figures: list[str]
    suggested_activities: list[str]

class ExtractionFormat(BaseModel):
    locations: list[LocationExtractionItem]

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

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ExtractionFormat,
            temperature=0.2,
        ),
    )
    
    import json
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    if text.startswith("```"):
        text = text[3:]
    return json.loads(text.strip())

def generate_itinerary(extraction_data: dict, trip_config: dict) -> dict:
    """
    Agent 2: ItineraryPlanningAgent
    Generates a historical trail itinerary based on extraction data and trip config.
    """
    if not client:
        raise ValueError("Gemini Client not initialized. Check GEMINI_API_KEY.")

    prompt = f"""
    Anda adalah ItineraryPlanningAgent, seorang pemandu wisata sejarah yang ahli.
    Buatlah itinerary napak tilas sejarah yang logis dan menarik berdasarkan data sejarah dan preferensi pengguna berikut.
    SELURUH HASIL, DESKRIPSI, RINGKASAN, DAN AKTIVITAS HARUS DALAM BAHASA INDONESIA YANG BAIK DAN BENAR.
    
    Data Sejarah:
    {extraction_data}
    
    Konfigurasi Perjalanan:
    {trip_config}
    
    ATURAN WAKTU SANGAT KETAT:
    - Jadwal harus HANYA untuk tanggal: {trip_config.get("event_date")}
    - Aktivitas pertama harus dimulai pada pukul: {trip_config.get("start_time")}
    - Seluruh aktivitas harus selesai SEBELUM pukul: {trip_config.get("end_time")}
    
    ATURAN KONTEN JADWAL:
    - Alokasikan waktu perjalanan yang realistis antar lokasi.
    - Berikan waktu istirahat yang cukup.
    - Untuk setiap item jadwal, tentukan perkiraan durasi kegiatan/perjalanan dalam menit ('duration_minutes').
    - Untuk setiap item jadwal, sertakan 'historical_context', 'source_excerpt', 'related_events', dan 'related_figures' yang diambil dari Data Sejarah.
    - Buat 'maps_link' berupa tautan pencarian Google Maps untuk lokasi tersebut (contoh: https://www.google.com/maps/search/?api=1&query=Nama+Lokasi).
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ItineraryFormat,
            temperature=0.5,
        ),
    )
    
    import json
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    if text.startswith("```"):
        text = text[3:]
    return json.loads(text.strip())

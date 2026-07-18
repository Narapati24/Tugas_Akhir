# PROJECT_CONTEXT.md

## Project Title

Implementasi Agen Berbasis Gemini untuk Perencanaan Napak Tilas Sejarah Otomatis Berdasarkan Literatur Sejarah

---

# Project Goal

Membangun aplikasi web yang mampu mengubah beberapa halaman literatur sejarah menjadi itinerary napak tilas sejarah secara otomatis.

Sistem menggunakan OCR lokal untuk mengubah gambar menjadi teks, kemudian menggunakan agen berbasis Gemini untuk melakukan ekstraksi informasi sejarah dan penyusunan itinerary.

---

# Research Scope

Input:

* Gambar halaman buku sejarah

Output:

* Lokasi sejarah
* Tokoh sejarah
* Peristiwa sejarah
* Aktivitas napak tilas
* Itinerary napak tilas

---

# Seminar MVP Scope

Workflow:

Upload Historical Literature Image
↓
Tesseract OCR
↓
HistoricalExtractionAgent
↓
User Validation
↓
Trip Configuration
↓
ItineraryPlanningAgent
↓
Save Result

The MVP only needs to prove that this workflow works.

---

# AI Architecture

The system uses a Gemini-based Agent architecture.

## Agent 1: HistoricalExtractionAgent

Responsibilities:

* Receive OCR text
* Identify historical locations
* Identify historical figures
* Identify historical events
* Identify historical activities

Output:

{
"locations": [
  {
  "name": "",
  "historical_context": "",
  "source_excerpt": "",
  "related_events": [],
  "related_figures": [],
  "suggested_activities": []
  }
]
}

Model:

* Gemini 2.5 Flash

---

## Agent 2: ItineraryPlanningAgent

Responsibilities:

* Receive validated extraction result
* Receive trip configuration
* Generate historical trail itinerary

Output:

{
"summary": "",
"locations": [],
"activities": [],
"schedule": [],
"estimated_duration": "",
"estimated_cost": ""
}

Model:

* Gemini 2.5 Flash

---

# OCR Architecture

Use local OCR.

OCR Engine:

* Tesseract OCR

Workflow:

Image
↓
Tesseract OCR
↓
Raw Text
↓
HistoricalExtractionAgent

Gemini must NOT be used as the primary OCR engine.

Gemini is only responsible for:

1. Information Extraction
2. Itinerary Generation

Reason:

* Reduce token usage
* Clear OCR → Extraction → Planning pipeline
* Consistent with thesis design

---

# User Validation

After extraction, users must be able to:

* Edit locations
* Edit figures
* Edit events
* Edit activities
* Add missing data
* Remove incorrect data

This validation step is mandatory.

---

# Trip Configuration

Users provide:

* Number of Participants
* Event Date
* Start Time
* End Time
* Starting Location
* Budget (Optional)
* Additional Notes (Optional)

Example:

{
"participant_count": 30,
"event_date": "2026-08-17",
"start_time": "08:00",
"end_time": "17:00",
"start_location": "Bandung",
"budget": 500000,
"additional_notes": "Focus on independence history"
}

---

# Database

Use SQLite.

Table: historical_extraction

* id
* source_title
* raw_ocr_text
* locations (JSON)
* created_at

Table: trip_configuration

* id
* participant_count
* event_date
* start_time
* end_time
* start_location
* budget
* additional_notes
* created_at

Table: itinerary

* id
* extraction_id
* configuration_id
* itinerary_result
* estimated_duration
* estimated_cost
* created_at

---

# Future Features

Not required for seminar:

* Authentication
* User Accounts
* Admin Dashboard
* Role Management
* Multi-Agent Expansion
* PDF Export
* Route Optimization
* GIS Integration
* Historical Knowledge Graph

Do not implement these features.

---

# Technical Stack

Frontend:

* Next.js
* TypeScript
* TailwindCSS

Backend:

* FastAPI
* Python

Database:

* SQLite
* SQLAlchemy

AI:

* Gemini API

OCR:

* Tesseract OCR

---

# Required Pages

1. Upload Page
2. Extraction Review Page
3. Trip Configuration Page
4. Generated Itinerary Page
5. History Page

UI simplicity is preferred over visual complexity.

---

# Success Criteria

The MVP is successful if:

1. User uploads historical literature images.
2. Tesseract extracts text.
3. HistoricalExtractionAgent extracts historical information.
4. User can edit extraction results.
5. User submits trip configuration.
6. ItineraryPlanningAgent generates an itinerary.
7. Results are saved to SQLite.
8. Previous itineraries can be viewed again.

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.services.ocr.tesseract_service import extract_text_from_image
from app.services.agent.gemini_service import extract_historical_info, generate_itinerary

router = APIRouter()

@router.post("/extract", response_model=schemas.HistoricalExtractionResponse)
async def upload_and_extract(files: list[UploadFile] = File(...), db: Session = Depends(get_db)):
    # 1. Read and OCR all images
    all_raw_texts = []
    filenames = []
    
    for file in files:
        contents = await file.read()
        raw_text = extract_text_from_image(contents)
        if raw_text:
            all_raw_texts.append(raw_text)
            filenames.append(file.filename)
            
    combined_raw_text = "\n\n--- NEXT PAGE ---\n\n".join(all_raw_texts)
    
    if not combined_raw_text.strip():
        raise HTTPException(status_code=400, detail="Failed to extract text from images")
        
    # 3. Gemini Extraction
    try:
        extracted_data = extract_historical_info(combined_raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    # 4. Save to DB
    db_extraction = models.HistoricalExtraction(
        source_title=", ".join(filenames),
        raw_ocr_text=combined_raw_text,
        locations=extracted_data.get("locations", [])
    )
    db.add(db_extraction)
    db.commit()
    db.refresh(db_extraction)
    
    return db_extraction

@router.get("/extract/{id}", response_model=schemas.HistoricalExtractionResponse)
def get_extraction(id: int, db: Session = Depends(get_db)):
    db_extraction = db.query(models.HistoricalExtraction).filter(models.HistoricalExtraction.id == id).first()
    if not db_extraction:
        raise HTTPException(status_code=404, detail="Extraction not found")
    return db_extraction

@router.put("/extract/{id}", response_model=schemas.HistoricalExtractionResponse)
def update_extraction(id: int, extraction: schemas.HistoricalExtractionUpdate, db: Session = Depends(get_db)):
    db_extraction = db.query(models.HistoricalExtraction).filter(models.HistoricalExtraction.id == id).first()
    if not db_extraction:
        raise HTTPException(status_code=404, detail="Extraction not found")
        
    db_extraction.locations = [loc.dict() for loc in extraction.locations]
    
    db.commit()
    db.refresh(db_extraction)
    return db_extraction

@router.post("/itinerary", response_model=schemas.ItineraryResponse)
def create_itinerary(req: schemas.ItineraryCreateRequest, db: Session = Depends(get_db)):
    # 1. Fetch extraction
    db_extraction = db.query(models.HistoricalExtraction).filter(models.HistoricalExtraction.id == req.extraction_id).first()
    if not db_extraction:
        raise HTTPException(status_code=404, detail="Extraction not found")
        
    # 2. Save config
    db_config = models.TripConfiguration(
        participant_count=req.trip_configuration.participant_count,
        event_date=req.trip_configuration.event_date,
        start_time=req.trip_configuration.start_time,
        end_time=req.trip_configuration.end_time,
        start_location=req.trip_configuration.start_location,
        budget=req.trip_configuration.budget,
        additional_notes=req.trip_configuration.additional_notes
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    
    # 3. Generate Itinerary via Gemini
    extraction_dict = {
        "locations": db_extraction.locations
    }
    
    try:
        itinerary_data = generate_itinerary(extraction_dict, req.trip_configuration.dict())
    except Exception as e:
        import traceback
        error_msg = f"{str(e)}\n{traceback.format_exc()}"
        print(f"ERROR GENERATING ITINERARY:\n{error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
        
    # 4. Save Itinerary
    db_itinerary = models.Itinerary(
        extraction_id=db_extraction.id,
        configuration_id=db_config.id,
        itinerary_result=itinerary_data,
        estimated_duration=itinerary_data.get("estimated_duration"),
        estimated_cost=itinerary_data.get("estimated_cost")
    )
    db.add(db_itinerary)
    db.commit()
    db.refresh(db_itinerary)
    
    return db_itinerary

@router.get("/history", response_model=list[schemas.ItineraryResponse])
def list_history(db: Session = Depends(get_db)):
    return db.query(models.Itinerary).order_by(models.Itinerary.created_at.desc()).all()

@router.get("/history/{id}", response_model=schemas.ItineraryResponse)
def get_itinerary(id: int, db: Session = Depends(get_db)):
    db_itinerary = db.query(models.Itinerary).filter(models.Itinerary.id == id).first()
    if not db_itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return db_itinerary

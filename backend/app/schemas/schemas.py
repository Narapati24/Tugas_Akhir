from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Historical Extraction Schemas
class LocationExtractionItem(BaseModel):
    name: str
    historical_context: str
    source_excerpt: str
    related_events: List[str]
    related_figures: List[str]
    suggested_activities: List[str]

class HistoricalExtractionBase(BaseModel):
    source_title: Optional[str] = None
    locations: List[LocationExtractionItem] = []

class HistoricalExtractionCreate(HistoricalExtractionBase):
    raw_ocr_text: str

class HistoricalExtractionUpdate(HistoricalExtractionBase):
    pass

class HistoricalExtractionResponse(HistoricalExtractionBase):
    id: int
    raw_ocr_text: Optional[str] = None

    class Config:
        from_attributes = True

# Trip Configuration Schemas
class TripConfigurationBase(BaseModel):
    participant_count: int
    event_date: str
    start_time: str
    end_time: str
    start_location: str
    budget: Optional[float] = None
    additional_notes: Optional[str] = None

class TripConfigurationCreate(TripConfigurationBase):
    pass

class TripConfigurationResponse(TripConfigurationBase):
    id: int

    class Config:
        from_attributes = True

# Itinerary Schemas
class ItineraryCreateRequest(BaseModel):
    extraction_id: int
    trip_configuration: TripConfigurationCreate

class ItineraryResponse(BaseModel):
    id: int
    extraction_id: int
    configuration_id: int
    itinerary_result: Dict[str, Any]
    estimated_duration: Optional[str] = None
    estimated_cost: Optional[str] = None

    class Config:
        from_attributes = True

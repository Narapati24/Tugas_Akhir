from pydantic import BaseModel, model_validator
from typing import List, Optional, Dict, Any

# Historical Extraction Schemas
class LocationExtractionItem(BaseModel):
    name: str
    historical_context: str
    source_excerpt: Optional[str] = ""
    source_excerpts: List[str] = []
    related_events: List[str] = []
    related_figures: List[str] = []
    suggested_activities: List[str] = []

    @model_validator(mode='before')
    @classmethod
    def sync_excerpts(cls, data: Any):
        if isinstance(data, dict):
            excerpts = [e.strip() for e in (data.get("source_excerpts") or []) if e and isinstance(e, str) and e.strip()]
            single = data.get("source_excerpt") or ""
            if isinstance(single, str):
                single = single.strip()
            if excerpts and not single:
                data["source_excerpt"] = excerpts[0]
            elif single and not excerpts:
                data["source_excerpts"] = [single]
        return data

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

# Cost Estimation Schemas
class CostBreakdownItemSchema(BaseModel):
    category: str
    name: str
    unit_price: Optional[float] = None
    estimated_amount: float
    unit_scope: str
    status: str
    subtotal: Optional[float] = None
    note: str

class CostEstimationSchema(BaseModel):
    items: List[CostBreakdownItemSchema]
    total_estimated_cost: float
    cost_per_participant: Optional[float] = None
    currency: str = "IDR"
    participant_count: Optional[int] = None
    user_budget: Optional[float] = None
    budget_difference: Optional[float] = None
    budget_status: Optional[str] = None
    has_unknown_costs: bool = False
    summary_notes: str

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
    configuration: Optional[TripConfigurationResponse] = None

    class Config:
        from_attributes = True

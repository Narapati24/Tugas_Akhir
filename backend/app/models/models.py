import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class HistoricalExtraction(Base):
    __tablename__ = "historical_extraction"

    id = Column(Integer, primary_key=True, index=True)
    source_title = Column(String, nullable=True)
    raw_ocr_text = Column(Text, nullable=True)
    locations = Column(JSON, default=list) # Now stores list of LocationExtractionItem dicts
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    itineraries = relationship("Itinerary", back_populates="extraction")

class TripConfiguration(Base):
    __tablename__ = "trip_configuration"

    id = Column(Integer, primary_key=True, index=True)
    participant_count = Column(Integer, nullable=False)
    event_date = Column(String, nullable=False) # Store as YYYY-MM-DD
    start_time = Column(String, nullable=False) # Store as HH:MM
    end_time = Column(String, nullable=False)   # Store as HH:MM
    start_location = Column(String, nullable=False)
    budget = Column(Integer, nullable=True)
    additional_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    itineraries = relationship("Itinerary", back_populates="configuration")

class Itinerary(Base):
    __tablename__ = "itinerary"

    id = Column(Integer, primary_key=True, index=True)
    extraction_id = Column(Integer, ForeignKey("historical_extraction.id"))
    configuration_id = Column(Integer, ForeignKey("trip_configuration.id"))
    itinerary_result = Column(JSON, default=dict)
    estimated_duration = Column(String, nullable=True)
    estimated_cost = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    extraction = relationship("HistoricalExtraction", back_populates="itineraries")
    configuration = relationship("TripConfiguration", back_populates="itineraries")

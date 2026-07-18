export interface LocationExtraction {
    name: string;
    historical_context: string;
    source_excerpt: string;
    related_events: string[];
    related_figures: string[];
    suggested_activities: string[];
}

export interface HistoricalExtraction {
    id: number;
    source_title?: string;
    raw_ocr_text?: string;
    locations: LocationExtraction[];
}

export interface TripConfiguration {
    participant_count: number;
    event_date: string;
    start_time: string;
    end_time: string;
    start_location: string;
    budget?: number;
    additional_notes?: string;
}

export interface ScheduleItem {
    time: string;
    duration_minutes: number;
    activity: string;
    location: string;
    historical_context: string;
    source_excerpt: string;
    related_events: string[];
    related_figures: string[];
    maps_link: string;
}

export interface ItineraryResult {
    summary: string;
    locations: string[];
    activities: string[];
    schedule: ScheduleItem[];
    estimated_duration: string;
    estimated_cost: string;
}

export interface Itinerary {
    id: number;
    extraction_id: number;
    configuration_id: number;
    itinerary_result: ItineraryResult;
    estimated_duration: string | null;
    estimated_cost: string | null;
}

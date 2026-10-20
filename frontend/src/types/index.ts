export interface LocationExtraction {
    name: string;
    historical_context: string;
    source_excerpt?: string;
    source_excerpts?: string[];
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
    source_excerpt?: string;
    source_excerpts?: string[];
    related_events: string[];
    related_figures: string[];
    maps_link: string;
}

export interface CostBreakdownItem {
    category: string;
    name: string;
    unit_price?: number;
    estimated_amount: number;
    unit_scope: 'per_peserta' | 'total_kelompok' | string;
    status: 'tersedia' | 'estimasi' | 'belum_tersedia' | 'gratis' | string;
    subtotal?: number;
    note: string;
}

export interface CostEstimation {
    items: CostBreakdownItem[];
    total_estimated_cost: number;
    cost_per_participant?: number;
    currency: string;
    participant_count?: number;
    user_budget?: number | null;
    budget_difference?: number | null;
    budget_status?: 'dalam_anggaran' | 'melebihi_anggaran' | 'belum_lengkap' | 'tanpa_anggaran' | string;
    has_unknown_costs: boolean;
    summary_notes: string;
}

export interface ItineraryResult {
    summary: string;
    locations: string[];
    activities: string[];
    schedule: ScheduleItem[];
    estimated_duration: string;
    estimated_cost: string;
    cost_estimation?: CostEstimation;
}

export interface Itinerary {
    id: number;
    extraction_id: number;
    configuration_id: number;
    itinerary_result: ItineraryResult;
    estimated_duration: string | null;
    estimated_cost: string | null;
    configuration?: TripConfiguration;
}

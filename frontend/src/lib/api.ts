import { HistoricalExtraction, TripConfiguration, Itinerary } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export const extractHistoricalInfo = async (files: File[]): Promise<HistoricalExtraction> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });
    
    const res = await fetch(`${API_BASE}/extract`, {
        method: 'POST',
        body: formData,
    });
    
    if (!res.ok) throw new Error('Extraction failed');
    return res.json();
};

export const getExtraction = async (id: number): Promise<HistoricalExtraction> => {
    const res = await fetch(`${API_BASE}/extract/${id}`);
    if (!res.ok) throw new Error('Failed to fetch extraction');
    return res.json();
};

export const updateExtraction = async (id: number, data: Partial<HistoricalExtraction>): Promise<HistoricalExtraction> => {
    const res = await fetch(`${API_BASE}/extract/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error('Update failed');
    return res.json();
};

export const createItinerary = async (extraction_id: number, config: TripConfiguration): Promise<Itinerary> => {
    const res = await fetch(`${API_BASE}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            extraction_id,
            trip_configuration: config
        }),
    });
    
    if (!res.ok) throw new Error('Itinerary generation failed');
    return res.json();
};

export const getItinerary = async (id: number): Promise<Itinerary> => {
    const res = await fetch(`${API_BASE}/history/${id}`);
    if (!res.ok) throw new Error('Failed to load itinerary');
    return res.json();
};

export const getHistory = async (): Promise<Itinerary[]> => {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
};

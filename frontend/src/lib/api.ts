import { HistoricalExtraction, TripConfiguration, Itinerary } from '../types';

const getApiBase = () => {
    if (typeof window !== 'undefined') {
        return '/api';
    }
    return 'http://127.0.0.1:8000/api';
};

const getErrorMessage = async (res: Response, fallback: string): Promise<string> => {
    try {
        const data = await res.json();
        if (data && data.detail) {
            return data.detail;
        }
    } catch (_) {}
    return fallback;
};

export const extractHistoricalInfo = async (files: File[]): Promise<HistoricalExtraction> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });
    
    const res = await fetch(`${getApiBase()}/extract`, {
        method: 'POST',
        body: formData,
    });
    
    if (!res.ok) {
        const msg = await getErrorMessage(res, 'Gagal mengekstrak data dari gambar.');
        throw new Error(msg);
    }
    return res.json();
};

export const getExtraction = async (id: number): Promise<HistoricalExtraction> => {
    const res = await fetch(`${getApiBase()}/extract/${id}`);
    if (!res.ok) {
        const msg = await getErrorMessage(res, 'Gagal memuat data ekstraksi.');
        throw new Error(msg);
    }
    return res.json();
};

export const updateExtraction = async (id: number, data: Partial<HistoricalExtraction>): Promise<HistoricalExtraction> => {
    const res = await fetch(`${getApiBase()}/extract/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const msg = await getErrorMessage(res, 'Gagal menyimpan perubahan.');
        throw new Error(msg);
    }
    return res.json();
};

export const createItinerary = async (extraction_id: number, config: TripConfiguration): Promise<Itinerary> => {
    const res = await fetch(`${getApiBase()}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            extraction_id,
            trip_configuration: config
        }),
    });
    
    if (!res.ok) {
        const msg = await getErrorMessage(res, 'Gagal menyusun itinerary.');
        throw new Error(msg);
    }
    return res.json();
};

export const getItinerary = async (id: number): Promise<Itinerary> => {
    const res = await fetch(`${getApiBase()}/history/${id}`);
    if (!res.ok) {
        const msg = await getErrorMessage(res, 'Gagal memuat itinerary.');
        throw new Error(msg);
    }
    return res.json();
};

export const getHistory = async (): Promise<Itinerary[]> => {
    const res = await fetch(`${getApiBase()}/history`);
    if (!res.ok) {
        const msg = await getErrorMessage(res, 'Gagal memuat riwayat.');
        throw new Error(msg);
    }
    return res.json();
};

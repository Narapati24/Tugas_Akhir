"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TripConfiguration } from '@/types';
import { createItinerary } from '@/lib/api';

export default function TripConfigPage() {
  const [config, setConfig] = useState<TripConfiguration>({
    participant_count: 1,
    event_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '17:00',
    start_location: '',
    budget: undefined,
    additional_notes: ''
  });
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.start_location) {
      alert("Lokasi mulai harus diisi");
      return;
    }

    setGenerating(true);
    try {
      const data = await createItinerary(id, config);
      router.push(`/itinerary/${data.id}`);
    } catch (err) {
      alert('Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Konfigurasi Perjalanan</h1>
      <p className="text-gray-600 mb-8">Atur preferensi perjalanan napak tilas Anda.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Peserta</label>
            <input 
              type="number" 
              min="1"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.participant_count}
              onChange={(e) => setConfig({...config, participant_count: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Acara</label>
            <input 
              type="date" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.event_date}
              onChange={(e) => setConfig({...config, event_date: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
            <input 
              type="time" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.start_time}
              onChange={(e) => setConfig({...config, start_time: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
            <input 
              type="time" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.end_time}
              onChange={(e) => setConfig({...config, end_time: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Mulai</label>
          <input 
            type="text" 
            required
            placeholder="Contoh: Stasiun Bandung"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={config.start_location}
            onChange={(e) => setConfig({...config, start_location: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anggaran (Opsional)</label>
          <input 
            type="number" 
            placeholder="Contoh: 500000"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={config.budget ?? ''}
            onChange={(e) => setConfig({...config, budget: e.target.value ? parseInt(e.target.value) : undefined})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
          <textarea 
            rows={3}
            placeholder="Contoh: Fokus pada bangunan bersejarah..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={config.additional_notes || ''}
            onChange={(e) => setConfig({...config, additional_notes: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={generating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-50 transition shadow-lg shadow-blue-200 mt-4"
        >
          {generating ? 'Menyusun Itinerary dengan AI...' : 'Buat Itinerary'}
        </button>
      </form>
    </main>
  );
}

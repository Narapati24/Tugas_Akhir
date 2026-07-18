"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Itinerary } from '@/types';
import { getItinerary } from '@/lib/api';

export default function ItineraryPage() {
  const [data, setData] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const result = await getItinerary(id);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Memuat Itinerary...</div>;
  if (!data) return <div className="text-center mt-20 text-red-500">Itinerary tidak ditemukan.</div>;

  return (
    <main className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 mb-20">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Itinerary Napak Tilas</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Durasi / Waktu</p>
          <p className="font-semibold">{data.estimated_duration || 'Sesuai Konfigurasi'}</p>
        </div>
      </div>

      <div className="mb-8 p-4 bg-blue-50 rounded-xl text-blue-900 leading-relaxed border border-blue-100">
        <p>{data.itinerary_result.summary}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
          Jadwal Perjalanan
        </h2>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          {data.itinerary_result.schedule.map((item, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-500 text-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between space-x-2 mb-2 border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-gray-800 text-lg">{item.time}</div>
                    {item.duration_minutes && (
                      <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                        ⏱️ {item.duration_minutes} Menit
                      </div>
                    )}
                  </div>
                  <a href={item.maps_link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1 transition">
                    📍 {item.location}
                  </a>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Aktivitas:</h4>
                  <p className="text-gray-700 leading-relaxed">{item.activity}</p>
                </div>
                
                {item.historical_context && (
                  <div className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">Konteks Sejarah</h4>
                    <p className="text-gray-600 text-sm">{item.historical_context}</p>
                  </div>
                )}
                
                {item.source_excerpt && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">Kutipan Sumber</h4>
                    <blockquote className="border-l-4 border-yellow-400 pl-3 italic text-gray-600 text-sm bg-yellow-50 py-1 pr-2 rounded-r-lg">
                      "{item.source_excerpt}"
                    </blockquote>
                  </div>
                )}

                {(item.related_events?.length > 0 || item.related_figures?.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                    {item.related_events?.map((e, i) => (
                      <span key={`e-${i}`} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-red-50 text-red-600 rounded">🚩 {e}</span>
                    ))}
                    {item.related_figures?.map((f, i) => (
                      <span key={`f-${i}`} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-purple-50 text-purple-600 rounded">👤 {f}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-10">
        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">Lokasi Utama</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {data.itinerary_result.locations.map((loc, i) => <li key={i}>{loc}</li>)}
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">Aktivitas Utama</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {data.itinerary_result.activities.map((act, i) => <li key={i}>{act}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex justify-center space-x-4">
        <button 
          onClick={() => router.push('/history')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Lihat Riwayat
        </button>
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Cetak Itinerary
        </button>
      </div>
    </main>
  );
}

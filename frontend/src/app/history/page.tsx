"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistory } from '@/lib/api';
import { Itinerary } from '@/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Memuat riwayat...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 mb-20">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Riwayat Napak Tilas</h1>
          <p className="text-gray-500 mt-1">Daftar itinerary yang telah Anda buat sebelumnya.</p>
        </div>
        <Link href="/" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
          + Buat Baru
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">Belum ada riwayat itinerary.</p>
          <p className="text-gray-400 text-sm mt-2">Mulai unggah literatur sejarah untuk membuat itinerary baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item) => (
            <Link href={`/itinerary/${item.id}`} key={item.id} className="block group">
              <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition bg-gray-50 group-hover:bg-blue-50">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 line-clamp-1">
                    Itinerary #{item.id}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                    {item.estimated_duration || 'Durasi tidak diketahui'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {item.itinerary_result?.summary || 'Tidak ada deskripsi'}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                    📍 {item.itinerary_result?.locations?.length || 0} Lokasi
                  </span>
                  <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                    🚶‍♂️ {item.itinerary_result?.activities?.length || 0} Aktivitas
                  </span>
                  {item.estimated_cost && (
                    <span className="text-xs bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-emerald-700 font-medium line-clamp-1">
                      💰 {item.itinerary_result?.cost_estimation?.total_estimated_cost ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.itinerary_result.cost_estimation.total_estimated_cost) : item.estimated_cost}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

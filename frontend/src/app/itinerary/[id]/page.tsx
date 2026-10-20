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
      <div className="flex justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Itinerary Napak Tilas</h1>
          {data.configuration?.event_date && (
            <p className="text-xs text-gray-500 mt-1">
              📅 {data.configuration.event_date} ({data.configuration.start_time} - {data.configuration.end_time}) • 👥 {data.configuration.participant_count} Peserta
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Durasi / Waktu</p>
          <p className="font-semibold text-gray-800 text-sm">{data.estimated_duration || 'Sesuai Konfigurasi'}</p>
          {data.estimated_cost && (
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              💰 {data.itinerary_result?.cost_estimation?.total_estimated_cost ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.itinerary_result.cost_estimation.total_estimated_cost) : data.estimated_cost}
            </span>
          )}
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
                
                {((item.source_excerpts && item.source_excerpts.length > 0) || item.source_excerpt) && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                      Kutipan Sumber {(item.source_excerpts && item.source_excerpts.length > 1) ? `(${item.source_excerpts.length})` : ''}
                    </h4>
                    <div className="space-y-2">
                      {(item.source_excerpts && item.source_excerpts.length > 0
                        ? item.source_excerpts
                        : [item.source_excerpt]
                      ).filter(Boolean).map((excerpt, exIdx) => (
                        <blockquote key={exIdx} className="border-l-4 border-yellow-400 pl-3 italic text-gray-600 text-sm bg-yellow-50 py-1.5 pr-2 rounded-r-lg">
                          "{excerpt}"
                        </blockquote>
                      ))}
                    </div>
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

      {/* Estimasi Biaya Perjalanan */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3 text-sm font-bold">2</span>
          Estimasi Biaya Perjalanan
        </h2>

        {data.itinerary_result?.cost_estimation ? (
          <div className="space-y-6">
            {/* Kartu Ringkasan Biaya & Anggaran */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Total Estimasi Kelompok</span>
                <p className="text-2xl font-bold text-emerald-900 mt-1">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                    data.itinerary_result.cost_estimation.total_estimated_cost
                  )}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Untuk {data.itinerary_result.cost_estimation.participant_count || data.configuration?.participant_count || 1} orang peserta
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">Estimasi per Peserta</span>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                    data.itinerary_result.cost_estimation.cost_per_participant ||
                      data.itinerary_result.cost_estimation.total_estimated_cost / (data.itinerary_result.cost_estimation.participant_count || 1)
                  )}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Rata-rata per orang
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Status Anggaran</span>
                {data.itinerary_result.cost_estimation.user_budget ? (
                  <>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      Anggaran: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                        data.itinerary_result.cost_estimation.user_budget
                      )}
                    </p>
                    <div className="mt-2">
                      {data.itinerary_result.cost_estimation.budget_status === 'dalam_anggaran' && (
                        <div>
                          <span className="inline-block text-xs font-bold px-2.5 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
                            ✓ Di Bawah Anggaran (Estimasi)
                          </span>
                          <p className="text-[11px] text-green-700 mt-1 font-medium">
                            Sisa estimasi: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                              Math.abs(data.itinerary_result.cost_estimation.budget_difference || 0)
                            )}
                          </p>
                        </div>
                      )}
                      {data.itinerary_result.cost_estimation.budget_status === 'belum_lengkap' && (
                        <div>
                          <span className="inline-block text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                            ⏳ Estimasi Belum Lengkap
                          </span>
                          <p className="text-[11px] text-amber-800 mt-1 font-medium">
                            Sisa anggaran sementara: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                              Math.abs(data.itinerary_result.cost_estimation.budget_difference || 0)
                            )}
                          </p>
                          <p className="text-[10px] text-amber-700 mt-0.5 leading-tight">
                            * Total akhir belum dapat dipastikan di bawah anggaran karena ada komponen belum diketahui.
                          </p>
                        </div>
                      )}
                      {data.itinerary_result.cost_estimation.budget_status === 'melebihi_anggaran' && (
                        <div>
                          <span className="inline-block text-xs font-bold px-2.5 py-1 bg-red-100 text-red-800 rounded-full border border-red-200">
                            ⚠️ Melebihi Anggaran (Estimasi)
                          </span>
                          <p className="text-[11px] text-red-700 mt-1 font-medium">
                            Perkiraan kekurangan: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                              Math.abs(data.itinerary_result.cost_estimation.budget_difference || 0)
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-gray-700 mt-1">Tanpa Batasan Anggaran</p>
                    <p className="text-xs text-gray-500 mt-1">Pengguna tidak menentukan batasan anggaran</p>
                  </>
                )}
              </div>
            </div>

            {/* Peringatan jika ada harga yang belum tersedia */}
            {data.itinerary_result.cost_estimation.has_unknown_costs && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
                <span className="text-xl shrink-0">ℹ️</span>
                <div>
                  <p className="font-semibold">Perhatian: Ada Komponen Biaya Belum Tersedia</p>
                  <p className="text-amber-800 text-xs mt-0.5">
                    Komponen bertanda status "Belum Tersedia" tidak dihitung sebagai Rp 0 (bukan berarti gratis), melainkan tarif resminya belum tercantum dalam literatur dan memerlukan konfirmasi langsung di lokasi.
                  </p>
                </div>
              </div>
            )}

            {/* Tabel Rincian Komponen Biaya */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                  <tr>
                    <th className="p-3">Komponen</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Cakupan</th>
                    <th className="p-3">Tarif Satuan</th>
                    <th className="p-3">Subtotal Kelompok</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Catatan / Asumsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.itinerary_result.cost_estimation.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition">
                      <td className="p-3 font-medium text-gray-900">{item.name}</td>
                      <td className="p-3 capitalize text-xs text-gray-600">
                        {item.category === 'transportasi' && '🚗 Transportasi'}
                        {item.category === 'tiket_masuk' && '🎟️ Tiket Masuk'}
                        {item.category === 'konsumsi' && '🍱 Konsumsi'}
                        {item.category !== 'transportasi' && item.category !== 'tiket_masuk' && item.category !== 'konsumsi' && `📋 ${item.category}`}
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        {item.unit_scope === 'per_peserta' ? 'Per Peserta' : 'Total Kelompok'}
                      </td>
                      <td className="p-3 text-gray-700 whitespace-nowrap text-xs">
                        {item.status === 'belum_tersedia' ? (
                          <span className="text-amber-600 italic">Belum Diketahui</span>
                        ) : item.status === 'gratis' || ((item.unit_price ?? item.estimated_amount) === 0 && item.status === 'tersedia') ? (
                          <span className="text-emerald-600 font-bold">Gratis</span>
                        ) : (
                          <span>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.unit_price ?? item.estimated_amount)}
                            {item.unit_scope === 'per_peserta' && <span className="text-gray-400"> /org</span>}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">
                        {item.status === 'belum_tersedia' ? (
                          <span className="text-amber-600 italic text-xs">-</span>
                        ) : item.status === 'gratis' || (item.subtotal === 0 && item.status === 'tersedia') ? (
                          <span className="text-emerald-600 font-bold">Gratis</span>
                        ) : (
                          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.subtotal ?? item.estimated_amount)
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {item.status === 'tersedia' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Tersedia</span>
                        )}
                        {item.status === 'gratis' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">Gratis</span>
                        )}
                        {item.status === 'estimasi' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">Estimasi</span>
                        )}
                        {item.status === 'belum_tersedia' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">Belum Tersedia</span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-gray-500 max-w-xs">{item.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Catatan Dasar Perhitungan */}
            {data.itinerary_result.cost_estimation.summary_notes && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">Dasar & Asumsi Perhitungan:</span>
                <p>{data.itinerary_result.cost_estimation.summary_notes}</p>
                <p className="text-[11px] text-gray-400 mt-2 italic">
                  * Catatan: Seluruh angka di atas merupakan estimasi perencanaan napak tilas berdasarkan literatur dan standar umum perjalanan, bukan kutipan resmi atau jaminan tarif aktual di lapangan.
                </p>
              </div>
            )}
          </div>
        ) : data.estimated_cost ? (
          /* Fallback untuk itinerary lama */
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ringkasan Estimasi Biaya (Versi Terdahulu)</span>
            <p className="text-lg font-bold text-gray-800 mt-2">{data.estimated_cost}</p>
            <p className="text-xs text-gray-500 mt-2">
              Rincian komponen per kategori hanya tersedia untuk itinerary yang dibuat dengan versi terbaru aplikasi.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-sm">
            Estimasi biaya tidak tersedia untuk itinerary ini.
          </div>
        )}
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

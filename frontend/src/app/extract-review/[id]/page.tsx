"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HistoricalExtraction, LocationExtraction } from '@/types';
import { updateExtraction, getExtraction } from '@/lib/api';

export default function ExtractReviewPage() {
  const [data, setData] = useState<HistoricalExtraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const result = await getExtraction(id);
          // If locations are null for some reason, ensure it's an array
          if (!result.locations) result.locations = [];
          result.locations = result.locations.map((loc: any) => {
            const excerpts = (loc.source_excerpts && loc.source_excerpts.length > 0)
              ? loc.source_excerpts
              : (loc.source_excerpt ? [loc.source_excerpt] : [""]);
            return {
              ...loc,
              source_excerpts: excerpts,
              source_excerpt: excerpts[0] || "",
              related_events: loc.related_events || [],
              related_figures: loc.related_figures || [],
              suggested_activities: loc.suggested_activities || []
            };
          });
          setData(result);
        } catch (error) {
          console.error("Failed to fetch extraction", error);
          alert("Gagal memuat data ekstraksi.");
        } finally {
          setLoading(false);
        }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const sanitizedLocations = data.locations.map(loc => {
        const cleanExcerpts = (loc.source_excerpts || []).filter(e => typeof e === 'string' && e.trim().length > 0);
        return {
          ...loc,
          source_excerpts: cleanExcerpts,
          source_excerpt: cleanExcerpts[0] || loc.source_excerpt || ""
        };
      });
      await updateExtraction(id, {
        locations: sanitizedLocations,
      });
      router.push(`/trip-config/${id}`);
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleLocationChange = (index: number, field: keyof LocationExtraction, value: string | string[]) => {
    if (!data) return;
    const newLocations = [...data.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setData({ ...data, locations: newLocations });
  };

  const handleStringArrayChange = (locIndex: number, field: keyof LocationExtraction, itemIndex: number, value: string) => {
    if (!data) return;
    const newLocations = [...data.locations];
    const newArray = [...(newLocations[locIndex][field] as string[])];
    newArray[itemIndex] = value;
    newLocations[locIndex] = { ...newLocations[locIndex], [field]: newArray };
    setData({ ...data, locations: newLocations });
  };

  const addStringArrayItem = (locIndex: number, field: keyof LocationExtraction) => {
    if (!data) return;
    const newLocations = [...data.locations];
    newLocations[locIndex] = { 
      ...newLocations[locIndex], 
      [field]: [...(newLocations[locIndex][field] as string[]), ""] 
    };
    setData({ ...data, locations: newLocations });
  };

  const removeStringArrayItem = (locIndex: number, field: keyof LocationExtraction, itemIndex: number) => {
    if (!data) return;
    const newLocations = [...data.locations];
    const newArray = [...(newLocations[locIndex][field] as string[])];
    newArray.splice(itemIndex, 1);
    newLocations[locIndex] = { ...newLocations[locIndex], [field]: newArray };
    setData({ ...data, locations: newLocations });
  };

  const addLocation = () => {
    if (!data) return;
    const newLocation: LocationExtraction = {
      name: "",
      historical_context: "",
      source_excerpt: "",
      source_excerpts: [""],
      related_events: [],
      related_figures: [],
      suggested_activities: []
    };
    setData({ ...data, locations: [...data.locations, newLocation] });
  };

  const removeLocation = (index: number) => {
    if (!data) return;
    const newLocations = [...data.locations];
    newLocations.splice(index, 1);
    setData({ ...data, locations: newLocations });
  };

  if (loading || !data) return <div className="text-center mt-20">Loading...</div>;

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 mb-20">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Validasi Hasil Ekstraksi</h1>
      <p className="text-gray-600 mb-8">Periksa dan lengkapi detail setiap lokasi sejarah yang berhasil diekstrak AI.</p>

      <div className="space-y-8">
        {data.locations.map((loc, locIndex) => (
          <div key={locIndex} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative shadow-sm">
            <button 
              onClick={() => removeLocation(locIndex)}
              className="absolute top-4 right-4 px-3 py-1 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-lg"
            >
              Hapus Lokasi
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lokasi {locIndex + 1}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lokasi</label>
                  <input
                    type="text"
                    value={loc.name}
                    onChange={(e) => handleLocationChange(locIndex, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Gedung Sate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Konteks Sejarah</label>
                  <textarea
                    rows={3}
                    value={loc.historical_context}
                    onChange={(e) => handleLocationChange(locIndex, 'historical_context', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Penjelasan sejarah singkat lokasi ini..."
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Kutipan Sumber (Teks OCR)</label>
                    <button 
                      type="button" 
                      onClick={() => addStringArrayItem(locIndex, 'source_excerpts')} 
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      + Tambah Kutipan
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Kutipan langsung dari buku sejarah sebagai bukti autentisitas.</p>
                  <div className="space-y-2">
                    {(loc.source_excerpts && loc.source_excerpts.length > 0 ? loc.source_excerpts : [""]).map((excerpt, exIdx) => (
                      <div key={exIdx} className="flex gap-2 items-start">
                        <textarea
                          rows={2}
                          value={excerpt}
                          onChange={(e) => handleStringArrayChange(locIndex, 'source_excerpts', exIdx, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50 font-mono text-xs"
                          placeholder="Kutipan langsung dari buku..."
                        />
                        {(loc.source_excerpts || []).length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeStringArrayItem(locIndex, 'source_excerpts', exIdx)} 
                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 mt-1 font-bold"
                            title="Hapus kutipan"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Related Events */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Peristiwa Terkait</label>
                    <button onClick={() => addStringArrayItem(locIndex, 'related_events')} className="text-xs text-blue-600 hover:underline">+ Tambah</button>
                  </div>
                  <div className="space-y-2">
                    {loc.related_events.map((event, eventIdx) => (
                      <div key={eventIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={event}
                          onChange={(e) => handleStringArrayChange(locIndex, 'related_events', eventIdx, e.target.value)}
                          className="flex-1 p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        />
                        <button onClick={() => removeStringArrayItem(locIndex, 'related_events', eventIdx)} className="text-red-500 text-xs px-2">X</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Figures */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Tokoh Terkait</label>
                    <button onClick={() => addStringArrayItem(locIndex, 'related_figures')} className="text-xs text-blue-600 hover:underline">+ Tambah</button>
                  </div>
                  <div className="space-y-2">
                    {loc.related_figures.map((figure, figureIdx) => (
                      <div key={figureIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={figure}
                          onChange={(e) => handleStringArrayChange(locIndex, 'related_figures', figureIdx, e.target.value)}
                          className="flex-1 p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        />
                        <button onClick={() => removeStringArrayItem(locIndex, 'related_figures', figureIdx)} className="text-red-500 text-xs px-2">X</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Activities */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Saran Aktivitas</label>
                    <button onClick={() => addStringArrayItem(locIndex, 'suggested_activities')} className="text-xs text-blue-600 hover:underline">+ Tambah</button>
                  </div>
                  <div className="space-y-2">
                    {loc.suggested_activities.map((act, actIdx) => (
                      <div key={actIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={act}
                          onChange={(e) => handleStringArrayChange(locIndex, 'suggested_activities', actIdx, e.target.value)}
                          className="flex-1 p-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        />
                        <button onClick={() => removeStringArrayItem(locIndex, 'suggested_activities', actIdx)} className="text-red-500 text-xs px-2">X</button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addLocation}
        className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
      >
        + Tambah Lokasi Baru
      </button>

      <button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl disabled:opacity-50 transition shadow-lg shadow-green-200 mt-8 text-lg"
      >
        {saving ? 'Menyimpan...' : 'Simpan & Lanjut Konfigurasi'}
      </button>
    </main>
  );
}

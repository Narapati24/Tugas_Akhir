"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { extractHistoricalInfo } from '@/lib/api';

async function optimizeImage(file: File): Promise<File> {
  // If file is smaller than 1.5MB, no resizing needed
  if (file.size < 1.5 * 1024 * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_DIM = 1800;
      let { width, height } = img;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    try {
      const optimizedFiles = await Promise.all(files.map((f) => optimizeImage(f)));
      const data = await extractHistoricalInfo(optimizedFiles);
      router.push(`/extract-review/${data.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Gagal mengekstrak data dari gambar.');
    } finally {
      setLoading(false);
    }
  };

  const processFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      const selectedFiles = Array.from(newFiles);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">Mulai Napak Tilas</h1>
      <p className="text-gray-600 mb-8">Unggah beberapa gambar halaman buku sejarah Anda sekaligus untuk memulai ekstraksi lokasi dan peristiwa.</p>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Hidden File Inputs */}
        <input 
          ref={cameraInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          capture="environment"
          onChange={handleFileChange} 
        />
        <input 
          ref={galleryInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          multiple
          onChange={handleFileChange} 
        />

        {/* Upload & Camera Box */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl transition ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
        >
          <div className="flex flex-col items-center justify-center text-center mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Tambahkan Foto Halaman Buku Sejarah
            </p>
            <p className="text-xs text-gray-500">
              Pilih foto langsung dengan kamera atau ambil dari galeri / file
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 transition active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Ambil Foto (Kamera)</span>
            </button>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 shadow-sm transition active:scale-95"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Pilih dari Galeri</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-3 hidden sm:block">
            Atau seret dan lepas gambar ke area ini (PNG, JPG)
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-700">
                Terpilih ({files.length} halaman):
              </p>
              <button 
                type="button" 
                onClick={() => setFiles([])}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Hapus Semua
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[3/4] shadow-sm">
                  {previews[i] ? (
                    <img 
                      src={previews[i]} 
                      alt={file.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      Memuat...
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
                    Hal. {i + 1}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow transition"
                    title="Hapus foto ini"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 italic text-center pt-1">
              Tip: Anda bisa klik kotak di atas lagi untuk memotret atau menambah halaman berikutnya.
            </p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={files.length === 0 || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-50 transition shadow-lg shadow-blue-200"
        >
          {loading ? 'Memproses dengan AI...' : 'Ekstrak Sekarang'}
        </button>
      </form>
    </main>
  );
}

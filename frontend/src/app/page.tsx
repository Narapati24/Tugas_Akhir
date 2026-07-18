"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractHistoricalInfo } from '@/lib/api';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    try {
      const data = await extractHistoricalInfo(files);
      router.push(`/extract-review/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to extract data');
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
    <main className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">Mulai Napak Tilas</h1>
      <p className="text-gray-600 mb-8">Unggah beberapa gambar halaman buku sejarah Anda sekaligus untuk memulai ekstraksi lokasi dan peristiwa.</p>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk unggah</span> atau seret gambar</p>
              <p className="text-xs text-gray-500">Bisa pilih banyak file sekaligus (PNG, JPG)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              multiple
              onChange={handleFileChange} 
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Terpilih ({files.length} file):</p>
            {files.map((file, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-blue-800 text-sm font-medium border border-blue-100">
                <span className="truncate pr-4">{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => removeFile(i)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                >
                  X
                </button>
              </div>
            ))}
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

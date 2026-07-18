import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Napak Tilas Sejarah",
  description: "Aplikasi perencanaan napak tilas sejarah otomatis menggunakan AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Napak Tilas AI</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-600 hover:text-blue-600 font-medium">Buat Baru</a>
                <a href="/history" className="text-gray-600 hover:text-blue-600 font-medium">Riwayat</a>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}

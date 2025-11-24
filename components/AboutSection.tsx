"use client"

import { Info, Check, Globe } from "lucide-react"

// MEMPERBAIKI ERROR: Mengubah definisi AboutSectionProps agar prop 'about' dapat menerima 'null'
// karena komponen tersebut memiliki logika 'if (!about) return null', yang berarti prop ini opsional atau bisa null.
// Dari error yang diberikan, objek 'about' di page.tsx bisa berupa { ... } | null.
type AboutType = {
  title: string;
  content: string;
}

type AboutSectionProps = {
  about: AboutType | null; // Izinkan 'null' agar sesuai dengan penggunaan di page.tsx
}

export default function AboutSection({ about }: AboutSectionProps) {
  // Fungsionalitas: Jangan render jika 'about' tidak ada (tetap dipertahankan)
  if (!about === null) return null // Menghilangkan '!' agar konsisten, namun menggunakan 'if (!about)' sudah cukup

  // Logika pengecekan if (!about)
  if (!about) return null;

  return (
    <section
      id="about"
      className="py-24 bg-white" // Menggunakan padding vertikal yang konsisten dengan bagian lain
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/*
          HEADER BLOCK: Dibuat senada dengan Hero Section dan Facilities Section.
          Menggunakan Badge dan Tipografi ber-Gradien.
        */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4 text-center">
            
            {/* Badge Style: Sesuai dengan Hero/Facilities (bg-gray-50, rounded-full) */}

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full text-xs font-semibold uppercase text-gray-700">
                <Globe className="w-4 h-4 text-indigo-500" />
                About Navara City Park
            </div>
            
            {/* Judul Utama: Menggunakan font tebal dan aksen gradien ungu-biru */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {/* Mempertahankan about.title dan memecahnya untuk gradien (efek visual) */}
                {about.title.split(' ')[0]}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  {about.title.split(' ').slice(1).join(' ')}
                </span>
            </h2>
        </div>


        {/*
          CONTENT BLOCK: Diubah tampilannya agar lebih premium.
          Menggunakan Rounded-3xl, Shadow yang lebih menonjol, dan warna netral.
        */}
        <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-gray-900/5 border border-gray-100">
                
                {/* Fungsionalitas: Mempertahankan 'whitespace-pre-line' dan konten asli */}
                <p className="whitespace-pre-line text-base leading-relaxed text-gray-600">
                    {about.content}
                </p>
                
                {/* Visual Consistency: Info Cards (Mirip Hero) */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-6 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-sm font-medium text-gray-800">10+ Wahana Utama</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-purple-500" />
                        <span className="text-sm font-medium text-gray-800">50+ Pilihan Kuliner</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-gray-800">Penginapan Eksklusif</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  )
}

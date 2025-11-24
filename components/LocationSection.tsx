"use client"

import { MapPin, ArrowRight } from "lucide-react"

// Tipe data dipertahankan sama persis
type LocationSectionProps = {
  location: {
    address: string;
    mapsEmbed: string;
    // Tipe lain yang mungkin ada (misal: title)
  } | null; // Izinkan null agar aman
}

export default function LocationSection({ location }: LocationSectionProps) {
  // Logika pengecekan dipertahankan sama persis
  if (!location) return null
  
  // Logika konsol log dipertahankan
  console.log(location.mapsEmbed) 

  return (
    <section
      id="location"
      // Menggunakan padding vertikal dan lebar kontainer yang konsisten
      className="py-24 bg-white" 
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/*
          HEADER BLOCK - Diselaraskan dengan Desain
          Menggunakan Badge dan Tipografi ber-Gradien
        */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            
            {/* Badge Style: Sesuai dengan komponen lain (bg-gray-50, rounded-full) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full text-xs font-semibold uppercase text-gray-700 mb-3 border border-gray-200">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Location
            </div>
            
            {/* Judul Utama: Menggunakan font tebal dan aksen gradien ungu-biru */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Lokasi Navara {" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  City Park
                </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Temukan Navara City Park dan rencanakan kunjungan Anda.
            </p>
            
            {/* Alamat dipertahankan */}
            <p className="mt-3 text-sm font-semibold text-gray-900 flex items-start gap-2 max-w-md p-3 bg-gray-50 rounded-xl border border-gray-200">
                <MapPin className="w-4 h-4 mt-1 text-indigo-600 flex-shrink-0" />
                <span>{location.address}</span>
            </p>
          </div>
          
          {/* Tombol Arah (Opsional, untuk konsistensi) */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 self-start md:self-end"
          >
            Dapatkan Petunjuk Arah
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/*
          MAP EMBED BLOCK - Diubah agar lebih premium
          Menggunakan rounded-3xl yang lebih besar dan shadow yang halus
        */}
        <div className="overflow-hidden rounded-3xl shadow-2xl shadow-gray-900/10 border border-gray-100">
          <div className="aspect-[16/9] w-full min-h-[400px]">
            <iframe
              // Atribut src, width, height, style, allowFullScreen, loading, referrerPolicy dipertahankan
              src={location.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        
      </div>
    </section>
  )
}
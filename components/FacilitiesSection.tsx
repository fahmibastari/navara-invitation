"use client"

import { Building, Droplet, Tent, Utensils, Zap, Bus } from "lucide-react"

// Tipe data dipertahankan sama persis
type FacilitiesSectionProps = {
  facilities: any[]
}

// Mock data untuk tampilan yang lebih baik saat data kosong
const mockFacilities = [
    { id: 1, name: "Waterpark & Kolam Ombak", description: "Wahana air terbesar dengan kolam ombak, lazy river, dan seluncuran ekstrem.", iconType: "Droplet" },
    { id: 2, name: "Luxury Villa & Resort", description: "Penginapan mewah dengan pemandangan pegunungan dan fasilitas bintang lima.", iconType: "Building" },
    { id: 3, name: "Food Court & Eatery", description: "Pusat kuliner dengan berbagai pilihan makanan lokal dan internasional.", iconType: "Utensils" },
    { id: 4, name: "Theme Park Zone", description: "Area taman bermain dengan berbagai wahana rekreasi untuk keluarga dan anak-anak.", iconType: "Tent" },
    { id: 5, name: "Layanan Shuttle Gratis", description: "Transportasi gratis dari dan ke stasiun utama di kota terdekat.", iconType: "Bus" },
    { id: 6, name: "Area Charging Kendaraan Listrik", description: "Fasilitas pengisian daya cepat untuk kendaraan listrik pengunjung.", iconType: "Zap" },
];

// Fungsi helper untuk memilih ikon Lucide berdasarkan nama
const getIcon = (iconType: string) => {
    switch (iconType) {
        case "Droplet": return Droplet;
        case "Building": return Building;
        case "Utensils": return Utensils;
        case "Tent": return Tent;
        case "Bus": return Bus;
        case "Zap": return Zap;
        default: return Droplet; // Default icon
    }
}

export default function FacilitiesSection({
  facilities,
}: FacilitiesSectionProps) {
  
  if (!facilities || facilities.length === 0) {
    // Menggunakan mock data jika facilities kosong
    facilities = mockFacilities;
  }

  return (
    <section
      id="facilities"
      // Menggunakan padding vertikal dan lebar kontainer yang konsisten
      className="py-24 bg-white" 
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/*
          HEADER BLOCK - Diselaraskan dengan Desain
        */}
        <div className="max-w-4xl mx-auto mb-16 space-y-4 text-center">
            
            {/* Badge Style: Sesuai dengan Hero/Location (bg-gray-50, rounded-full) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full text-xs font-semibold uppercase text-gray-700 border border-gray-200">
                <Tent className="w-4 h-4 text-indigo-500" />
                Facilities
            </div>
            
            {/* Judul Utama: Menggunakan font tebal dan aksen gradien ungu-biru */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Fasilitas di {" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Navara City Park
                </span>
            </h2>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
              Nikmati kombinasi waterpark, villa, foodcourt, dan theme
              park dalam satu kawasan modern dan elegan.
            </p>
        </div>

        {/* FACILITY CARDS GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f: any) => {
             const IconComponent = getIcon(f.iconType || "Droplet"); // Gunakan iconType dari mock atau default

             return (
                <article
                    key={f.id}
                    // Gaya kartu dibuat lebih premium (rounded-3xl, shadow yang lebih jelas)
                    className="group flex flex-col rounded-3xl bg-white p-6 shadow-xl shadow-indigo-50/50 transition duration-300 hover:shadow-2xl hover:shadow-indigo-100/70 hover:-translate-y-1 border border-gray-100"
                >
                    <div className="mb-4 flex items-center justify-between gap-3">
                        {/* Ikon di-upgrade dengan warna aksen dan background */}
                        <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition duration-300">
                            <IconComponent className="w-6 h-6 text-indigo-600" />
                        </div>
                        {/* Judul Fasilitas */}
                        <h3 className="flex-1 text-lg font-bold text-gray-900">
                            {f.name}
                        </h3>
                    </div>
                    
                    {/* Deskripsi Fasilitas */}
                    {f.description && (
                        <p className="flex-1 text-sm text-gray-600">
                            {f.description}
                        </p>
                    )}
                </article>
             );
          })}
        </div>
      </div>
    </section>
  )
}
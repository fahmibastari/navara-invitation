"use client"

import { Image as ImageIcon, Camera } from "lucide-react"

type GallerySectionProps = {
  // Tipe data dipertahankan sama persis
  sections: any[]
}

// Data mock untuk fallback jika section kosong
const mockSections = [
    {
        id: 1,
        title: "Wahana Ekstrem",
        description: "Adrenalin tertinggi di Navara City Park.",
        images: [
            { id: 101, imageUrl: "https://placehold.co/400x250/505050/FFFFFF?text=Roller+Coaster", caption: "The Lightning Ride" },
            { id: 102, imageUrl: "https://placehold.co/400x250/606060/FFFFFF?text=Tower+Drop", caption: "Free Fall Tower" },
            { id: 103, imageUrl: "https://placehold.co/400x250/707070/FFFFFF?text=Giant+Swing", caption: "The Pendulum" },
        ]
    },
    {
        id: 2,
        title: "Area Keluarga",
        description: "Kegembiraan untuk semua usia.",
        images: [
            { id: 201, imageUrl: "https://placehold.co/400x250/808080/FFFFFF?text=Kids+Zone", caption: "Playground Fantasi" },
            { id: 202, imageUrl: "https://placehold.co/400x250/909090/FFFFFF?text=Resto+Area", caption: "Restoran Pemandangan" },
        ]
    }
];


export default function GallerySection({ sections }: GallerySectionProps) {
  // Logika pengecekan dipertahankan sama persis
  if (!sections || sections.length === 0) {
    // Menggunakan mock data jika sections kosong untuk tampilan development yang lebih baik
    sections = mockSections; 
  }

  return (
    <section
      id="gallery"
      // Menggunakan background gelap yang kaya dan padding konsisten
      className="py-24 bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/*
          HEADER BLOCK - Diselaraskan dengan Desain
          Menggunakan Badge dan Tipografi ber-Gradien pada background gelap
        */}
        <div className="max-w-4xl mx-auto mb-16 space-y-4 text-center">
          
            {/* Badge Style: Sesuai dengan Hero/Facilities (bg-gray-800, rounded-full) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800 rounded-full text-xs font-semibold uppercase text-gray-300">
                <Camera className="w-4 h-4 text-cyan-400" />
                Gallery
            </div>
            
            {/* Judul Utama: Menggunakan font tebal dan aksen gradien ungu-biru */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Momen di {" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  Navara City Park
                </span>
            </h2>
            <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
            Intip keseruan yang sesungguhnya! Rasakan atmosfernya lewat galeri kami sebelum Anda datang dan menciptakannya sendiri.
            </p>
        </div>

        {/* GALLERY GRID SECTIONS */}
        <div className="space-y-16">
          {sections.map((section: any) => (
            <div key={section.id}>
              
              {/* Section Header */}
              <div className="mb-6 border-l-4 border-indigo-400 pl-4">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {section.title}
                </h3>
                {/* Description dipertahankan */}
                {section.description && (
                  <p className="text-sm text-gray-400">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Fungsionalitas: Grid Foto */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Check for no photos - dipertahankan */}
                {section.images.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-gray-700 p-6 text-sm text-gray-400 col-span-full flex items-center justify-center h-44">
                    <ImageIcon className="w-6 h-6 mr-2" /> Belum ada foto untuk section ini.
                  </div>
                )}
                
                {/* Mapping Images */}
                {section.images.map((img: any) => (
                  <figure
                    key={img.id}
                    // Gaya figure diubah menjadi lebih premium (rounded-3xl, shadow)
                    className="group overflow-hidden rounded-3xl bg-gray-800 shadow-xl shadow-gray-900/50 transition duration-300 hover:shadow-indigo-500/20"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || section.title}
                      // Ukuran dan efek hover dipertahankan
                      className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      // Tambahkan placeholder jika gambar gagal dimuat
                      onError={(e: any) => {
                          e.target.onerror = null; 
                          e.target.src = `https://placehold.co/400x240/1f2937/FFFFFF?text=${section.title.replace(/\s/g, '+')}`;
                      }}
                    />
                    {/* Caption dipertahankan */}
                    {img.caption && (
                      <figcaption className="px-5 py-3 text-xs font-medium text-gray-300">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
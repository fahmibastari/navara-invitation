"use client"

import { useEffect, useState } from "react"
import { ChevronRight, MapPin, Phone } from "lucide-react"

// Menetapkan tipe SiteConfig secara eksplisit
type SiteConfig = {
  name: string
  tagline: string
  description: string
  primaryLogo?: string | null
  secondaryLogo?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
  facebookUrl?: string | null
  tiktokUrl?: string | null
  id?: number
  createdAt?: Date
  updatedAt?: Date
}

// Menetapkan tipe untuk slide (FIXED: subtitle dan imageUrl diizinkan null)
type Slide = {
    id: number;
    imageUrl: string | null; // Diperbaiki: memungkinkan null
    title: string;
    subtitle: string | null; // Diperbaiki: memungkinkan null (Penyebab error TS2322)
}

// MEMPERBAIKI MASALAH TIPE DI SINI:
type HeroSectionProps = {
  siteConfig: SiteConfig | null
  slides: Slide[] // Menggunakan tipe Slide yang telah diperbaiki
}

export default function HeroSection({ siteConfig, slides }: HeroSectionProps) {
  const [index, setIndex] = useState(0)
  // Menjaga agar index tidak error jika slides kosong
  const totalSlides = slides ? slides.length : 0;
  
  // Ambil data slide saat ini
  const currentSlide = slides?.[index] || null;

  // Efek untuk auto-play carousel
  useEffect(() => {
    if (totalSlides === 0) return
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % totalSlides),
      5000, // Ganti setiap 5 detik
    )
    return () => clearInterval(interval)
  }, [totalSlides])

  // Guard clause sudah benar (jika siteConfig null, return null)
  if (!siteConfig) return null

  // Fungsi untuk merender logo (bisa berupa Base64 atau URL)
  const LogoDisplay = ({ src, alt, className }: { src: string | null | undefined, alt: string, className: string }) => {
    if (!src) {
        return (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                // Fallback jika Base64 atau URL rusak
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/32x32/1a202c/ffffff?text=Logo"; 
            }}
        />
    );
  };

  return (
    <header className="relative min-h-screen bg-white">
      {/* Minimalist Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <LogoDisplay 
                src={siteConfig.primaryLogo} 
                alt={`${siteConfig?.name || "Navara"} Logo`}
                className="h-8 w-8 object-contain"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {siteConfig?.name || "Navara City Park"}
                </p>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#rundown" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Rundown
              </a>
              <a href="#location" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Location
              </a>
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition">
                About
              </a>
              <a href="#facilities" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Facilities
              </a>
              <a href="#gallery" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Gallery
              </a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Contact
              </a>
            </div>

            {/* CTA Button */}
            <a
              href="#contact"
              className="hidden md:flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition"
            >
              Book Now
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Undangan Resmi
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Navara {" "}
                </span>
                City{" "}

                Park
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Opening Ceremony
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#rundown"
                className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-lg shadow-gray-900/10"
              >
                Lihat Rundown Event
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-50 transition"
              >
                Konfirmasi Kehadiran
              </a>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {siteConfig?.address && (
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-1">Address</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{siteConfig.address}</p>
                    </div>
                  </div>
                </div>
              )}
              {siteConfig?.phone && (
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-1">Contact</p>
                      <p className="text-xs text-gray-600">{siteConfig.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Image Carousel (Fixed) */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-2xl shadow-gray-900/10 relative">
              
              {/* Iterasi semua slide, atur opacity hanya pada slide yang aktif */}
              {totalSlides > 0 ? (
                slides.map((slide, i) => (
                    <div 
                        key={slide.id || i} // Gunakan ID atau index sebagai key
                        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        {/* Cek apakah imageUrl ada sebelum merender img */}
                        {slide.imageUrl ? (
                            <img
                                src={slide.imageUrl}
                                alt={slide.title || "Navara highlight"}
                                className="h-full w-full object-cover"
                                // Tambahkan onError untuk fallback
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://placehold.co/600x800/e0e0e0/555555?text=Image+Missing";
                                }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                                Gambar tidak tersedia
                            </div>
                        )}
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Caption (Hanya tampil jika ada judul atau subtitle) */}
                        {(slide.title || slide.subtitle) && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                                    {slide.subtitle || "Navara Signature Moment"}
                                </p>
                                <p className="text-base font-medium">
                                    {slide.title || "Feel the rhythm of water, lights, and nature in perfect harmony."}
                                </p>
                            </div>
                        )}
                    </div>
                ))
              ) : (
                // Konten jika slides kosong
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  Tambahkan slide hero dari halaman admin.
                </div>
              )}
            </div>

            {/* Carousel Dots */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index
                        ? "w-8 bg-gray-900"
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Secondary Logo */}
            {siteConfig?.secondaryLogo && (
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 z-20">
                <img
                  src={siteConfig.secondaryLogo}
                  alt="Secondary logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </header>
  )
}
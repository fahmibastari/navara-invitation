"use client"

import { Instagram, Youtube, Facebook, Rss } from "lucide-react"

// Tipe data diperbarui untuk mengizinkan 'null' pada properti individual
type FooterProps = {
  siteConfig: {
    // Semua properti opsional dari Prisma yang bisa jadi 'null' harus mencakup '| null'
    name?: string | null;
    tagline?: string | null;
    instagramUrl?: string | null; // Perbaikan di sini
    youtubeUrl?: string | null;  // Perbaikan di sini
    facebookUrl?: string | null; // Perbaikan di sini
    tiktokUrl?: string | null;   // Perbaikan di sini
  } | null // Ini mengizinkan siteConfig secara keseluruhan menjadi null
}

export default function Footer({ siteConfig }: FooterProps) {
    // Data mock untuk social media jika config tidak ada
    const mockConfig = {
        name: "Navara City Park",
        tagline: "Destinasi Rekreasi Terbaik di Asia Tenggara",
        instagramUrl: "#", 
        youtubeUrl: "#",
        facebookUrl: "#",
        tiktokUrl: "#" 
    };

    // Menggunakan fallback jika siteConfig adalah null atau undefined
    const config = siteConfig || mockConfig;

    // Helper untuk menentukan warna ikon
    const iconClass = "w-5 h-5 transition duration-200 text-gray-400 group-hover:text-purple-400";
    const linkClass = "group p-2 rounded-full hover:bg-gray-700 transition duration-300";

    return (
        <footer className="bg-gray-900 border-t border-indigo-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
                
                {/* BLOK KIRI: Informasi Situs & Hak Cipta */}
                <div className="text-sm text-gray-400 space-y-1">
                    <p className="font-extrabold text-2xl mb-1 text-white leading-none">
                        {config.name || mockConfig.name}
                    </p>
                    <p className="text-indigo-400 text-sm font-medium tracking-wider uppercase">
                        {config.tagline || mockConfig.tagline}
                    </p>
                    <p className="pt-4 text-xs">
                        © {new Date().getFullYear()} {config.name || mockConfig.name}. All 
                        rights reserved.
                    </p>
                </div>
                
                {/* BLOK KANAN: Tautan Media Sosial (Ikon) */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Instagram */}
                    {config.instagramUrl && (
                        <a
                            href={config.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className={linkClass}
                        >
                            <Instagram className={iconClass} />
                        </a>
                    )}
                    {/* YouTube */}
                    {config.youtubeUrl && (
                        <a
                            href={config.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="YouTube"
                            className={linkClass}
                        >
                            <Youtube className={iconClass} />
                        </a>
                    )}
                    {/* Facebook */}
                    {config.facebookUrl && (
                        <a
                            href={config.facebookUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className={linkClass}
                        >
                            <Facebook className={iconClass} />
                        </a>
                    )}
                    {/* TikTok (Menggunakan ikon RSS sebagai fallback/pengganti jika tidak ada ikon TikTok) */}
                    {config.tiktokUrl && (
                        <a
                            href={config.tiktokUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="TikTok"
                            className={linkClass}
                        >
                            <Rss className={iconClass} /> 
                        </a>
                    )}
                </div>
            </div>
        </footer>
    )
}
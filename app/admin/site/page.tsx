"use client"

import { useEffect, useState } from "react"
import { Upload, X } from "lucide-react" // Import ikon untuk UI upload

type SiteConfig = {
  name: string
  tagline: string
  description: string
  primaryLogo?: string | null // Memperbarui tipe untuk menampung Base64 string
  secondaryLogo?: string | null // Memperbarui tipe untuk menampung Base64 string
  address?: string | null
  phone?: string | null
  email?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
  facebookUrl?: string | null
  tiktokUrl?: string | null
}

type LocationConfig = {
  address: string | null
  mapsEmbed: string | null
}

// --- Komponen Baru untuk Upload Gambar ---
function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | null | undefined
  onChange: (v: string | null) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        console.error("Hanya file gambar yang diizinkan.");
        return;
    }

    setIsLoading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      // Simpan Base64 string ke state
      onChange(event.target?.result as string)
      setIsLoading(false)
    }

    reader.onerror = () => {
        console.error("Gagal membaca file.");
        setIsLoading(false);
        onChange(null);
    }

    // Membaca file sebagai Data URL (Base64)
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className="space-y-1">
      <label className="mb-1 block font-medium text-slate-300">
        {label}
      </label>

      {/* Tampilan Gambar yang Sudah Di-Upload */}
      {value ? (
        <div className="relative w-full h-32 rounded-xl border border-slate-700 bg-slate-800 p-2 overflow-hidden flex items-center justify-center">
          <img
            src={value}
            alt="Uploaded Logo"
            className="h-full w-auto object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-700/90 text-white rounded-full transition"
            aria-label="Hapus Logo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        // Tampilan Input File
        <label className={`block w-full rounded-xl border-2 border-dashed px-3 py-4 text-xs text-center cursor-pointer transition 
            ${isLoading ? 'bg-slate-700 border-slate-600' : 'border-slate-700 bg-slate-900 hover:border-navara-violet'}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          {isLoading ? (
            <span className="text-slate-400">Loading...</span>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
                <Upload className="w-4 h-4 mb-1" />
                Klik untuk upload atau drag & drop (maks. 500KB)
            </div>
          )}
        </label>
      )}
    </div>
  )
}
// --- Akhir Komponen Baru ---


export default function SiteAdminPage() {
  const [site, setSite] = useState<SiteConfig>({
    name: "Navara City Park",
    tagline: "More Than Just A Destination",
    description: "",
    primaryLogo: null, // Default
    secondaryLogo: null, // Default
  })
  const [location, setLocation] = useState<LocationConfig>({
    address: null,
    mapsEmbed: null,
  })
  const [status, setStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  )

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/admin/site")
      const json = await res.json()
      if (json.siteConfig) setSite(json.siteConfig)
      if (json.location) setLocation(json.location)
    })()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setStatus("saving")
    const res = await fetch("/api/admin/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteConfig: site, location }),
    })
    if (res.ok) setStatus("saved")
    else setStatus("idle")
    setTimeout(() => setStatus("idle"), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <h1 className="font-hind text-2xl font-semibold">
          Site & Location
        </h1>
        <p className="text-sm text-slate-400">
          Atur nama, tagline, deskripsi, alamat, dan social media.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-5 shadow-soft">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Site Info
          </h2>
          <div className="space-y-3 text-xs">
            <Field
              label="Nama Website"
              value={site.name}
              onChange={(v) => setSite({ ...site, name: v })}
            />
            <Field
              label="Tagline"
              value={site.tagline}
              onChange={(v) => setSite({ ...site, tagline: v })}
            />
            <FieldTextarea
              label="Deskripsi Singkat"
              value={site.description}
              onChange={(v) => setSite({ ...site, description: v })}
            />
            
            {/* DIGANTI: Menggunakan ImageUploadField untuk Primary Logo */}
            <ImageUploadField
              label="Logo Utama"
              value={site.primaryLogo}
              onChange={(v) => setSite({ ...site, primaryLogo: v })}
            />
            
            {/* DIGANTI: Menggunakan ImageUploadField untuk Secondary Logo */}
            <ImageUploadField
              label="Logo Sekunder"
              value={site.secondaryLogo}
              onChange={(v) => setSite({ ...site, secondaryLogo: v })}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-5 shadow-soft">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Kontak & Social Media
          </h2>
          <div className="space-y-3 text-xs">
            <Field
              label="Alamat Singkat"
              value={site.address || ""}
              onChange={(v) => setSite({ ...site, address: v })}
            />
            <Field
              label="No. Telepon / WhatsApp"
              value={site.phone || ""}
              onChange={(v) => setSite({ ...site, phone: v })}
            />
            <Field
              label="Email"
              value={site.email || ""}
              onChange={(v) => setSite({ ...site, email: v })}
            />
            <Field
              label="Instagram URL"
              value={site.instagramUrl || ""}
              onChange={(v) =>
                setSite({ ...site, instagramUrl: v })
              }
            />
            <Field
              label="YouTube URL"
              value={site.youtubeUrl || ""}
              onChange={(v) =>
                setSite({ ...site, youtubeUrl: v })
              }
            />
            <Field
              label="Facebook URL"
              value={site.facebookUrl || ""}
              onChange={(v) =>
                setSite({ ...site, facebookUrl: v })
              }
            />
            <Field
              label="TikTok URL"
              value={site.tiktokUrl || ""}
              onChange={(v) =>
                setSite({ ...site, tiktokUrl: v })
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 p-5 shadow-soft">
        <h2 className="mb-3 text-sm font-semibold text-white">
          Location & Maps
        </h2>
        <div className="grid gap-3 text-xs md:grid-cols-2">
          <FieldTextarea
            label="Alamat Lengkap"
            value={location.address || ""}
            onChange={(v) =>
              setLocation({ ...location, address: v })
            }
          />
          <FieldTextarea
            label='Maps Embed "src" URL (dari iframe)'
            value={location.mapsEmbed || ""}
            onChange={(v) =>
              setLocation({ ...location, mapsEmbed: v })
            }
          />
        </div>
      </section>

      <button
        type="submit"
        className="rounded-full bg-navara-violet px-6 py-2.5 text-xs font-semibold text-white hover:bg-navara-royal"
        disabled={status === "saving"}
      >
        {status === "saving"
          ? "Menyimpan..."
          : status === "saved"
          ? "Tersimpan ✓"
          : "Simpan Perubahan"}
      </button>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block font-medium text-slate-300">
        {label}
      </label>
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function FieldTextarea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block font-medium text-slate-300">
        {label}
      </label>
      <textarea
        rows={4}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
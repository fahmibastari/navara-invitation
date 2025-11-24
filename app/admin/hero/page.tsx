// app/admin/hero/page.tsx
"use client"

import { useEffect, useState } from "react"
import { uploadImage } from "@/lib/supabaseClient"

type HeroSlide = {
  id: number
  title: string
  subtitle?: string | null
  imageUrl: string
  order: number
  isActive: boolean
}

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch("/api/admin/hero")
    const json = (await res.json()) as HeroSlide[]
    setSlides(json)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      alert("Pilih gambar dulu.")
      return
    }
    setSaving(true)
    try {
      const imageUrl = await uploadImage(file, "hero")
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          imageUrl,
          order,
          isActive,
        }),
      })
      if (res.ok) {
        setTitle("")
        setSubtitle("")
        setOrder(0)
        setIsActive(true)
        setFile(null)
        await load()
      }
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(slide: HeroSlide) {
    await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...slide,
        isActive: !slide.isActive,
      }),
    })
    load()
  }

  async function deleteSlide(id: number) {
    if (!confirm("Hapus slide ini?")) return
    await fetch(`/api/admin/hero?id=${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-hind text-2xl font-semibold">
          Hero Section
        </h1>
        <p className="text-sm text-slate-400">
          Kelola carousel di bagian atas halaman.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-3xl bg-slate-900 p-5 shadow-soft text-xs"
        >
          <h2 className="mb-1 text-sm font-semibold text-white">
            Tambah Slide Baru
          </h2>
          <div>
            <label className="mb-1 block text-slate-300">
              Judul
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Subjudul (opsional)
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-slate-300">
                Urutan
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                id="hero-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="hero-active">Aktif</label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Gambar Slide
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
              className="text-xs text-slate-300"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !file}
            className="mt-2 w-full rounded-full bg-navara-violet px-4 py-2 text-xs font-semibold text-white hover:bg-navara-royal disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Slide"}
          </button>
        </form>

        <div className="space-y-3">
          {slides.length === 0 && (
            <p className="text-xs text-slate-500">
              Belum ada slide. Tambahkan dari form di sebelah kiri.
            </p>
          )}
          {slides.map((s) => (
            <div
              key={s.id}
              className="flex gap-3 rounded-3xl bg-slate-900 p-3 text-xs shadow-soft"
            >
              <div className="h-20 w-32 overflow-hidden rounded-2xl bg-slate-800">
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-100">
                    #{s.order} {s.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      s.isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {s.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {s.subtitle && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {s.subtitle}
                  </p>
                )}
                <div className="mt-2 flex gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => toggleActive(s)}
                    className="rounded-full bg-slate-800 px-3 py-1 hover:bg-slate-700"
                  >
                    Toggle aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSlide(s.id)}
                    className="rounded-full bg-red-600/80 px-3 py-1 hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

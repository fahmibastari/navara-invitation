// app/admin/gallery/page.tsx
"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { uploadImage } from "@/lib/supabaseClient"

type GalleryImage = {
  id: number
  imageUrl: string
  caption?: string | null
  order: number
}

type GallerySection = {
  id: number
  title: string
  description?: string | null
  images: GalleryImage[]
}

export default function GalleryAdminPage() {
  const [sections, setSections] = useState<GallerySection[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [creating, setCreating] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/gallery")
    const json = (await res.json()) as GallerySection[]
    setSections(json)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreateSection(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setCreating(true)
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create-section",
        title,
        description,
      }),
    })

    setCreating(false)

    if (res.ok) {
      setTitle("")
      setDescription("")
      load()
    } else {
      alert("Gagal membuat section gallery")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-hind text-2xl font-semibold">Gallery</h1>
        <p className="text-sm text-slate-400">
          Kelola section gallery dan upload foto. Semua data ini akan
          tampil di section Gallery di homepage.
        </p>
      </div>

      {/* Form tambah section */}
      <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <form
          onSubmit={handleCreateSection}
          className="space-y-3 rounded-3xl bg-slate-900 p-5 text-xs shadow-soft"
        >
          <h2 className="mb-1 text-sm font-semibold text-white">
            Tambah Section Gallery
          </h2>
          <div>
            <label className="mb-1 block text-slate-300">
              Judul Section
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mis. Foodcourt & Culinary"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Deskripsi (opsional)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sedikit cerita tentang section ini..."
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="mt-2 w-full rounded-full bg-navara-violet px-4 py-2 text-xs font-semibold text-white hover:bg-navara-royal disabled:opacity-60"
          >
            {creating ? "Menyimpan..." : "Tambah Section"}
          </button>
        </form>

        <div className="space-y-3 text-xs">
          <p className="text-slate-400">
            Tips penggunaan:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-slate-400">
            <li>Buat section per area, misalnya: Foodcourt, Villa, dll.</li>
            <li>
              Setelah section dibuat, kamu bisa upload beberapa foto
              untuk tiap section.
            </li>
            <li>
              Urutan foto bisa diatur dengan kolom{" "}
              <span className="font-semibold">Order</span>.
            </li>
          </ul>
        </div>
      </section>

      {/* List section + form upload per section */}
      <section className="space-y-4">
        {loading && (
          <p className="text-xs text-slate-500">Memuat gallery...</p>
        )}
        {!loading && sections.length === 0 && (
          <p className="text-xs text-slate-500">
            Belum ada section gallery. Tambahkan dari form di atas.
          </p>
        )}

        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onRefresh={load}
          />
        ))}
      </section>
    </div>
  )
}

function SectionCard({
  section,
  onRefresh,
}: {
  section: GallerySection
  onRefresh: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [order, setOrder] = useState(
    (section.images[section.images.length - 1]?.order || 0) + 1,
  )
  const [uploading, setUploading] = useState(false)

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      alert("Pilih gambar dulu.")
      return
    }

    setUploading(true)
    try {
      // upload ke Supabase, folder "gallery"
      const imageUrl = await uploadImage(file, "gallery")

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-image",
          sectionId: section.id,
          imageUrl,
          caption,
          order,
        }),
      })

      if (!res.ok) {
        alert("Gagal menyimpan gambar ke database.")
      } else {
        setFile(null)
        setCaption("")
        setOrder(order + 1)
        onRefresh()
      }
    } catch (err) {
      console.error(err)
      alert("Gagal upload gambar ke storage.")
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteImage(id: number) {
    if (!confirm("Hapus foto ini dari gallery?")) return

    const res = await fetch(
      `/api/admin/gallery?type=image&id=${id}`,
      { method: "DELETE" },
    )
    if (!res.ok) {
      alert("Gagal menghapus foto.")
    } else {
      onRefresh()
    }
  }

  async function handleDeleteSection() {
    if (
      !confirm(
        "Hapus section ini beserta semua fotonya? Tindakan ini tidak bisa dibatalkan.",
      )
    )
      return

    const res = await fetch(
      `/api/admin/gallery?type=section&id=${section.id}`,
      { method: "DELETE" },
    )
    if (!res.ok) {
      alert("Gagal menghapus section.")
    } else {
      onRefresh()
    }
  }

  return (
    <div className="rounded-3xl bg-slate-900 p-4 text-xs shadow-soft">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {section.title}
          </h3>
          {section.description && (
            <p className="mt-1 text-[11px] text-slate-400">
              {section.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleDeleteSection}
          className="rounded-full bg-red-600/80 px-3 py-1 text-[11px] hover:bg-red-600"
        >
          Hapus Section
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
        {/* Form upload gambar */}
        <form
          onSubmit={handleAddImage}
          className="space-y-3 rounded-2xl bg-slate-950/40 p-3"
        >
          <p className="text-[11px] font-semibold text-slate-200">
            Tambah Foto
          </p>
          <div>
            <label className="mb-1 block text-slate-300">
              File Gambar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
              className="text-[11px] text-slate-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Caption (opsional)
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Mis. Night view of Navara"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Order (urutan)
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={order}
              onChange={(e) =>
                setOrder(Number(e.target.value) || 1)
              }
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full rounded-full bg-navara-violet px-4 py-2 text-[11px] font-semibold text-white hover:bg-navara-royal disabled:opacity-60"
          >
            {uploading ? "Mengupload..." : "Tambah Foto"}
          </button>
        </form>

        {/* List gambar */}
        <div className="space-y-2">
          {section.images.length === 0 && (
            <p className="text-[11px] text-slate-500">
              Belum ada foto di section ini.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {section.images.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40"
              >
                <div className="h-28 w-full overflow-hidden bg-slate-800">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || section.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1 p-2">
                  <p className="text-[10px] font-semibold text-slate-100">
                    #{img.order} {img.caption || "Tanpa caption"}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="w-full rounded-full bg-red-600/80 px-2 py-1 text-[10px] text-white hover:bg-red-600"
                  >
                    Hapus Foto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

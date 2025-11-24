// app/admin/facilities/page.tsx
"use client"

import { useEffect, useState } from "react"

type Facility = {
  id: number
  name: string
  description?: string | null
  icon?: string | null
}

export default function FacilitiesAdminPage() {
  const [items, setItems] = useState<Facility[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")

  async function load() {
    const res = await fetch("/api/admin/facilities")
    const json = (await res.json()) as Facility[]
    setItems(json)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/admin/facilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, icon }),
    })
    setName("")
    setDescription("")
    setIcon("")
    load()
  }

  async function deleteFacility(id: number) {
    if (!confirm("Hapus fasilitas ini?")) return
    await fetch(`/api/admin/facilities?id=${id}`, {
      method: "DELETE",
    })
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-hind text-2xl font-semibold">
          Facilities
        </h1>
        <p className="text-sm text-slate-400">
          Fasilitas yang tampil di section Facilities di homepage.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-3xl bg-slate-900 p-5 text-xs shadow-soft"
        >
          <h2 className="mb-1 text-sm font-semibold text-white">
            Tambah Fasilitas
          </h2>
          <div>
            <label className="mb-1 block text-slate-300">
              Nama Fasilitas
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Deskripsi
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Icon (teks pendek / emoji, opsional)
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-navara-violet px-4 py-2 text-xs font-semibold text-white hover:bg-navara-royal"
          >
            Tambah Fasilitas
          </button>
        </form>

        <div className="space-y-3">
          {items.map((f) => (
            <div
              key={f.id}
              className="flex items-start gap-3 rounded-3xl bg-slate-900 p-3 text-xs shadow-soft"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-navara-violet/25 text-sm">
                {f.icon || "★"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100">
                  {f.name}
                </p>
                {f.description && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {f.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteFacility(f.id)}
                className="rounded-full bg-red-600/80 px-3 py-1 text-[11px] hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-xs text-slate-500">
              Belum ada fasilitas.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

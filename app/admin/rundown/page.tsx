// app/admin/rundown/page.tsx
"use client"

import { useEffect, useState } from "react"

type RundownItem = {
  id: number
  title: string
  description?: string | null
  startTime?: string | null
  endTime?: string | null
  order: number
  isActive: boolean
}

export default function RundownAdminPage() {
  const [items, setItems] = useState<RundownItem[]>([])
  const [form, setForm] = useState<Omit<RundownItem, "id">>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    order: 0,
    isActive: true,
  })
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch("/api/admin/rundown")
    const json = (await res.json()) as RundownItem[]
    setItems(json)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/admin/rundown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setForm({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      order: 0,
      isActive: true,
    })
    load()
  }

  async function deleteItem(id: number) {
    if (!confirm("Hapus item rundown?")) return
    await fetch(`/api/admin/rundown?id=${id}`, {
      method: "DELETE",
    })
    load()
  }

  async function toggleActive(item: RundownItem) {
    await fetch("/api/admin/rundown", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        isActive: !item.isActive,
      }),
    })
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-hind text-2xl font-semibold">Rundown</h1>
        <p className="text-sm text-slate-400">
          Atur alur acara yang akan ditampilkan di halaman utama.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-3xl bg-slate-900 p-5 text-xs shadow-soft"
        >
          <h2 className="mb-1 text-sm font-semibold text-white">
            Tambah Item Rundown
          </h2>
          <div>
            <label className="mb-1 block text-slate-300">
              Judul
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-300">
              Deskripsi singkat
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-slate-300">
                Mulai (mis. 08.00)
              </label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
                value={form.startTime || ""}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-300">
                Selesai
              </label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
                value={form.endTime || ""}
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-slate-300">
                Urutan
              </label>
              <input
                type="number"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
                value={form.order}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="rundown-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <label htmlFor="rundown-active">Aktif</label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full bg-navara-violet px-4 py-2 text-xs font-semibold text-white hover:bg-navara-royal disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Tambah Item"}
          </button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-3xl bg-slate-900 p-3 text-xs shadow-soft"
            >
              <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-navara-violet text-[11px] font-semibold text-white">
                {item.order}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-100">
                    {item.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      item.isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {item.startTime}{" "}
                  {item.endTime ? `– ${item.endTime}` : ""}
                </p>
                {item.description && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {item.description}
                  </p>
                )}
                <div className="mt-2 flex gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => toggleActive(item)}
                    className="rounded-full bg-slate-800 px-3 py-1 hover:bg-slate-700"
                  >
                    Toggle aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="rounded-full bg-red-600/80 px-3 py-1 hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-xs text-slate-500">
              Belum ada rundown, tambahkan dari form di kiri.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

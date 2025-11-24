// app/admin/about/page.tsx
"use client"

import { useEffect, useState } from "react"

export default function AboutAdminPage() {
  const [title, setTitle] = useState("About Navara")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  )

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/admin/about")
      if (!res.ok) return
      const json = await res.json()
      if (json) {
        setTitle(json.title)
        setContent(json.content)
      }
    })()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setStatus("saving")
    const res = await fetch("/api/admin/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
    if (res.ok) setStatus("saved")
    else setStatus("idle")
    setTimeout(() => setStatus("idle"), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <h1 className="font-hind text-2xl font-semibold">About</h1>
        <p className="text-sm text-slate-400">
          Deskripsi singkat Navara City Park yang muncul di halaman
          utama.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 p-5 shadow-soft">
        <div className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block font-medium text-slate-300">
              Judul Section
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-300">
              Isi Deskripsi (boleh beberapa paragraf)
            </label>
            <textarea
              rows={10}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-navara-violet focus:ring-1 focus:ring-navara-violet/60"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </div>

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

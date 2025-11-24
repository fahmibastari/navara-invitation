"use client"

import { useState } from "react"
import { ListChecks, UserCheck, Clock, Send, Loader2, CalendarCheck } from "lucide-react"

// Tipe data dipertahankan sama persis
type RundownItem = {
  id: number
  title: string
  description?: string | null
  startTime?: string | Date | null
  endTime?: string | Date | null
}

type RundownSectionProps = {
  rundown: RundownItem[]
}

// =========================================================================
// RUNDOWN SECTION UTAMA
// =========================================================================

export default function RundownSection({ rundown }: RundownSectionProps) {
  // State dipertahankan sama persis
  const [activeTab, setActiveTab] = useState<"rundown" | "confirm">(
    "rundown",
  )

  return (
    <section
      id="rundown"
      // Mengubah background gradien menjadi background putih atau abu-abu terang yang konsisten
      className="py-24 bg-gray-50"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/*
          HEADER & TAB TOGGLE - Diselaraskan dengan Desain
          Menggunakan gaya tipografi yang konsisten (font-extrabold, gradien)
        */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          
          {/* Judul Konten */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-xs font-semibold uppercase text-gray-700 mb-3 border border-gray-200">
                <CalendarCheck className="w-4 h-4 text-purple-600" />
                Rundown
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Rundown Acara & {" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Konfirmasi
                </span>
            </h2>
            <p className="mt-2 text-lg text-gray-600 max-w-xl">
            Jangan sampai terlewat keseruannya! Cek jadwal lengkap acara kami di sini dan kabari kami jika Anda bisa hadir.
            </p>
          </div>
          
          {/* Toggle Tab - Mengganti warna aksen dan shadow */}
          <div className="inline-flex rounded-full bg-white p-1 shadow-lg shadow-gray-100/50 border border-gray-100 self-start md:self-end">
            <button
              onClick={() => setActiveTab("rundown")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === "rundown"
                  // Warna aktif diselaraskan ke indigo-600
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <ListChecks className="w-4 h-4 inline mr-2" /> Rundown
            </button>
            <button
              onClick={() => setActiveTab("confirm")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === "confirm"
                  // Warna aktif diselaraskan ke indigo-600
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <UserCheck className="w-4 h-4 inline mr-2" /> Konfirmasi Kehadiran
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid gap-8 md:grid-cols-[3fr,2fr]">
          
          {/* Rundown List (Panel Kiri) */}
          <div className={`transition-all duration-500 ${activeTab === "rundown" ? "block" : "hidden md:block"}`}>
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 border border-gray-100 md:p-8">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Susunan Acara Utama
              </h3>
              
              {/* Rundown Item Check */}
              {(!rundown || rundown.length === 0) && (
                <p className="text-base text-gray-500 py-4">
                  Rundown belum diatur. Tambahkan dari halaman admin.
                </p>
              )}
              
              {/* Timeline List */}
              <ol className="relative border-l border-gray-200 space-y-6 ml-3">
                {rundown?.map((item, idx) => (
                  <li
                    key={item.id}
                    className="ml-8" // Menyesuaikan margin untuk titik timeline
                  >
                    {/* Timeline Dot */}
                    <div className="absolute w-4 h-4 bg-indigo-500 rounded-full mt-1.5 -left-2.5 border-4 border-white ring-2 ring-indigo-300 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>

                    {/* Content Card - Dibuat lebih elegan */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-shadow duration-300 hover:shadow-md">
                        <p className="text-base font-semibold text-gray-900 mb-1">
                          {item.title}
                        </p>
                        
                        {/* Waktu (Mempertahankan Logika formatTimeRange) */}
                        {(item.startTime || item.endTime) && (
                          <p className="flex items-center text-sm font-medium text-indigo-600 mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {/* Menggunakan fungsi formatTimeRange yang didefinisikan di bawah */}
                            {typeof item.startTime === 'string' ? item.startTime : item.startTime?.toString()}

      {item.endTime ? `– ${typeof item.endTime === 'string' ? item.endTime : item.endTime?.toString()}` : ""} 
                          </p>
                        )}
                        
                        {/* Deskripsi */}
                        {item.description && (
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* RSVP form (Panel Kanan) */}
          <div className={`transition-all duration-500 ${activeTab === "confirm" ? "block" : "hidden md:block"}`}>
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 border border-gray-100 md:p-8 sticky top-6">
              <ConfirmForm />
            </div>
          </div>
        </div>
        
        {/* Konten akan ditampilkan berdasarkan activeTab hanya pada mobile */}
        {activeTab === "confirm" && (
            <div className="md:hidden mt-8">
                <div className="rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <ConfirmForm />
                </div>
            </div>
        )}

      </div>
    </section>
  )
}

// =========================================================================
// HELPER FUNCTION: formatTimeRange (Dipertahankan)
// =========================================================================

function formatTimeRange(start: string | Date, end?: string | Date | null) {
  try {
    const s = new Date(start)
    const e = end ? new Date(end) : null
    const opts: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Menghilangkan AM/PM
    }
    const sStr = s.toLocaleTimeString("id-ID", opts)
    const eStr = e ? e.toLocaleTimeString("id-ID", opts) : null
    return eStr ? `${sStr} - ${eStr}` : sStr
  } catch {
    return ""
  }
}

// --- Bagian RundownSection (Tidak berubah, fokus ke ConfirmForm di bawah) ---
// ... (Kode RundownSection sama seperti sebelumnya, langsung ke ConfirmForm)

// =========================================================================
// CONFIRMATION FORM
// =========================================================================

function ConfirmForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    institution: "",
    attendanceOption: "yes", // Default di state UI saja
    notes: "",
  })
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      // Kirim data apa adanya, backend yang akan membersihkan
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Kirim object form langsung karena key sudah sesuai
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal mengirim data.")

      setStatus("success")
      
      // Pesan sukses berdasarkan pilihan
      if (form.attendanceOption === 'yes') {
          setMessage("Terima kasih! Kehadiran Anda berhasil tercatat.")
      } else {
          setMessage("Terima kasih atas informasinya.")
      }

      // Reset form
      setForm({
        fullName: "",
        email: "",
        institution: "",
        attendanceOption: "yes",
        notes: "",
      })
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-sm">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-900">Konfirmasi Kehadiran</h3>
        <p className="mt-1 text-sm text-gray-600">Isi formulir untuk konfirmasi.</p>
      </div>

      <div className="space-y-4">
        
        {/* Nama Lengkap */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Nama Lengkap</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none"
            placeholder="Nama Anda"
          />
        </div>
        
        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none"
            placeholder="email@anda.com"
          />
        </div>
        
        {/* Instansi */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Asal Instansi</label>
          <input
            type="text"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none"
            placeholder="Kantor / Organisasi"
          />
        </div>
      
        {/* Pilihan Kehadiran */}
        <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Pilihan Kehadiran</label>
            <div className="flex gap-4">
                {/* Opsi Ya */}
                <div 
                    onClick={() => setForm({ ...form, attendanceOption: 'yes' })}
                    className={`w-1/2 p-3 rounded-xl border cursor-pointer transition ${
                        form.attendanceOption === 'yes' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 bg-gray-50'
                    }`}
                >
                    <span className="block text-sm font-semibold text-gray-800">Hadir (Ya)</span>
                </div>

                {/* Opsi Tidak */}
                <div 
                    onClick={() => setForm({ ...form, attendanceOption: 'no' })}
                    className={`w-1/2 p-3 rounded-xl border cursor-pointer transition ${
                        form.attendanceOption === 'no' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 bg-gray-50'
                    }`}
                >
                    <span className="block text-sm font-semibold text-gray-800">Tidak Hadir</span>
                </div>
            </div>
        </div>
        
        {/* Catatan */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Catatan</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <p className={`text-sm py-2 px-4 rounded-lg font-medium ${status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin"/> Mengirim...</> : <><Send className="w-4 h-4"/> Kirim</>}
      </button>
    </form>
  )
}
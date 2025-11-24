"use client"

import { useState } from "react"
import { Send, Phone, Mail, MessageSquare } from "lucide-react"

export default function ContactSection() {
  // State manajemen form dipertahankan
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [feedback, setFeedback] = useState("")

  // Fungsi handleSubmit dipertahankan sama persis
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setFeedback("")

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          notes: form.message,
          guestsCount: 1, // Dipertahankan
          status: "message", // Dipertahankan
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan saat mengirim pesan.")

      setStatus("success")
      setFeedback("Pesan Anda sudah terkirim. Terima kasih atas minat Anda!")
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      })
    } catch (err: any) {
      setStatus("error")
      setFeedback(err.message || "Gagal terhubung ke server. Silakan coba lagi.")
    }
  }

  // Kelas input yang disederhanakan dan dipercantik
  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-800 outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-gray-400"
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600"

  return (
    <section
      id="contact"
      className="py-24 bg-gray-50"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Kontainer Utama - Menggunakan skema 2 kolom yang lebih modern */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* KOLOM KIRI: Formulir Kontak */}
          <div>
            {/*
              HEADER BLOCK - Diselaraskan dengan Desain
            */}
            <div className="mb-8">
                {/* Badge Style: Sesuai dengan komponen lain */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-200 rounded-full text-xs font-semibold uppercase text-gray-700 mb-3 border border-gray-300">
                    <Send className="w-4 h-4 text-purple-600" />
                    Connect
                </div>
                
                {/* Judul Utama: Menggunakan font tebal dan aksen gradien ungu-biru */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    Hubungi {" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
                      Navara
                    </span>
                </h2>
                <p className="mt-3 text-lg text-gray-600">
                  Untuk reservasi, kerjasama event, atau informasi lebih lanjut, isi formulir berikut.
                </p>
            </div>

            {/* FORMULIR */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Field Nama */}
              <div>
                <label className={labelClass}>Nama *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Nama Lengkap Anda"
                />
              </div>

              {/* Fields Phone & Email (Grid) */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>No. WhatsApp</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Contoh: 0812xxxxxx"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    placeholder="email@anda.com"
                  />
                </div>
              </div>
              
              {/* Field Pesan */}
              <div>
                <label className={labelClass}>Pesan</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={inputClass + " resize-none"} // Tambahkan resize-none
                  placeholder="Detail pertanyaan atau permintaan kerjasama"
                />
              </div>

              {/* Feedback Message */}
              {feedback && (
                <p
                  className={`text-sm font-medium ${
                    status === "success"
                      ? "text-emerald-600"
                      : "text-red-600"
                  } p-3 rounded-xl ${
                    status === "success"
                      ? "bg-emerald-50"
                      : "bg-red-50"
                  }`}
                >
                  {feedback}
                </p>
              )}

              {/* Submit Button - Menggunakan gaya premium (gradien + shadow) */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex justify-center items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
              >
                {status === "loading" ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                    </>
                ) : (
                    <>
                        Kirim Pesan
                        <Send className="w-4 h-4" />
                    </>
                )}
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: Informasi Kontak Tambahan / Ringkasan */}
          <div className="space-y-6">
            
            {/* Kartu Informasi Singkat - Dibuat lebih menonjol */}
            <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-indigo-100 border border-gray-100">
              <MessageSquare className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Ringkasan Navara City Park
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Navara City Park adalah destinasi rekreasi keluarga yang
                menggabungkan penginapan, kuliner, dan wahana bermain
                dalam satu kawasan hijau yang modern dan elegan. Kami berkomitmen untuk memberikan pengalaman terbaik bagi setiap pengunjung.
              </p>
            </div>

            {/* Kontak Cepat (Tambahan untuk estetika) */}
            <div className="rounded-3xl bg-gray-900 text-white p-8 shadow-2xl shadow-gray-900/10">
                <h3 className="mb-5 text-xl font-bold text-white border-b border-gray-700 pb-3">
                    Kontak Cepat
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-400">Telepon / WhatsApp</p>
                            <a href="tel:+6281234567890" className="text-lg font-semibold hover:text-cyan-400 transition">+62 812 3456 7890</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-400">Email Resmi</p>
                            <a href="mailto:info@navaracitypark.com" className="text-lg font-semibold hover:text-cyan-400 transition">info@navaracitypark.com</a>
                        </div>
                    </div>
                </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
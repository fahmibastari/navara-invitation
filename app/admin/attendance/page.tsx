"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, HelpCircle, Trash2 } from "lucide-react"

type Attendance = {
  id: number
  fullName: string | null
  email: string | null
  institution: string | null
  attendanceOption: string | null // Bisa null sekarang
  notes: string | null
  createdAt: string
}

export default function AttendanceAdminPage() {
  const [data, setData] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
        const res = await fetch("/api/attendance?limit=500")
        const json = await res.json()
        setData(json)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
      if(!confirm("Hapus data ini?")) return;
      await fetch(`/api/attendance?id=${id}`, { method: "DELETE" });
      load(); // Refresh data
  }

  const renderStatus = (opt: string | null) => {
    if (!opt) return <span className="text-slate-500 text-xs">-</span>;
    
    const val = opt.toLowerCase();
    if (val === 'yes') {
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs"><CheckCircle className="w-3 h-3"/> Hadir</span>
    } else if (val === 'no') {
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs"><XCircle className="w-3 h-3"/> Tidak Hadir</span>
    } else {
        // Untuk data lama (status: 'confirmed' dsb)
        return <span className="text-slate-400 text-xs">{val}</span>
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Data Kehadiran</h1>
        <button onClick={load} className="bg-slate-800 px-4 py-2 rounded-full text-xs text-white hover:bg-slate-700">Refresh</button>
      </div>

      <div className="overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="sticky top-0 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Nama Lengkap</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Instansi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Catatan</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-white">{row.fullName || '-'}</td>
                  <td className="px-4 py-3">{row.email || '-'}</td>
                  <td className="px-4 py-3">{row.institution || '-'}</td>
                  <td className="px-4 py-3">{renderStatus(row.attendanceOption)}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={row.notes || ''}>{row.notes || '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(row.createdAt).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
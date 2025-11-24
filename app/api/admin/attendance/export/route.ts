import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Fungsi ini digunakan untuk meng-export data kehadiran ke format CSV.
export async function GET() {
  const list = await prisma.attendance.findMany({
    orderBy: { createdAt: "desc" },
  })

  // 1. HEADER (Disinkronkan dengan model Attendance yang baru)
  const header = [
    "id",
    "fullName", 
    "email",
    "institution", // Menggantikan 'phone'
    "Attendance Option", // Menggantikan 'status'/'guestsCount'
    "notes",
    "createdAt",
  ]

  // 2. MAPPING DATA (Menggunakan properti dari objek 'a' yang valid)
  const rows = list.map((a) => [
    a.id,
    // fullName dan email sekarang String? (bisa null), jadi harus ditangani dengan '?? ""'
    `"${(a.fullName ?? "").replace(/"/g, '""')}"`,
    a.email ?? "", 
    a.institution ?? "", 
    a.attendanceOption, // Menggunakan attendanceOption (default "yes")
    `"${(a.notes ?? "").replace(/"/g, '""')}"`,
    a.createdAt.toISOString(),
  ])

  // 3. Membuat CSV
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join(
    "\n",
  )

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="attendance-navara.csv"`,
    },
  })
}
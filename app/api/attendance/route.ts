import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// Tipe data input (semua opsional)
type Payload = {
  fullName?: string | null
  email?: string | null
  institution?: string | null
  notes?: string | null
  attendanceOption?: string | null
}

// Helper: Ubah string kosong "" atau " " menjadi null
const clean = (val: string | null | undefined) => {
  if (typeof val === "string" && val.trim() !== "") {
    return val.trim();
  }
  return null;
}

// --- POST: Simpan Data ---
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload
    
    // Langsung petakan data. Gunakan helper 'clean' agar string kosong jadi null di DB.
    const data: Prisma.AttendanceCreateInput = {
        fullName: clean(body.fullName),
        email: clean(body.email),
        institution: clean(body.institution),
        attendanceOption: clean(body.attendanceOption),
        notes: clean(body.notes),
    }

    const attendance = await prisma.attendance.create({ data })

    return NextResponse.json({ success: true, attendance }, { status: 201 })
  } catch (err) {
    console.error("POST Error:", err)
    return NextResponse.json({ error: "Gagal menyimpan data." }, { status: 500 })
  }
}

// --- GET: Ambil Data ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit") || "500")
    
    // Ambil semua data, urutkan dari terbaru
    const list = await prisma.attendance.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(list)
  } catch (err) {
    console.error("GET Error:", err)
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 })
  }
}

// --- DELETE: Hapus Data ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get("id"))

    if (!id || isNaN(id)) {
        return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    await prisma.attendance.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus data." }, { status: 500 })
  }
}
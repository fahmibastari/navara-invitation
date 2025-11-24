import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  // Ambil rundown yang aktif dan urutkan berdasarkan order
  const items = await prisma.rundownItem.findMany({
    where: { isActive: true },  // Pastikan hanya yang aktif
    orderBy: { order: "asc" },  // Urutkan berdasarkan order
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json();

  // Langsung simpan waktu dalam format string
  const item = await prisma.rundownItem.create({
    data: {
      title: body.title,
      description: body.description,
      startTime: body.startTime,  // Menyimpan sebagai string
      endTime: body.endTime,      // Menyimpan sebagai string
      order: body.order,
      isActive: body.isActive
    }
  });

  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...rest } = body
  const item = await prisma.rundownItem.update({
    where: { id },
    data: rest,
  })
  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))
  if (!id) {
    return NextResponse.json(
      { error: "id wajib diisi" },
      { status: 400 },
    )
  }
  await prisma.rundownItem.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

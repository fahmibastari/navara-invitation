// app/api/admin/hero/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  })
  return NextResponse.json(slides)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const slide = await prisma.heroSlide.create({ data: body })
    return NextResponse.json(slide)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Gagal membuat slide." },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: rest,
    })
    return NextResponse.json(slide)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Gagal mengupdate slide." },
      { status: 500 },
    )
  }
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
  await prisma.heroSlide.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

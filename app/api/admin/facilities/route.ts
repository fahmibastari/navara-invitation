// app/api/admin/facilities/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const items = await prisma.facility.findMany({
    orderBy: { id: "asc" },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json()
  const facility = await prisma.facility.create({ data: body })
  return NextResponse.json(facility)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, ...rest } = body
  const facility = await prisma.facility.update({
    where: { id },
    data: rest,
  })
  return NextResponse.json(facility)
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
  await prisma.facility.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

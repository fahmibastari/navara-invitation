// app/api/admin/about/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const about = await prisma.about.findFirst()
  return NextResponse.json(about)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, content } = body

    const about = await prisma.about.upsert({
      where: { id: 1 },
      update: { title, content },
      create: { id: 1, title, content },
    })

    return NextResponse.json(about)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Gagal menyimpan about." },
      { status: 500 },
    )
  }
}

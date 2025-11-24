import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const music = await prisma.music.findFirst() // Ambil data musik pertama
  if (!music) {
    return NextResponse.json({ error: "Musik tidak ditemukan" }, { status: 404 })
  }
  
  return NextResponse.json({ url: music.url })
}

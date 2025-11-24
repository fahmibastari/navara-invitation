// app/api/admin/gallery/route.ts
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const sections = await prisma.gallerySection.findMany({
      orderBy: { id: "asc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error("Error load gallery:", error)
    return NextResponse.json(
      { error: "Gagal memuat data gallery" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Buat section baru
    if (body.action === "create-section") {
      const { title, description } = body

      if (!title || typeof title !== "string") {
        return NextResponse.json(
          { error: "Title wajib diisi" },
          { status: 400 },
        )
      }

      const section = await prisma.gallerySection.create({
        data: {
          title,
          description: description || null,
        },
      })

      return NextResponse.json(section, { status: 201 })
    }

    // Tambah image ke section
    if (body.action === "create-image") {
      const { sectionId, imageUrl, caption, order } = body

      if (!sectionId || !imageUrl) {
        return NextResponse.json(
          { error: "sectionId dan imageUrl wajib diisi" },
          { status: 400 },
        )
      }

      const image = await prisma.galleryImage.create({
        data: {
          sectionId: Number(sectionId),
          imageUrl,
          caption: caption || null,
          order:
            typeof order === "number" && !Number.isNaN(order) ? order : 1,
        },
      })

      return NextResponse.json(image, { status: 201 })
    }

    return NextResponse.json(
      { error: "Action tidak dikenali" },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error simpan gallery:", error)
    return NextResponse.json(
      { error: "Gagal menyimpan data gallery" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const idParam = searchParams.get("id")

    const id = idParam ? Number(idParam) : NaN
    if (!type || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Query param type dan id wajib diisi" },
        { status: 400 },
      )
    }

    if (type === "section") {
      await prisma.gallerySection.delete({
        where: { id },
      })
      // relation GalleryImage sudah onDelete: Cascade di schema.prisma
      return NextResponse.json({ success: true })
    }

    if (type === "image") {
      await prisma.galleryImage.delete({
        where: { id },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "type tidak valid" },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error hapus gallery:", error)
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 },
    )
  }
}

// app/api/admin/site/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const [siteConfig, location] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.locationConfig.findFirst(),
  ])

  return NextResponse.json({ siteConfig, location })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { siteConfig, location } = body

    // Pastikan nilai yang dikirim ke Prisma tidak undefined, hanya null atau string
    const sanitizedSiteConfig = {
      name: siteConfig.name,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      // Logo sekarang bisa berupa string (Base64 atau URL) atau null
      primaryLogo: siteConfig.primaryLogo || null, 
      secondaryLogo: siteConfig.secondaryLogo || null, // Logo sekunder juga
      address: siteConfig.address || null,
      phone: siteConfig.phone || null,
      email: siteConfig.email || null,
      instagramUrl: siteConfig.instagramUrl || null,
      youtubeUrl: siteConfig.youtubeUrl || null,
      facebookUrl: siteConfig.facebookUrl || null,
      tiktokUrl: siteConfig.tiktokUrl || null,
    }

    const site = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: sanitizedSiteConfig,
      create: {
        id: 1,
        ...sanitizedSiteConfig,
      },
    })

    const sanitizedLocation = {
      address: location.address || null,
      mapsEmbed: location.mapsEmbed || null,
    }

    const loc = await prisma.locationConfig.upsert({
      where: { id: 1 },
      update: sanitizedLocation,
      create: {
        id: 1,
        ...sanitizedLocation,
      },
    })

    return NextResponse.json({ siteConfig: site, location: loc })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Gagal menyimpan konfigurasi." },
      { status: 500 },
    )
  }
}
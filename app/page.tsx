// app/page.tsx
import prisma from "@/lib/prisma"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import RundownSection from "@/components/RundownSection"
import FacilitiesSection from "@/components/FacilitiesSection"
import GallerySection from "@/components/GallerySection"
import LocationSection from "@/components/LocationSection"
import TestimonialSection from "@/components/TestimonialSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import MusicPlayer from '@/components/MusicPlayer'

export const dynamic = "force-dynamic"

export default async function Home() {
  const [
    siteConfig,
    heroSlides,
    about,
    rundown,
    facilities,
    gallerySections,
    testimonials,
    locationConfig,
    music, // Pindahkan ke Promise.all
  ] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.about.findFirst(),
    prisma.rundownItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.facility.findMany(),
    prisma.gallerySection.findMany({
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      take: 9,
    }),
    prisma.locationConfig.findFirst(),
    prisma.music.findFirst(), // Ambil musik di sini
  ])

  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection siteConfig={siteConfig} slides={heroSlides} />
      <RundownSection rundown={rundown} />
      <LocationSection location={locationConfig} />
      <AboutSection about={about} />
      <FacilitiesSection facilities={facilities} />
      <GallerySection sections={gallerySections} />
      <TestimonialSection testimonials={testimonials} />
      <ContactSection />
      <Footer siteConfig={siteConfig} />
      
      {/* Render MusicPlayer hanya jika ada musik dan URL-nya valid */}
      {music?.url && <MusicPlayer audioUrl={music.url} />}
    </main>
  )
}
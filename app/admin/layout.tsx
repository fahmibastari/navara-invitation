// app/admin/layout.tsx
import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="font-hind text-sm font-semibold">
            Navara Admin
          </div>
          <nav className="flex flex-wrap gap-3 text-[11px] text-slate-300">
            <a href="/admin">Dashboard</a>
            <a href="/admin/site">Site</a>
            <a href="/admin/about">About</a>
            <a href="/admin/hero">Hero</a>
            <a href="/admin/rundown">Rundown</a>
            <a href="/admin/facilities">Facilities</a>
            <a href="/admin/gallery">Gallery</a>
            <a href="/admin/testimonials">Testimonial</a>
            <a href="/admin/attendance">Attendance</a>
            <a href="/admin/music">Music</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

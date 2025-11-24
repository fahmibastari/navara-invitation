// app/admin/page.tsx
import Link from "next/link"

export default function AdminHome() {
  return (
    <div>
      <h1 className="font-hind text-2xl font-semibold">
        Admin • Navara City Park
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Panel Admin
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <AdminCard
          title="Site & Location"
          description="Nama, tagline, deskripsi, alamat, maps embed, social media."
          href="/admin/site"
        />
        <AdminCard
          title="About"
          description="Edit deskripsi singkat Navara."
          href="/admin/about"
        />
        <AdminCard
          title="Hero Section"
          description="Kelola slide carousel hero."
          href="/admin/hero"
        />
        <AdminCard
          title="Rundown & Attendance"
          description="Rundown acara dan data konfirmasi kehadiran."
          href="/admin/rundown"
        />
        <AdminCard
          title="Facilities"
          description="Tambah / ubah fasilitas."
          href="/admin/facilities"
        />
        <AdminCard
          title="Gallery & Testimonials"
          description="Kelola gallery foto & testimoni pengunjung."
          href="/admin/gallery"
        />
        <AdminCard
          title="Kehadiran"
          description="Lihat pengisi form kehadiran."
          href="/admin/attendance"
        />
        <AdminCard
          title="Musik"
          description="Kelola Musik di Landing Page"
          href="/admin/music"
        />
      </div>
    </div>
  )
}

function AdminCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl bg-slate-900/70 p-4 shadow-soft transition hover:-translate-y-1 hover:bg-slate-900 hover:shadow-xl"
    >
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <p className="mt-1 flex-1 text-xs text-slate-400">
        {description}
      </p>
      <span className="mt-3 text-[11px] font-medium text-navara-sky">
        Kelola →
      </span>
    </Link>
  )
}

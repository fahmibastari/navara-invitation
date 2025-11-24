type TestimonialSectionProps = {
  testimonials: any[]
}

export default function TestimonialSection({
  testimonials,
}: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section
      id="testimonials"
      className="section-animate bg-slate-100 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navara-violet">
              Voices of Navara
            </p>
            <h2 className="font-hind text-2xl font-semibold md:text-3xl">
              Testimonial Pengunjung
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Tersusun dari ulasan terbaik pengunjung Navara City Park.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="flex h-full flex-col rounded-3xl bg-white p-4 shadow-soft"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-navara-violet/10" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Rating {t.rating}/5
                  </p>
                </div>
              </div>
              <p className="flex-1 text-xs text-slate-600">
                “{t.comment}”
              </p>
              {t.sourceUrl && (
                <a
                  href={t.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-[11px] font-medium text-navara-royal underline"
                >
                  Lihat detail ulasan
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { TESTIMONIALS, type Testimonial } from '@/data/testimonials'
import { cn } from '@/utils/cn'

const marketBorderColor: Record<Testimonial['market'], string> = {
  senior: 'border-l-[#2D6A4F]',
  family: 'border-l-[#E63946]',
  balance: 'border-l-[#2C1503]',
}

const marketLabel: Record<Testimonial['market'], string> = {
  senior: 'Senior profile',
  family: 'Family profile',
  balance: 'Balance profile',
}

export function TestimonialsSection() {
  return (
    <section className="bg-[#FFF8E7] py-20" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          id="testimonials-heading"
          className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] text-center mb-14"
        >
          Real people. Real simplicity.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.id}
              className={cn(
                'bg-white rounded-3xl border-2 border-[#2C1503] p-8 shadow-[4px_4px_0px_#2C1503]',
                'border-l-8',
                marketBorderColor[t.market],
              )}
            >
              {/* Decorative quote mark */}
              <span
                className="block text-6xl font-extrabold text-[#FFB703] leading-none mb-2 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <p className="text-[#2C1503] leading-relaxed mb-6">{t.quote}</p>

              <footer>
                <cite className="not-italic">
                  <span className="block font-extrabold text-[#2C1503]">{t.name}</span>
                  <span className="block text-sm text-[#5A4A3A]">{t.location}</span>
                  <span
                    className="inline-block mt-2 text-xs font-bold uppercase tracking-wider text-[#5A4A3A]"
                    aria-label={marketLabel[t.market]}
                  >
                    {t.profile} profile
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

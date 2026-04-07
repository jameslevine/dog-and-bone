import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/components/organisms/HeroSection'
import { ValuePropsSection } from '@/components/organisms/ValuePropsSection'
import { ProfileSelector } from '@/components/organisms/ProfileSelector'
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection'
import { CTABanner } from '@/components/organisms/CTABanner'

export function HomePage() {
  return (
    <main>
      <HeroSection />

      <ValuePropsSection />

      {/* Product overview / profile teaser */}
      <section className="bg-white py-20" aria-labelledby="profiles-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2
              id="profiles-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4"
            >
              Choose Your Profile
            </h2>
            <p className="text-lg text-[#5A4A3A] max-w-xl mx-auto leading-relaxed">
              One device, four setups. Each phone is hand-configured by us before it arrives at your
              door.
            </p>
          </div>

          <ProfileSelector />

          <div className="text-center mt-10">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 text-[#2C1503] font-bold hover:text-[#FFB703] transition-colors"
            >
              See full details in our store
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <CTABanner />
    </main>
  )
}

import { Link } from 'react-router-dom'
import { Button, Logo } from '@/components/atoms'

export function CTABanner() {
  return (
    <section className="bg-[#2C1503] py-20" aria-labelledby="cta-banner-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
        <Logo variant="compact" size="md" />

        <h2
          id="cta-banner-heading"
          className="text-3xl sm:text-4xl font-extrabold text-white leading-tight"
        >
          Ready for a simpler life?
        </h2>

        <p className="text-lg text-white/80 max-w-md leading-relaxed">
          Join hundreds of people who&apos;ve traded the scroll for real life.
        </p>

        <Link to="/store">
          <Button size="lg">Shop Now</Button>
        </Link>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms'

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      aria-label="Hero — Simple phone, happy life"
    >
      {/* Video background */}
      <video
        src="/videos/hero-reel.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#2C1503]/70" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
          Simple phone. <span className="text-[#FFB703]">Happy life.</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          We take a Samsung Galaxy A12 and strip it back to exactly what you need. No social media.
          No rabbit holes. Just your phone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/store">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

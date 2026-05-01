import { Link } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { Button } from '@/components/atoms/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* 404 number */}
        <p
          className="text-8xl sm:text-9xl font-extrabold leading-none mb-6"
          style={{ color: '#FFB703', WebkitTextStroke: '3px #2C1503' }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">
          Woof! This page has gone walkies.
        </h1>

        {/* Subtext */}
        <p className="text-[#5A4A3A] text-lg mb-10 leading-relaxed">
          Looks like you've sniffed down the wrong path. Don't worry — let's get you back home.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" variant="primary">
              Go Home
            </Button>
          </Link>
          <Link to="/store">
            <Button size="lg" variant="secondary">
              Browse Phones
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

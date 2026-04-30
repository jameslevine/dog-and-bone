import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/atoms/Logo'
import { Button } from '@/components/atoms/Button'
import { NavLink } from '@/components/molecules/NavLink'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { to: '/store', label: 'Buy a Phone' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: 'About' },
]

interface HeaderProps {
  cartCount?: number
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#F5EDD8] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" aria-label="Dog and Bone — Home" className="shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + cart */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/checkout" className="relative" aria-label={`Cart (${cartCount} items)`}>
              <ShoppingBag size={22} className="text-[#2C1503]" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E63946] text-white text-xs font-bold rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/store">
              <Button size="sm">Shop Now</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#2C1503] hover:text-[#FFB703] transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className={cn(
          'md:hidden border-t-2 border-[#F5EDD8] bg-white overflow-hidden transition-all duration-200',
          mobileOpen ? 'max-h-96 pb-4' : 'max-h-0',
        )}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col px-4 pt-4 gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="text-base py-2 px-2"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="mt-3 pt-3 border-t border-[#F5EDD8]">
            <Link to="/store" className="block w-full">
              <Button fullWidth onClick={() => setMobileOpen(false)}>
                Shop Now
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

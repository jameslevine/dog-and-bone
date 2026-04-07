import { Link } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'

const FOOTER_LINKS = {
  Phones: [
    { to: '/store', label: 'Buy a Phone' },
    { to: '/send-your-phone', label: 'Send Your Phone' },
    { to: '/setup-guide', label: 'Setup Guide' },
  ],
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/blog', label: 'Blog' },
    { to: '/affiliate', label: 'Affiliates' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#2C1503] text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Logo variant="white" size="sm" />
            <p className="mt-4 text-sm text-white/70 max-w-xs leading-relaxed">
              Simple phone. Happy life. Samsung Galaxy A12 phones configured to exactly what you
              need — nothing more.
            </p>
            <p className="mt-4 text-xs text-white/40">
              Cockney rhyming slang: dog and bone = phone
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-extrabold text-[#FFB703] uppercase tracking-widest mb-4">
                {group}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-white/70 hover:text-[#FFB703] transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Dog and Bone Phone Ltd. All rights reserved.</p>
          <p>Made with 🦴 in the UK</p>
        </div>
      </div>
    </footer>
  )
}

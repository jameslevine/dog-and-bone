import { Outlet } from 'react-router-dom'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

export function BlogLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#FFFDF7]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

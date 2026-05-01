import { Outlet } from 'react-router-dom'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'

export function BlogLayout() {
  return (
    <>
      <ScrollToTop />
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

import { Outlet } from 'react-router-dom'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'
import { useCartStore } from '@/store/cartStore'
import { ScrollToTop } from '@/components/ScrollToTop'

export function MainLayout() {
  const cartCount = useCartStore((s) => s.itemCount)

  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header cartCount={cartCount} />
      <main id="main-content" className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

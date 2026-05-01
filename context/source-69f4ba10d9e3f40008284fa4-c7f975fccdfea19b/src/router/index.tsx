import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { BlogLayout } from '@/layouts/BlogLayout'
import { HomePage } from '@/pages/Home'
import { StorePage } from '@/pages/Store'
import { CustomizePage } from '@/pages/Customize'
import { CheckoutPage, CheckoutSuccessPage, CheckoutCancelPage } from '@/pages/Checkout'
import { BlogListPage, BlogPostPage } from '@/pages/Blog'
import { AffiliatePage } from '@/pages/Affiliate'
import { AboutPage } from '@/pages/About'
import { FAQPage } from '@/pages/FAQ'
import { NotFoundPage } from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'store', element: <StorePage /> },
      { path: 'customize', element: <CustomizePage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/success', element: <CheckoutSuccessPage /> },
      { path: 'checkout/cancel', element: <CheckoutCancelPage /> },
      { path: 'affiliate', element: <AffiliatePage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/blog',
    element: <BlogLayout />,
    children: [
      { index: true, element: <BlogListPage /> },
      { path: ':slug', element: <BlogPostPage /> },
    ],
  },
])

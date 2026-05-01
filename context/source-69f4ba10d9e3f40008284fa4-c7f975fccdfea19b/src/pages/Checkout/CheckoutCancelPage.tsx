import { Link, useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

export function CheckoutCancelPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle size={56} className="text-[#E63946]" aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-[#2C1503]">Order Cancelled</h1>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Your payment was not processed. No charges have been made.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" fullWidth onClick={() => navigate('/checkout')}>
            Try Again
          </Button>
          <Link to="/store" className="flex-1">
            <Button size="lg" variant="secondary" fullWidth>
              Browse Phones
            </Button>
          </Link>
        </div>

        <p className="text-sm text-[#5A4A3A]">
          Need help?{' '}
          <a
            href="mailto:hello@dogandbonephone.co.uk"
            className="underline underline-offset-2 hover:text-[#2C1503] transition-colors"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}

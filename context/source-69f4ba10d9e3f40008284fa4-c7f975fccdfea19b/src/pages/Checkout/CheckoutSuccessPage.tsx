import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'
import { Button } from '@/components/atoms/Button'

export function CheckoutSuccessPage() {
  const { clear: clearCart } = useCartStore()
  const { reset: resetCustomization } = useCustomizationStore()

  useEffect(() => {
    clearCart()
    resetCustomization()
  }, [clearCart, resetCustomization])

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={56} className="text-green-600" aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-[#2C1503]">Order Confirmed! 🦴</h1>
          <p className="text-lg text-[#5A4A3A] leading-relaxed">
            Your Dog and Bone phone is being set up. We'll ship it within 3–5 working days.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-3xl border-2 border-[#F5EDD8] px-6 py-6 text-left space-y-3">
          <h2 className="font-extrabold text-[#2C1503]">What happens next?</h2>
          <ol className="space-y-2 text-sm text-[#5A4A3A]">
            <li className="flex gap-2">
              <span className="font-bold text-[#FFB703] shrink-0">1.</span>
              You'll receive a confirmation email shortly with your order details.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#FFB703] shrink-0">2.</span>
              Our team will configure your phone with the apps you selected.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#FFB703] shrink-0">3.</span>
              We'll ship it to you within 3–5 working days via tracked delivery.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <Link to="/store">
          <Button size="lg" fullWidth>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}

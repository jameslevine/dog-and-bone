import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'
import { getProfileById } from '@/data/profiles'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/atoms/Button'
import { StepIndicator } from '@/components/molecules/StepIndicator'

const STEPS = [
  { label: 'Choose Profile', completed: true },
  { label: 'Customise', completed: true },
  { label: 'Review & Pay', completed: false },
]

interface CheckoutSessionResponse {
  url: string
}

interface CheckoutBody {
  profileId: string
  apps: string[]
  addons: string[]
  successUrl: string
  cancelUrl: string
  referralId: string | null
  seniorContacts?: { name: string; phone: string }[]
  familyEmergencyContact?: { name: string; phone: string } | null
}

async function createCheckoutSession(body: CheckoutBody): Promise<CheckoutSessionResponse> {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Payment could not be started.' }))
    throw new Error(error.message ?? 'Payment could not be started.')
  }

  return response.json()
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { profileId } = useCartStore()
  const { selectedAppIds, customAppsRequest, seniorContacts, familyEmergencyContact } =
    useCustomizationStore()
  const [apiError, setApiError] = useState<string | null>(null)

  const profile = profileId ? getProfileById(profileId) : null

  const mutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (error: Error) => {
      setApiError(error.message)
    },
  })

  if (!profileId || !profile) {
    navigate('/store', { replace: true })
    return null
  }

  const handlePayNow = () => {
    setApiError(null)

    // Get Endorsely referral ID if present
    const endorselyWindow = window as Window & { endorsely_referral?: string }
    const referralId = endorselyWindow.endorsely_referral || null

    mutation.mutate({
      profileId: profile.id,
      apps: selectedAppIds,
      addons: [],
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
      referralId,
      seniorContacts:
        profileId === 'senior' ? seniorContacts.filter((c) => c.name && c.phone) : undefined,
      familyEmergencyContact:
        profileId === 'family' && familyEmergencyContact?.name && familyEmergencyContact?.phone
          ? familyEmergencyContact
          : undefined,
    })
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header band */}
      <div className="bg-[#2C1503] py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFB703] mb-2">
            Review Your Order
          </h1>
          <p className="text-[#F5EDD8]/80 text-base">Check everything looks right before paying.</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-[#F5EDD8] py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <StepIndicator steps={STEPS} currentStep={3} />
        </div>
      </div>

      {/* Order summary */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="bg-white rounded-3xl border-2 border-[#F5EDD8] overflow-hidden">
          <div className="bg-[#FFB703] px-6 py-4">
            <h2 className="text-lg font-extrabold text-[#2C1503]">Order Summary</h2>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* Profile */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-[#2C1503]">{profile.name} Profile</p>
                <p className="text-sm text-[#5A4A3A] mt-0.5">{profile.tagline}</p>
              </div>
              <p className="font-extrabold text-[#2C1503] shrink-0">{formatPrice(profile.price)}</p>
            </div>

            <hr className="border-[#F5EDD8]" />

            {/* Apps */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-[#2C1503]">Selected apps</p>
                <span className="text-sm font-bold text-[#5A4A3A]">
                  {selectedAppIds.length} app{selectedAppIds.length !== 1 ? 's' : ''}
                </span>
              </div>
              {selectedAppIds.length > 0 && (
                <p className="text-xs text-[#5A4A3A] mt-1.5 leading-relaxed">
                  {selectedAppIds.join(', ')}
                </p>
              )}
            </div>

            {/* Custom request */}
            {customAppsRequest && (
              <>
                <hr className="border-[#F5EDD8]" />
                <div>
                  <p className="font-semibold text-[#2C1503] mb-1">Custom app request</p>
                  <p className="text-sm text-[#5A4A3A] italic">"{customAppsRequest}"</p>
                </div>
              </>
            )}

            <hr className="border-[#F5EDD8]" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-[#2C1503]">Total</p>
              <p className="text-2xl font-extrabold text-[#2C1503]">{formatPrice(profile.price)}</p>
            </div>

            <p className="text-xs text-[#5A4A3A]">
              Includes phone configuration and shipping. UK only. Delivery in 3–5 working days.
            </p>
          </div>
        </div>

        {/* Error state */}
        {apiError && (
          <div className="bg-[#E63946]/10 border-2 border-[#E63946] rounded-2xl px-5 py-4">
            <p className="text-sm font-semibold text-[#E63946]">{apiError}</p>
          </div>
        )}

        {/* CTA */}
        <Button
          size="lg"
          fullWidth
          onClick={handlePayNow}
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? 'Redirecting to payment…'
            : `Pay Now — ${formatPrice(profile.price)}`}
        </Button>

        <p className="text-center text-xs text-[#5A4A3A]">
          Secure payment via Stripe. You'll be redirected to complete your order.
        </p>

        <button
          type="button"
          onClick={() => navigate('/customize')}
          className="w-full text-center text-sm text-[#5A4A3A] underline underline-offset-2 hover:text-[#2C1503] transition-colors"
        >
          ← Back to customise
        </button>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'
import { AppSelectionForm } from '@/components/organisms/AppSelectionForm'
import { StepIndicator } from '@/components/molecules/StepIndicator'
import { type ProfileId } from '@/types'

const STEPS = [
  { label: 'Choose Profile', completed: true },
  { label: 'Customise', completed: false },
  { label: 'Review & Pay', completed: false },
]

export function CustomizePage() {
  const navigate = useNavigate()
  const { profileId: cartProfileId } = useCartStore()
  const { profileId: customProfileId, setProfile } = useCustomizationStore()

  useEffect(() => {
    if (!cartProfileId) {
      navigate('/store', { replace: true })
      return
    }
    // Sync customization store with cart ONLY if not already set
    if (!customProfileId) {
      setProfile(cartProfileId as ProfileId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartProfileId, navigate]) // Only re-run if cartProfileId or navigation changes, not customProfileId

  if (!cartProfileId) {
    return null
  }

  const handleSubmit = () => {
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header band */}
      <div className="bg-[#2C1503] py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFB703] mb-2">
            Customise Your Phone
          </h1>
          <p className="text-[#F5EDD8]/80 text-base">
            Choose exactly which apps you want — and nothing else.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-[#F5EDD8] py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <StepIndicator steps={STEPS} currentStep={2} />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <AppSelectionForm profileId={customProfileId || cartProfileId} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

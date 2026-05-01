import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button, Badge } from '@/components/atoms'
import { PROFILES } from '@/data/profiles'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'
import type { ProfileId } from '@/types'

export function ProfileSelector() {
  const navigate = useNavigate()
  const cartProfileId = useCartStore((s) => s.profileId)
  const setCartProfile = useCartStore((s) => s.setProfile)
  const setCustomProfile = useCustomizationStore((s) => s.setProfile)

  function handleChoose(profileId: ProfileId) {
    setCartProfile(profileId)
    setCustomProfile(profileId)
    navigate('/customize')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {PROFILES.map((profile) => {
        const isSelected = cartProfileId === profile.id

        return (
          <article
            key={profile.id}
            className={cn(
              'relative flex flex-col rounded-3xl border-2 bg-white p-6 transition-all duration-150',
              isSelected
                ? 'border-[#FFB703] shadow-[4px_4px_0px_#FFB703]'
                : 'border-[#2C1503] shadow-[4px_4px_0px_#2C1503] hover:shadow-[6px_6px_0px_#2C1503]',
            )}
            aria-current={isSelected ? 'true' : undefined}
          >
            {/* Popular badge */}
            {profile.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge variant="popular">Most Popular</Badge>
              </div>
            )}

            {/* Profile colour accent */}
            <div
              className="w-10 h-10 rounded-xl mb-4 border-2 border-[#2C1503]"
              style={{ backgroundColor: profile.color }}
              aria-hidden="true"
            />

            <h3 className="text-xl font-extrabold text-[#2C1503] mb-1">{profile.name}</h3>
            <p className="text-sm font-semibold text-[#5A4A3A] mb-4">{profile.tagline}</p>

            <p className="text-2xl font-extrabold text-[#2C1503] mb-5">
              {formatPrice(profile.price)}
            </p>

            {/* Feature list */}
            <ul className="flex flex-col gap-2 mb-8 flex-1" aria-label={`${profile.name} features`}>
              {profile.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-[#5A4A3A]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#2D6A4F]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              fullWidth
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => handleChoose(profile.id as ProfileId)}
            >
              Choose {profile.name}
            </Button>
          </article>
        )
      })}
    </div>
  )
}

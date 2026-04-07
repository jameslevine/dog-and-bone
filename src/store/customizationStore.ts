import { create } from 'zustand'
import { type ProfileId } from '@/types'
import { PROFILES } from '@/data/profiles'

interface CustomizationState {
  profileId: ProfileId | null
  selectedAppIds: string[]
  customAppsRequest: string

  setProfile: (profileId: ProfileId) => void
  toggleApp: (appId: string) => void
  setSelectedApps: (appIds: string[]) => void
  setCustomAppsRequest: (text: string) => void
  reset: () => void

  /** Serialise selected apps to comma-separated string for Stripe metadata */
  serialiseApps: () => string
}

export const useCustomizationStore = create<CustomizationState>((set, get) => ({
  profileId: null,
  selectedAppIds: [],
  customAppsRequest: '',

  setProfile: (profileId) => {
    const profile = PROFILES.find((p) => p.id === profileId)
    set({
      profileId,
      // Pre-populate selected apps from the profile defaults
      selectedAppIds: profile ? [...profile.includedAppIds] : [],
    })
  },

  toggleApp: (appId) => {
    const { selectedAppIds } = get()
    const isSelected = selectedAppIds.includes(appId)
    set({
      selectedAppIds: isSelected
        ? selectedAppIds.filter((id) => id !== appId)
        : [...selectedAppIds, appId],
    })
  },

  setSelectedApps: (appIds) => set({ selectedAppIds: appIds }),

  setCustomAppsRequest: (text) => set({ customAppsRequest: text }),

  reset: () =>
    set({
      profileId: null,
      selectedAppIds: [],
      customAppsRequest: '',
    }),

  serialiseApps: () => get().selectedAppIds.join(','),
}))

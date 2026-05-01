import { create } from 'zustand'
import { type ProfileId } from '@/types'
import { PROFILES } from '@/data/profiles'

export interface Contact {
  name: string
  phone: string
}

interface CustomizationState {
  profileId: ProfileId | null
  selectedAppIds: string[]
  customAppsRequest: string
  seniorContacts: Contact[]
  familyEmergencyContact: Contact | null

  setProfile: (profileId: ProfileId) => void
  toggleApp: (appId: string) => void
  setSelectedApps: (appIds: string[]) => void
  setCustomAppsRequest: (text: string) => void
  setSeniorContacts: (contacts: Contact[]) => void
  setFamilyEmergencyContact: (contact: Contact | null) => void
  reset: () => void

  /** Serialise selected apps to comma-separated string for Stripe metadata */
  serialiseApps: () => string
}

export const useCustomizationStore = create<CustomizationState>((set, get) => ({
  profileId: null,
  selectedAppIds: [],
  customAppsRequest: '',
  seniorContacts: [],
  familyEmergencyContact: null,

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

  setSeniorContacts: (contacts) => set({ seniorContacts: contacts }),

  setFamilyEmergencyContact: (contact) => set({ familyEmergencyContact: contact }),

  reset: () =>
    set({
      profileId: null,
      selectedAppIds: [],
      customAppsRequest: '',
      seniorContacts: [],
      familyEmergencyContact: null,
    }),

  serialiseApps: () => get().selectedAppIds.join(','),
}))

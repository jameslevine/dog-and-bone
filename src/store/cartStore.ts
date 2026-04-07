import { create } from 'zustand'

interface CartState {
  itemCount: number
  profileId: string | null
  setProfile: (profileId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  profileId: null,
  setProfile: (profileId) => set({ profileId, itemCount: 1 }),
  clear: () => set({ itemCount: 0, profileId: null }),
}))

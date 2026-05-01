export type ProfileId = 'essential' | 'family' | 'senior' | 'balance'

export interface Profile {
  id: ProfileId
  name: string
  tagline: string
  description: string
  price: number
  stripePriceId: string
  targetMarket: string
  popular?: boolean
  includedAppIds: string[]
  features: string[]
  color: string
}

export interface Addon {
  id: string
  name: string
  description: string
  price: number
  stripePriceId: string
}

export interface CartItem {
  profileId: ProfileId
  addonIds: string[]
}

import { type ProfileId } from './product'

export interface OrderRequest {
  profileId: ProfileId
  apps: string[]
  addons: string[]
  successUrl: string
  cancelUrl: string
  referralId?: string | null
}

export interface CheckoutSessionResponse {
  url: string
}

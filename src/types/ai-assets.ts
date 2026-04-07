export interface ImageAsset {
  slug: string
  description: string
  prompt: string
  width: number
  height: number
  type: 'image'
}

export interface VideoAsset {
  slug: string
  description: string
  prompt: string
  durationSeconds: number
  type: 'video'
}

export type AiAsset = ImageAsset | VideoAsset

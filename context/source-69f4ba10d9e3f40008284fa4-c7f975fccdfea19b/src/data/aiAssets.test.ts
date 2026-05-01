import { describe, it, expect } from 'vitest'
import { AI_ASSETS, getImageAssets, getVideoAssets } from './aiAssets'

describe('AI_ASSETS', () => {
  it('contains assets', () => {
    expect(AI_ASSETS.length).toBeGreaterThan(0)
  })

  it('each asset has a slug and type', () => {
    AI_ASSETS.forEach((asset) => {
      expect(asset.slug).toBeTruthy()
      expect(['image', 'video']).toContain(asset.type)
    })
  })
})

describe('getImageAssets', () => {
  it('returns only image assets', () => {
    const images = getImageAssets()
    expect(images.length).toBeGreaterThan(0)
    images.forEach((img) => {
      expect(img.type).toBe('image')
    })
  })

  it('image assets have width and height', () => {
    const images = getImageAssets()
    images.forEach((img) => {
      expect(typeof img.width).toBe('number')
      expect(typeof img.height).toBe('number')
    })
  })
})

describe('getVideoAssets', () => {
  it('returns only video assets', () => {
    const videos = getVideoAssets()
    expect(videos.length).toBeGreaterThan(0)
    videos.forEach((vid) => {
      expect(vid.type).toBe('video')
    })
  })

  it('video assets have durationSeconds', () => {
    const videos = getVideoAssets()
    videos.forEach((vid) => {
      expect(typeof vid.durationSeconds).toBe('number')
    })
  })
})

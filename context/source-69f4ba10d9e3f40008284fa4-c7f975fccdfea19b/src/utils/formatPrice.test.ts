import { describe, it, expect } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats 14900 pence as £149.00', () => {
    expect(formatPrice(14900)).toBe('£149.00')
  })

  it('formats 1200 pence as £12.00', () => {
    expect(formatPrice(1200)).toBe('£12.00')
  })

  it('formats 99 pence as £0.99', () => {
    expect(formatPrice(99)).toBe('£0.99')
  })

  it('formats 0 pence as £0.00', () => {
    expect(formatPrice(0)).toBe('£0.00')
  })

  it('formats 100 pence as £1.00', () => {
    expect(formatPrice(100)).toBe('£1.00')
  })

  it('formats 14950 pence as £149.50', () => {
    expect(formatPrice(14950)).toBe('£149.50')
  })
})

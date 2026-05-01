import { describe, it, expect } from 'vitest'
import { TESTIMONIALS } from './testimonials'

describe('TESTIMONIALS', () => {
  it('contains at least one testimonial', () => {
    expect(TESTIMONIALS.length).toBeGreaterThan(0)
  })

  it('each testimonial has required fields', () => {
    TESTIMONIALS.forEach((t) => {
      expect(t.id).toBeTruthy()
      expect(t.quote).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.location).toBeTruthy()
      expect(t.profile).toBeTruthy()
      expect(['senior', 'family', 'balance']).toContain(t.market)
    })
  })

  it('includes a senior testimonial', () => {
    const senior = TESTIMONIALS.find((t) => t.market === 'senior')
    expect(senior).toBeDefined()
  })

  it('includes a family testimonial', () => {
    const family = TESTIMONIALS.find((t) => t.market === 'family')
    expect(family).toBeDefined()
  })

  it('includes a balance testimonial', () => {
    const balance = TESTIMONIALS.find((t) => t.market === 'balance')
    expect(balance).toBeDefined()
  })
})

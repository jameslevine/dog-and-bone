import { describe, it, expect } from 'vitest'
import { PROFILES, getProfileById } from './profiles'

describe('PROFILES', () => {
  it('contains four profiles', () => {
    expect(PROFILES).toHaveLength(4)
  })

  it('has the expected profile ids', () => {
    const ids = PROFILES.map((p) => p.id)
    expect(ids).toContain('essential')
    expect(ids).toContain('family')
    expect(ids).toContain('senior')
    expect(ids).toContain('balance')
  })

  it('each profile has a price in pence', () => {
    PROFILES.forEach((profile) => {
      expect(typeof profile.price).toBe('number')
      expect(profile.price).toBeGreaterThan(0)
    })
  })

  it('each profile has includedAppIds', () => {
    PROFILES.forEach((profile) => {
      expect(Array.isArray(profile.includedAppIds)).toBe(true)
      expect(profile.includedAppIds.length).toBeGreaterThan(0)
    })
  })

  it('marks exactly one profile as popular', () => {
    const popular = PROFILES.filter((p) => p.popular)
    expect(popular).toHaveLength(1)
    expect(popular[0]?.id).toBe('essential')
  })
})

describe('getProfileById', () => {
  it('returns a profile for a valid id', () => {
    const profile = getProfileById('essential')
    expect(profile).toBeDefined()
    expect(profile?.id).toBe('essential')
  })

  it('returns undefined for an invalid id', () => {
    const profile = getProfileById('nonexistent')
    expect(profile).toBeUndefined()
  })

  it('returns the correct profile for each valid id', () => {
    const ids = ['essential', 'family', 'senior', 'balance']
    ids.forEach((id) => {
      const profile = getProfileById(id)
      expect(profile?.id).toBe(id)
    })
  })
})

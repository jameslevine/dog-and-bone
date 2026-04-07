import { describe, it, expect } from 'vitest'
import { PROFILES, ADDONS, getProfileById } from './profiles'

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

  it('marks family profile as popular', () => {
    const family = PROFILES.find((p) => p.id === 'family')
    expect(family?.popular).toBe(true)
  })
})

describe('ADDONS', () => {
  it('contains at least one addon', () => {
    expect(ADDONS.length).toBeGreaterThan(0)
  })

  it('each addon has an id, name, and price', () => {
    ADDONS.forEach((addon) => {
      expect(addon.id).toBeTruthy()
      expect(addon.name).toBeTruthy()
      expect(typeof addon.price).toBe('number')
    })
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

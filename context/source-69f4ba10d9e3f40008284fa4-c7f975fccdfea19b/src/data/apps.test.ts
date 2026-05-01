import { describe, it, expect } from 'vitest'
import { APPS, APP_CATEGORIES, getAppById, getAppsByCategory } from './apps'

describe('APPS', () => {
  it('contains at least one app', () => {
    expect(APPS.length).toBeGreaterThan(0)
  })

  it('each app has required fields', () => {
    APPS.forEach((app) => {
      expect(app.id).toBeTruthy()
      expect(app.name).toBeTruthy()
      expect(app.category).toBeTruthy()
      expect(Array.isArray(app.defaultInProfiles)).toBe(true)
    })
  })

  it('includes a phone app', () => {
    const phone = APPS.find((a) => a.id === 'phone')
    expect(phone).toBeDefined()
    expect(phone?.available).toBe(true)
  })
})

describe('APP_CATEGORIES', () => {
  it('has a communication category', () => {
    expect(APP_CATEGORIES.communication).toBe('Communication')
  })

  it('has a navigation category', () => {
    expect(APP_CATEGORIES.navigation).toBe('Navigation')
  })
})

describe('getAppById', () => {
  it('returns an app for a valid id', () => {
    const app = getAppById('phone')
    expect(app).toBeDefined()
    expect(app?.id).toBe('phone')
  })

  it('returns undefined for an invalid id', () => {
    const app = getAppById('nonexistent')
    expect(app).toBeUndefined()
  })
})

describe('getAppsByCategory', () => {
  it('returns an object grouped by category', () => {
    const grouped = getAppsByCategory()
    expect(typeof grouped).toBe('object')
    expect(grouped).not.toBeNull()
  })

  it('groups communication apps together', () => {
    const grouped = getAppsByCategory()
    expect(grouped.communication).toBeDefined()
    expect(grouped.communication.length).toBeGreaterThan(0)
    grouped.communication.forEach((app) => {
      expect(app.category).toBe('communication')
    })
  })

  it('each category contains all apps for that category', () => {
    const grouped = getAppsByCategory()
    const communicationApps = APPS.filter((a) => a.category === 'communication')
    expect(grouped.communication).toHaveLength(communicationApps.length)
  })

  it('all apps appear in the grouped result', () => {
    const grouped = getAppsByCategory()
    const totalGrouped = Object.values(grouped).flat().length
    expect(totalGrouped).toBe(APPS.length)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useCartStore.setState({ itemCount: 0, profileId: null })
  })

  it('starts with no items and no profile', () => {
    const { itemCount, profileId } = useCartStore.getState()
    expect(itemCount).toBe(0)
    expect(profileId).toBeNull()
  })

  it('setProfile sets the profileId and sets itemCount to 1', () => {
    useCartStore.getState().setProfile('essential')
    const { profileId, itemCount } = useCartStore.getState()
    expect(profileId).toBe('essential')
    expect(itemCount).toBe(1)
  })

  it('setProfile replaces the previous profile', () => {
    useCartStore.getState().setProfile('essential')
    useCartStore.getState().setProfile('family')
    const { profileId, itemCount } = useCartStore.getState()
    expect(profileId).toBe('family')
    expect(itemCount).toBe(1)
  })

  it('clear resets itemCount and profileId', () => {
    useCartStore.getState().setProfile('senior')
    useCartStore.getState().clear()
    const { itemCount, profileId } = useCartStore.getState()
    expect(itemCount).toBe(0)
    expect(profileId).toBeNull()
  })
})

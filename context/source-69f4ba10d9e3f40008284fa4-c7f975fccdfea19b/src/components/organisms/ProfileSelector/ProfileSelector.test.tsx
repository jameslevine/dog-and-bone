import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProfileSelector } from './ProfileSelector'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'

const renderProfileSelector = () =>
  render(
    <MemoryRouter>
      <ProfileSelector />
    </MemoryRouter>,
  )

describe('ProfileSelector', () => {
  beforeEach(() => {
    useCartStore.setState({ itemCount: 0, profileId: null })
    useCustomizationStore.setState({ profileId: null, selectedAppIds: [], customAppsRequest: '' })
  })

  it('renders all four profile cards', () => {
    renderProfileSelector()
    expect(screen.getByText('Essential')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Senior')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('renders prices for each profile', () => {
    renderProfileSelector()
    // All profiles are £149.00
    const prices = screen.getAllByText('£149.00')
    expect(prices).toHaveLength(4)
  })

  it('renders "Most Popular" badge on the Family profile', () => {
    renderProfileSelector()
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('renders choose buttons for each profile', () => {
    renderProfileSelector()
    expect(screen.getByRole('button', { name: /Choose Essential/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Choose Family/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Choose Senior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Choose Balance/i })).toBeInTheDocument()
  })

  it('selecting a profile updates the cart store', () => {
    renderProfileSelector()
    fireEvent.click(screen.getByRole('button', { name: /Choose Essential/i }))
    expect(useCartStore.getState().profileId).toBe('essential')
    expect(useCartStore.getState().itemCount).toBe(1)
  })
})

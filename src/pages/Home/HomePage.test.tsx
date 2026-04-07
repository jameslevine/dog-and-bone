import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'

describe('HomePage', () => {
  beforeEach(() => {
    useCartStore.setState({ itemCount: 0, profileId: null })
    useCustomizationStore.setState({ profileId: null, selectedAppIds: [], customAppsRequest: '' })
  })

  it('renders the hero heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Simple phone.')).toBeInTheDocument()
  })

  it('renders the Choose Your Profile section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Choose Your Profile')).toBeInTheDocument()
  })

  it('renders the value propositions', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('A phone made for real life')).toBeInTheDocument()
  })

  it('renders testimonials', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Real people. Real simplicity.')).toBeInTheDocument()
  })

  it('renders CTA banner', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Ready for a simpler life?')).toBeInTheDocument()
  })
})

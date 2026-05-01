import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StorePage } from './StorePage'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'

describe('StorePage', () => {
  beforeEach(() => {
    useCartStore.setState({ itemCount: 0, profileId: null })
    useCustomizationStore.setState({ profileId: null, selectedAppIds: [], customAppsRequest: '' })
  })

  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <StorePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Choose Your Phone')).toBeInTheDocument()
  })

  it('renders all four profiles', () => {
    render(
      <MemoryRouter>
        <StorePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Essential')).toBeInTheDocument()
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Senior')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('renders device specs', () => {
    render(
      <MemoryRouter>
        <StorePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('The hardware')).toBeInTheDocument()
    expect(screen.getByText('6.5" HD+ display')).toBeInTheDocument()
  })
})

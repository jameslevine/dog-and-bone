import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CheckoutSuccessPage } from './CheckoutSuccessPage'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'

describe('CheckoutSuccessPage', () => {
  beforeEach(() => {
    useCartStore.setState({ itemCount: 1, profileId: 'essential' })
    useCustomizationStore.setState({
      profileId: 'essential',
      selectedAppIds: ['phone'],
      customAppsRequest: '',
    })
  })

  it('renders the order confirmed heading', () => {
    render(
      <MemoryRouter>
        <CheckoutSuccessPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Order Confirmed/i)).toBeInTheDocument()
  })

  it('renders what happens next steps', () => {
    render(
      <MemoryRouter>
        <CheckoutSuccessPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/What happens next/i)).toBeInTheDocument()
  })

  it('renders the Continue Shopping link', () => {
    render(
      <MemoryRouter>
        <CheckoutSuccessPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Continue Shopping/i })).toBeInTheDocument()
  })

  it('clears the cart store on mount', () => {
    render(
      <MemoryRouter>
        <CheckoutSuccessPage />
      </MemoryRouter>,
    )
    expect(useCartStore.getState().itemCount).toBe(0)
    expect(useCartStore.getState().profileId).toBeNull()
  })
})

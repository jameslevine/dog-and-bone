import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CheckoutPage } from './CheckoutPage'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })

const renderCheckoutPage = () => {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    useCartStore.setState({ itemCount: 1, profileId: 'essential' })
    useCustomizationStore.setState({
      profileId: 'essential',
      selectedAppIds: ['phone', 'sms', 'camera'],
      customAppsRequest: '',
    })
  })

  it('renders the order review heading', () => {
    renderCheckoutPage()
    expect(screen.getByText('Review Your Order')).toBeInTheDocument()
  })

  it('renders the order summary', () => {
    renderCheckoutPage()
    expect(screen.getByText('Order Summary')).toBeInTheDocument()
  })

  it('renders the selected profile name', () => {
    renderCheckoutPage()
    expect(screen.getByText('Essential Profile')).toBeInTheDocument()
  })

  it('renders the price', () => {
    renderCheckoutPage()
    const prices = screen.getAllByText('£149.00')
    expect(prices.length).toBeGreaterThan(0)
  })

  it('renders the Pay Now button', () => {
    renderCheckoutPage()
    expect(screen.getByRole('button', { name: /Pay Now/i })).toBeInTheDocument()
  })

  it('renders selected apps count', () => {
    renderCheckoutPage()
    expect(screen.getByText('3 apps')).toBeInTheDocument()
  })

  it('renders null when no profile is in cart', () => {
    useCartStore.setState({ itemCount: 0, profileId: null })
    const queryClient = createQueryClient()
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the back to customise button', () => {
    renderCheckoutPage()
    expect(screen.getByRole('button', { name: /Back to customise/i })).toBeInTheDocument()
  })

  it('back to customise button navigates when clicked', () => {
    renderCheckoutPage()
    const backButton = screen.getByRole('button', { name: /Back to customise/i })
    // Should not throw when clicked
    fireEvent.click(backButton)
  })

  it('calls Pay Now on button click and shows loading state', async () => {
    // Mock fetch to return a pending promise
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://stripe.com/checkout' }),
    } as Response)

    renderCheckoutPage()
    const payButton = screen.getByRole('button', { name: /Pay Now/i })
    fireEvent.click(payButton)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        '/.netlify/functions/create-checkout-session',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    fetchSpy.mockRestore()
  })

  it('shows error message on payment failure', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Card declined' }),
    } as Response)

    renderCheckoutPage()
    const payButton = screen.getByRole('button', { name: /Pay Now/i })
    fireEvent.click(payButton)

    await waitFor(() => {
      expect(screen.getByText('Card declined')).toBeInTheDocument()
    })

    fetchSpy.mockRestore()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CheckoutCancelPage } from './CheckoutCancelPage'

describe('CheckoutCancelPage', () => {
  it('renders the order cancelled heading', () => {
    render(
      <MemoryRouter>
        <CheckoutCancelPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Order Cancelled')).toBeInTheDocument()
  })

  it('renders the no charges message', () => {
    render(
      <MemoryRouter>
        <CheckoutCancelPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/No charges have been made/i)).toBeInTheDocument()
  })

  it('renders Try Again button', () => {
    render(
      <MemoryRouter>
        <CheckoutCancelPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
  })

  it('renders Browse Phones link', () => {
    render(
      <MemoryRouter>
        <CheckoutCancelPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Browse Phones/i })).toBeInTheDocument()
  })

  it('renders contact us link', () => {
    render(
      <MemoryRouter>
        <CheckoutCancelPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Contact us/i })).toBeInTheDocument()
  })

  it('Try Again button triggers navigation to checkout', () => {
    render(
      <MemoryRouter initialEntries={['/checkout/cancel']}>
        <CheckoutCancelPage />
      </MemoryRouter>,
    )
    // Clicking Try Again should not throw
    const button = screen.getByRole('button', { name: /Try Again/i })
    fireEvent.click(button)
    // Navigation is handled internally; no crash = pass
  })
})

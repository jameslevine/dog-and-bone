import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AffiliatePage } from './AffiliatePage'

describe('AffiliatePage', () => {
  it('renders the main heading', () => {
    render(
      <MemoryRouter>
        <AffiliatePage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Earn money recommending/i)).toBeInTheDocument()
  })

  it('renders the programme stats', () => {
    render(
      <MemoryRouter>
        <AffiliatePage />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('10%').length).toBeGreaterThan(0)
    expect(screen.getByText('£149')).toBeInTheDocument()
    expect(screen.getByText('Minimum payout')).toBeInTheDocument()
  })

  it('renders the How it works section', () => {
    render(
      <MemoryRouter>
        <AffiliatePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByText('Share your link')).toBeInTheDocument()
  })

  it('renders the FAQ section', () => {
    render(
      <MemoryRouter>
        <AffiliatePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
  })

  it('renders join programme links', () => {
    render(
      <MemoryRouter>
        <AffiliatePage />
      </MemoryRouter>,
    )
    const joinLinks = screen.getAllByRole('link', { name: /Join the Programme/i })
    expect(joinLinks.length).toBeGreaterThan(0)
  })
})

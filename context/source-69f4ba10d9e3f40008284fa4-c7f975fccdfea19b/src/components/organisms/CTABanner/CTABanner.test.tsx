import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CTABanner } from './CTABanner'

describe('CTABanner', () => {
  it('renders the heading', () => {
    render(
      <MemoryRouter>
        <CTABanner />
      </MemoryRouter>,
    )
    expect(screen.getByText('Ready for a simpler life?')).toBeInTheDocument()
  })

  it('renders the Shop Now button', () => {
    render(
      <MemoryRouter>
        <CTABanner />
      </MemoryRouter>,
    )
    // Button uses `as={Link}` but renders as a <button> element
    expect(screen.getByRole('button', { name: /Shop Now/i })).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FAQPage } from './FAQPage'

describe('FAQPage', () => {
  it('renders the page heading', () => {
    render(<FAQPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Frequently Asked Questions/i }),
    ).toBeInTheDocument()
  })

  it('renders at least one FAQ category heading', () => {
    render(<FAQPage />)
    expect(screen.getByRole('heading', { level: 2, name: /About the Phone/i })).toBeInTheDocument()
  })

  it('renders FAQ questions as h3 headings', () => {
    render(<FAQPage />)
    const h3s = screen.getAllByRole('heading', { level: 3 })
    expect(h3s.length).toBeGreaterThan(5)
  })

  it('renders the contact support CTA with a mailto link', () => {
    render(<FAQPage />)
    const link = screen.getByRole('link', { name: /Contact Support/i })
    expect(link).toHaveAttribute('href', expect.stringMatching(/^mailto:/))
  })
})

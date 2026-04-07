import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestimonialsSection } from './TestimonialsSection'

describe('TestimonialsSection', () => {
  it('renders the section heading', () => {
    render(<TestimonialsSection />)
    expect(screen.getByText('Real people. Real simplicity.')).toBeInTheDocument()
  })

  it('renders testimonial quotes', () => {
    render(<TestimonialsSection />)
    // All testimonials should be visible — check at least one name
    expect(screen.getByText('Sarah T.')).toBeInTheDocument()
  })

  it('renders all testimonial locations', () => {
    render(<TestimonialsSection />)
    expect(screen.getByText('Bristol')).toBeInTheDocument()
    expect(screen.getByText('Manchester')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders the main heading', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    )
    expect(screen.getByText('Simple phone.')).toBeInTheDocument()
    expect(screen.getByText('Happy life.')).toBeInTheDocument()
  })

  it('renders the Shop Now CTA', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    )
    // Button uses `as={Link}` but renders as a <button> element
    expect(screen.getByRole('button', { name: /Shop Now/i })).toBeInTheDocument()
  })

  it('renders the hero background video', () => {
    const { container } = render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    )
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/videos/hero-reel.mp4')
  })
})

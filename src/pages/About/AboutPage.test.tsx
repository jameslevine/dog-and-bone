import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutPage } from './AboutPage'

describe('AboutPage', () => {
  it('renders the main heading', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/We built the phone we wished existed/i)).toBeInTheDocument()
  })

  it('renders the values section', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Simplicity')).toBeInTheDocument()
    expect(screen.getByText('Privacy')).toBeInTheDocument()
    expect(screen.getByText('Real life')).toBeInTheDocument()
  })

  it('renders the Who We Help section', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Seniors')).toBeInTheDocument()
    expect(screen.getByText('Families')).toBeInTheDocument()
    expect(screen.getByText('Professionals')).toBeInTheDocument()
  })

  it('renders device specs', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Device specs')).toBeInTheDocument()
  })

  it('renders a Browse phones CTA link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Browse phones/i })).toBeInTheDocument()
  })
})

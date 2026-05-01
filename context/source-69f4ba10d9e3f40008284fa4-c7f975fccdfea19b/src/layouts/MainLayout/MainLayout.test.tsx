import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MainLayout } from './MainLayout'

describe('MainLayout', () => {
  it('renders the skip-to-main-content link', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
  })

  it('renders the header', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )
    // Header is present — logo or nav links visible
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

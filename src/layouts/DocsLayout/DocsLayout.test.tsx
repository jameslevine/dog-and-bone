import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DocsLayout } from './DocsLayout'

describe('DocsLayout', () => {
  it('renders the skip-to-main-content link', () => {
    render(
      <MemoryRouter>
        <DocsLayout />
      </MemoryRouter>,
    )
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
  })

  it('renders the header', () => {
    render(
      <MemoryRouter>
        <DocsLayout />
      </MemoryRouter>,
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(
      <MemoryRouter>
        <DocsLayout />
      </MemoryRouter>,
    )
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

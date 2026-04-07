import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BlogLayout } from './BlogLayout'

describe('BlogLayout', () => {
  it('renders the skip-to-main-content link', () => {
    render(
      <MemoryRouter>
        <BlogLayout />
      </MemoryRouter>,
    )
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
  })

  it('renders the header', () => {
    render(
      <MemoryRouter>
        <BlogLayout />
      </MemoryRouter>,
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(
      <MemoryRouter>
        <BlogLayout />
      </MemoryRouter>,
    )
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

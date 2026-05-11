import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders wordmark text', () => {
    render(<Logo />)
    expect(screen.getByText('dog & bone')).toBeInTheDocument()
  })

  it('renders in compact variant without wordmark', () => {
    render(<Logo variant="compact" />)
    expect(screen.queryByText('dog & bone')).not.toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<Logo />)
    expect(screen.getByAltText('Dog and Bone')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Logo className="test-class" />)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('renders white variant', () => {
    const { container } = render(<Logo variant="white" />)
    expect(container).toBeTruthy()
  })

  it('renders sm size', () => {
    render(<Logo size="sm" />)
    expect(screen.getByText('dog & bone')).toBeInTheDocument()
  })

  it('renders lg size', () => {
    render(<Logo size="lg" />)
    expect(screen.getByText('dog & bone')).toBeInTheDocument()
  })
})

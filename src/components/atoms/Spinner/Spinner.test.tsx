import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with loading accessible label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Spinner size="sm" />)
    expect(container.firstChild).toHaveClass('w-4')
  })

  it('applies lg size class', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.firstChild).toHaveClass('w-8')
  })

  it('applies custom className', () => {
    const { container } = render(<Spinner className="text-yellow-500" />)
    expect(container.firstChild).toHaveClass('text-yellow-500')
  })
})

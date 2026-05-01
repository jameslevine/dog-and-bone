import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Phone } from 'lucide-react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders SVG icon', () => {
    const { container } = render(<Icon icon={Phone} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('sets aria-hidden by default', () => {
    const { container } = render(<Icon icon={Phone} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('sets aria-label when provided', () => {
    const { container } = render(<Icon icon={Phone} aria-label="Phone" />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'Phone')
  })

  it('applies sm size', () => {
    const { container } = render(<Icon icon={Phone} size="sm" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '16')
  })

  it('applies xl size', () => {
    const { container } = render(<Icon icon={Phone} size="xl" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
  })
})

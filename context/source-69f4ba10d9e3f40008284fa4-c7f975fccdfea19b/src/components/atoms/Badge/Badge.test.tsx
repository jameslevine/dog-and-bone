import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Popular</Badge>)
    expect(screen.getByText('Popular')).toBeInTheDocument()
  })

  it('applies popular variant', () => {
    render(<Badge variant="popular">Popular</Badge>)
    expect(screen.getByText('Popular')).toHaveClass('bg-[#FFB703]')
  })

  it('applies sale variant', () => {
    render(<Badge variant="sale">Sale</Badge>)
    expect(screen.getByText('Sale')).toHaveClass('bg-[#E63946]')
  })

  it('applies success variant', () => {
    render(<Badge variant="success">Done</Badge>)
    expect(screen.getByText('Done')).toHaveClass('bg-[#2D6A4F]')
  })

  it('applies custom className', () => {
    render(<Badge className="extra">Tag</Badge>)
    expect(screen.getByText('Tag')).toHaveClass('extra')
  })
})

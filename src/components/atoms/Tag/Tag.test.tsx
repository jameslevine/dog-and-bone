import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>Communication</Tag>)
    expect(screen.getByText('Communication')).toBeInTheDocument()
  })

  it('applies yellow color', () => {
    render(<Tag color="yellow">Yellow</Tag>)
    expect(screen.getByText('Yellow')).toHaveClass('bg-[#FFB703]')
  })

  it('applies brown color', () => {
    render(<Tag color="brown">Brown</Tag>)
    expect(screen.getByText('Brown')).toHaveClass('bg-[#2C1503]')
  })

  it('applies custom className', () => {
    render(<Tag className="mt-2">Tag</Tag>)
    expect(screen.getByText('Tag')).toHaveClass('mt-2')
  })
})

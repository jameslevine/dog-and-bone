import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavLink } from './NavLink'

describe('NavLink', () => {
  it('renders a link with the given label', () => {
    render(
      <MemoryRouter>
        <NavLink to="/store">Buy a Phone</NavLink>
      </MemoryRouter>,
    )
    expect(screen.getByText('Buy a Phone')).toBeInTheDocument()
  })

  it('renders with active styles when the current path matches', () => {
    render(
      <MemoryRouter initialEntries={['/store']}>
        <NavLink to="/store">Buy a Phone</NavLink>
      </MemoryRouter>,
    )
    const link = screen.getByText('Buy a Phone')
    expect(link).toHaveClass('text-[#FFB703]')
  })

  it('renders with inactive styles when the current path does not match', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavLink to="/store">Buy a Phone</NavLink>
      </MemoryRouter>,
    )
    const link = screen.getByText('Buy a Phone')
    expect(link).toHaveClass('text-[#2C1503]')
  })
})

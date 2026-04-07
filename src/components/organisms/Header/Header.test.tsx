import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

const renderHeader = (cartCount = 0) =>
  render(
    <MemoryRouter>
      <Header cartCount={cartCount} />
    </MemoryRouter>,
  )

describe('Header', () => {
  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getAllByText('Buy a Phone').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0)
    expect(screen.getAllByText('About').length).toBeGreaterThan(0)
  })

  it('does not show cart badge when cartCount is 0', () => {
    renderHeader(0)
    // No badge number shown
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows cart badge count when cartCount > 0', () => {
    renderHeader(3)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('toggles the mobile menu when menu button is clicked', () => {
    renderHeader()
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()
    fireEvent.click(menuButton)
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
  })

  it('shows "Send Your Phone" nav link', () => {
    renderHeader()
    expect(screen.getAllByText('Send Your Phone').length).toBeGreaterThan(0)
  })

  it('renders the mobile Shop Now button inside the mobile nav', () => {
    renderHeader()
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(menuButton)
    // After opening mobile menu, Shop Now button appears in mobile nav
    const shopButtons = screen.getAllByRole('button', { name: /Shop Now/i })
    expect(shopButtons.length).toBeGreaterThan(0)
  })

  it('mobile nav links close the menu when clicked', () => {
    renderHeader()
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(menuButton)
    // Click a mobile nav link (there are two NavLinks per label, desktop+mobile)
    const blogLinks = screen.getAllByText('Blog')
    // Click the last one (mobile)
    fireEvent.click(blogLinks[blogLinks.length - 1])
    // Menu should close (button label changes back to "Open menu")
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })
})

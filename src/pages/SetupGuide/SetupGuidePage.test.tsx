import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SetupGuidePage } from './SetupGuidePage'

// IntersectionObserver is not available in jsdom — mock it as a class
// The callback is invoked with a fake intersecting entry so the branch inside is hit
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback

  observe = vi.fn((target: Element) => {
    // Immediately fire the callback with a fake intersecting entry
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  })

  unobserve = vi.fn()
  disconnect = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

describe('SetupGuidePage', () => {
  it('renders the page heading', () => {
    render(<SetupGuidePage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders navigation sections', () => {
    render(<SetupGuidePage />)
    expect(screen.getAllByText('Prerequisites').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Troubleshooting').length).toBeGreaterThan(0)
  })

  it('renders code blocks', () => {
    render(<SetupGuidePage />)
    // Code blocks are rendered as <pre> elements
    const codeBlocks = document.querySelectorAll('pre')
    expect(codeBlocks.length).toBeGreaterThan(0)
  })

  it('renders all sections', () => {
    render(<SetupGuidePage />)
    expect(screen.getAllByText('Connecting Your Device').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Enabling Developer Mode/i).length).toBeGreaterThan(0)
  })

  it('sidebar section anchor links are rendered', () => {
    render(<SetupGuidePage />)
    // The sidebar uses <a> tags, not buttons
    const sidebarLinks = document.querySelectorAll('a[href^="#"]')
    expect(sidebarLinks.length).toBeGreaterThan(0)
  })
})

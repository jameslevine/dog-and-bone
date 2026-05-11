import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SendYourPhonePage } from './SendYourPhonePage'

describe('SendYourPhonePage', () => {
  it('renders the main heading', () => {
    render(<SendYourPhonePage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the form', () => {
    render(<SendYourPhonePage />)
    expect(screen.getByRole('form')).toBeInTheDocument()
  })

  it('renders name input', () => {
    render(<SendYourPhonePage />)
    expect(screen.getByLabelText(/Your name/i)).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(<SendYourPhonePage />)
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
  })

  it('renders profile radio buttons', () => {
    render(<SendYourPhonePage />)
    expect(screen.getByLabelText(/Essential/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Family/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Senior/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Balance/i)).toBeInTheDocument()
  })

  it('renders the How it works section', () => {
    render(<SendYourPhonePage />)
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByText('Fill in the form')).toBeInTheDocument()
  })

  it('renders the configuration fee', () => {
    render(<SendYourPhonePage />)
    // "Configuration fee" appears twice (hero + form), use getAllByText
    const feeTexts = screen.getAllByText(/Configuration fee/i)
    expect(feeTexts.length).toBeGreaterThan(0)
  })

  it('renders Submit Request button', () => {
    render(<SendYourPhonePage />)
    // The submit button text is "Submit Request →"
    expect(screen.getByRole('button', { name: /Submit Request/i })).toBeInTheDocument()
  })

  it('shows validation errors when fields are touched with invalid values', async () => {
    render(<SendYourPhonePage />)
    const name = screen.getByLabelText(/Your name/i)
    const email = screen.getByLabelText(/Email address/i)
    fireEvent.change(email, { target: { value: 'not-an-email' } })
    fireEvent.blur(email)
    fireEvent.blur(name)
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument()
  })

  it('submits form and shows success state', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)

    render(<SendYourPhonePage />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Your name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Phone model/i), {
      target: { value: 'Samsung Galaxy A12' },
    })
    // Select a profile
    fireEvent.click(screen.getByLabelText(/Essential/i))

    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }))

    await waitFor(
      () => {
        expect(screen.getByText(/Request received/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    fetchSpy.mockRestore()
  })
})

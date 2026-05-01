import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Textarea id="notes" error="Notes is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Notes is required')
  })

  it('sets aria-invalid when error', () => {
    render(<Textarea id="notes" error="Error" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies custom rows', () => {
    render(<Textarea id="notes" rows={6} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
  })
})

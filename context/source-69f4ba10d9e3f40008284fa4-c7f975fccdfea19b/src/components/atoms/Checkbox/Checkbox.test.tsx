import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="WhatsApp" />)
    expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Checkbox label="Maps" description="Navigation and directions" />)
    expect(screen.getByText('Navigation and directions')).toBeInTheDocument()
  })

  it('can be checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Maps" onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalled()
  })

  it('shows error message', () => {
    render(<Checkbox label="Maps" error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('sets aria-invalid when error', () => {
    render(<Checkbox label="Maps" error="Required" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('can be disabled', () => {
    render(<Checkbox label="Maps" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})

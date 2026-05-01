import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RadioButton } from './RadioButton'

describe('RadioButton', () => {
  it('renders with label', () => {
    render(<RadioButton label="Essential" name="profile" value="essential" />)
    expect(screen.getByLabelText('Essential')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(
      <RadioButton
        label="Essential"
        name="profile"
        value="essential"
        description="Basic apps only"
      />,
    )
    expect(screen.getByText('Basic apps only')).toBeInTheDocument()
  })

  it('can be selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RadioButton label="Essential" name="profile" value="essential" onChange={onChange} />)
    await user.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<RadioButton label="Essential" name="profile" value="essential" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepIndicator } from './StepIndicator'

const STEPS = [
  { label: 'Choose Profile', completed: true },
  { label: 'Customise', completed: false },
  { label: 'Review & Pay', completed: false },
]

describe('StepIndicator', () => {
  it('renders all step labels', () => {
    render(<StepIndicator steps={STEPS} currentStep={2} />)
    expect(screen.getByText('Choose Profile')).toBeInTheDocument()
    expect(screen.getByText('Customise')).toBeInTheDocument()
    expect(screen.getByText('Review & Pay')).toBeInTheDocument()
  })

  it('marks the current step with aria-current="step"', () => {
    render(<StepIndicator steps={STEPS} currentStep={2} />)
    const stepCircles = screen.getAllByRole('navigation')
    expect(stepCircles[0]).toBeInTheDocument()
    // The current step (step 2 = index 1) has aria-current on its circle
    const stepDivs = document.querySelectorAll('[aria-current="step"]')
    expect(stepDivs).toHaveLength(1)
  })

  it('shows check icons for completed steps', () => {
    render(<StepIndicator steps={STEPS} currentStep={2} />)
    // The completed step (step 1) should not show a number
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('shows step numbers for non-completed steps', () => {
    render(<StepIndicator steps={STEPS} currentStep={2} />)
    // Step 2 (current, not completed) and step 3 (future) should show numbers
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('has accessible nav label', () => {
    render(<StepIndicator steps={STEPS} currentStep={1} />)
    expect(screen.getByRole('navigation', { name: 'Order progress' })).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ValuePropsSection } from './ValuePropsSection'

describe('ValuePropsSection', () => {
  it('renders the section heading', () => {
    render(<ValuePropsSection />)
    expect(screen.getByText('A phone made for real life')).toBeInTheDocument()
  })

  it('renders all three value propositions', () => {
    render(<ValuePropsSection />)
    expect(screen.getByText('For Seniors')).toBeInTheDocument()
    expect(screen.getByText('For Families')).toBeInTheDocument()
    expect(screen.getByText('For Balance')).toBeInTheDocument()
  })
})

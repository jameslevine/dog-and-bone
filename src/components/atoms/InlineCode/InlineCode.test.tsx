import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InlineCode } from './InlineCode'

describe('InlineCode', () => {
  it('renders its children inside a <code> element', () => {
    const { container } = render(<InlineCode>adb version</InlineCode>)
    expect(container.querySelector('code')).toBeInTheDocument()
    expect(screen.getByText('adb version')).toBeInTheDocument()
  })
})

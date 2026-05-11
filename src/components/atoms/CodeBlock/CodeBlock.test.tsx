import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'

describe('CodeBlock', () => {
  it('renders the provided content inside <pre><code>', () => {
    const { container } = render(<CodeBlock>adb devices</CodeBlock>)
    const pre = container.querySelector('pre')
    const code = container.querySelector('code')
    expect(pre).toBeInTheDocument()
    expect(code).toBeInTheDocument()
    expect(screen.getByText('adb devices')).toBeInTheDocument()
  })

  it('preserves multi-line content', () => {
    const snippet = 'line-one\nline-two'
    render(<CodeBlock>{snippet}</CodeBlock>)
    expect(screen.getByText(/line-one/)).toBeInTheDocument()
    expect(screen.getByText(/line-two/)).toBeInTheDocument()
  })
})

import type { ReactNode } from 'react'

interface InlineCodeProps {
  children: ReactNode
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code
      className="bg-[#F5EDD8] text-[#2C1503] px-1.5 py-0.5 rounded-md text-sm"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      {children}
    </code>
  )
}

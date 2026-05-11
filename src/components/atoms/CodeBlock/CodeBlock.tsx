interface CodeBlockProps {
  children: string
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre
      className="bg-[#1A0E02] text-[#FFB703] rounded-xl p-4 overflow-x-auto text-sm my-4"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      <code>{children}</code>
    </pre>
  )
}

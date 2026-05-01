import { cn } from '@/utils/cn'

interface TagProps {
  children: React.ReactNode
  className?: string
  color?: 'yellow' | 'brown' | 'cream' | 'green'
}

const colorStyles = {
  yellow: 'bg-[#FFB703] text-[#2C1503]',
  brown: 'bg-[#2C1503] text-white',
  cream: 'bg-[#F5EDD8] text-[#5A4A3A]',
  green: 'bg-[#2D6A4F] text-white',
}

export function Tag({ children, className, color = 'cream' }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
        colorStyles[color],
        className,
      )}
    >
      {children}
    </span>
  )
}

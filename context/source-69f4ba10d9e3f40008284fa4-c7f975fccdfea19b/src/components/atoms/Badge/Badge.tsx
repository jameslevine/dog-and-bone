import { cn } from '@/utils/cn'

export type BadgeVariant = 'popular' | 'new' | 'sale' | 'success' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  popular: 'bg-[#FFB703] text-[#2C1503] border border-[#2C1503]',
  new: 'bg-[#2D6A4F] text-white',
  sale: 'bg-[#E63946] text-white',
  success: 'bg-[#2D6A4F] text-white',
  info: 'bg-[#F5EDD8] text-[#2C1503]',
}

export function Badge({ variant = 'info', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

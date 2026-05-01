import { type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface IconProps {
  icon: LucideIcon
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const px = sizeMap[size]

  return (
    <IconComponent
      width={px}
      height={px}
      className={cn('shrink-0', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
    />
  )
}

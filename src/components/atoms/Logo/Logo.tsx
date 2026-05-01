import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'default' | 'white' | 'compact'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 44, text: 'text-2xl' },
  lg: { icon: 60, text: 'text-3xl' },
}

export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size]
  const wordmarkColor = variant === 'white' ? 'text-white' : 'text-[#2C1503]'

  // On dark backgrounds (white variant), wrap logo in white rounded box
  const logoImg = (
    <img
      src="/dog-bone-logo.png"
      alt="Dog and Bone"
      width={iconSize}
      height={iconSize}
      className={cn(variant === 'white' && 'bg-white rounded-lg p-1')}
    />
  )

  if (variant === 'compact') {
    return <span className={cn('inline-flex items-center gap-2', className)}>{logoImg}</span>
  }

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      {logoImg}
      <span
        className={cn('font-extrabold leading-none tracking-tight', textSize, wordmarkColor)}
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        dog &amp; bone
      </span>
    </span>
  )
}

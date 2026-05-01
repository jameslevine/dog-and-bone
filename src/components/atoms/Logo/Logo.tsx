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
    <span
      className={cn(
        'inline-flex items-center justify-center',
        variant === 'white' && 'bg-white rounded-xl p-2',
      )}
    >
      <img src="/dog-bone-logo.png" alt="Dog and Bone" width={iconSize} height={iconSize} />
    </span>
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

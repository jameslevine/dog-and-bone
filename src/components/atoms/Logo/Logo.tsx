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

/**
 * Dog and Bone logo — dog face formed from a bone shape.
 * Golden yellow background, dark brown outline, white bone fill,
 * heart nose, red tongue, cheek marks.
 */
export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size]
  const brown = variant === 'white' ? '#FFFFFF' : '#2C1503'
  const wordmarkColor = variant === 'white' ? 'text-white' : 'text-[#2C1503]'
  const showBg = variant !== 'white'

  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center gap-2', className)}>
        <DogBoneIcon size={iconSize} showBg />
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <DogBoneIcon size={iconSize} showBg={showBg} brown={brown} />
      <span
        className={cn('font-extrabold leading-none tracking-tight', textSize, wordmarkColor)}
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        dog &amp; bone
      </span>
    </span>
  )
}

interface DogBoneIconProps {
  size: number
  showBg?: boolean
  brown?: string
}

function DogBoneIcon({ size, showBg = true, brown = '#2C1503' }: DogBoneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background circle */}
      {showBg && <circle cx="50" cy="50" r="48" fill="#FFB703" />}

      {/* Dog head (rounded rectangle, more vertical) */}
      <rect x="30" y="35" width="40" height="45" rx="20" fill="white" />

      {/* Left ear (brown, floppy) */}
      <ellipse cx="32" cy="30" rx="10" ry="22" fill={brown} transform="rotate(-15 32 30)" />

      {/* Right ear (orange patch, floppy) */}
      <ellipse cx="68" cy="30" rx="10" ry="22" fill="#FF8C42" transform="rotate(15 68 30)" />

      {/* Snout area (lighter oval) */}
      <ellipse cx="50" cy="60" rx="16" ry="14" fill="#F5F5F5" />

      {/* Left eye */}
      <circle cx="40" cy="48" r="3.5" fill={brown} />

      {/* Right eye */}
      <circle cx="60" cy="48" r="3.5" fill={brown} />

      {/* Nose (bigger, more prominent) */}
      <ellipse cx="50" cy="63" rx="5" ry="4" fill={brown} />

      {/* Mouth line from nose */}
      <line x1="50" y1="67" x2="50" y2="72" stroke={brown} strokeWidth="2" strokeLinecap="round" />

      {/* Smile */}
      <path
        d="M44 72 Q50 76 56 72"
        stroke={brown}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tongue (peeking out) */}
      <ellipse cx="50" cy="75" rx="4" ry="3" fill="#E63946" />

      {/* Small bone at bottom */}
      <g transform="translate(50, 90)">
        <circle cx="-8" cy="0" r="3" fill={brown} />
        <circle cx="8" cy="0" r="3" fill={brown} />
        <rect x="-7" y="-1.5" width="14" height="3" rx="1.5" fill={brown} />
      </g>
    </svg>
  )
}

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

      {/* Dog face base */}
      <ellipse cx="50" cy="55" rx="28" ry="32" fill="white" />

      {/* Left ear (brown) */}
      <ellipse cx="28" cy="25" rx="12" ry="18" fill={brown} />

      {/* Right ear (orange patch) */}
      <ellipse cx="72" cy="25" rx="12" ry="18" fill="#FF8C42" />

      {/* Left eye */}
      <ellipse cx="38" cy="48" rx="4" ry="6" fill={brown} />

      {/* Right eye */}
      <ellipse cx="62" cy="48" rx="4" ry="6" fill={brown} />

      {/* Nose */}
      <ellipse cx="50" cy="62" rx="6" ry="5" fill={brown} />

      {/* Mouth */}
      <path
        d="M50 62 Q40 70 35 68 M50 62 Q60 70 65 68"
        stroke={brown}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tongue (small) */}
      <ellipse cx="50" cy="72" rx="3" ry="4" fill="#E63946" />

      {/* Bone at bottom */}
      <g transform="translate(50, 88)">
        <circle cx="-12" cy="0" r="4" fill={brown} />
        <circle cx="12" cy="0" r="4" fill={brown} />
        <rect x="-10" y="-2" width="20" height="4" rx="2" fill={brown} />
      </g>
    </svg>
  )
}

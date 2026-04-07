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
      {showBg && <circle cx="50" cy="50" r="50" fill="#FFB703" />}

      {/* Bone body — vertical rectangle with rounded knobs */}
      {/* Top-left knob */}
      <circle cx="35" cy="25" r="11" fill={brown} />
      <circle cx="35" cy="25" r="7.5" fill="white" />

      {/* Top-right knob */}
      <circle cx="65" cy="25" r="11" fill={brown} />
      <circle cx="65" cy="25" r="7.5" fill="white" />

      {/* Bottom-left knob */}
      <circle cx="35" cy="75" r="11" fill={brown} />
      <circle cx="35" cy="75" r="7.5" fill="white" />

      {/* Bottom-right knob */}
      <circle cx="65" cy="75" r="11" fill={brown} />
      <circle cx="65" cy="75" r="7.5" fill="white" />

      {/* Bone shaft */}
      <rect x="28" y="22" width="44" height="56" rx="6" fill={brown} />
      <rect x="31" y="25" width="38" height="50" rx="4" fill="white" />

      {/* Dog eyes — dark dots */}
      <circle cx="41" cy="40" r="4" fill={brown} />
      <circle cx="59" cy="40" r="4" fill={brown} />

      {/* Cheek blush marks */}
      <ellipse cx="33" cy="50" rx="5" ry="3" fill="#FFB703" opacity="0.6" />
      <ellipse cx="67" cy="50" rx="5" ry="3" fill="#FFB703" opacity="0.6" />

      {/* Heart nose */}
      <path d="M47 52 Q47 48.5 50 50 Q53 48.5 53 52 Q53 55.5 50 58 Q47 55.5 47 52 Z" fill={brown} />

      {/* Tongue */}
      <ellipse cx="50" cy="62" rx="5" ry="5" fill="#E63946" />
      <rect x="45" y="58" width="10" height="5" fill="#E63946" />
    </svg>
  )
}

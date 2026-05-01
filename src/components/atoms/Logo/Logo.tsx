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

      {/* Left ear (floppy, hanging down) */}
      <path
        d="M25 35 C20 35 18 45 20 55 C22 60 28 62 32 58 C35 54 32 40 28 35 C27 34 26 34 25 35 Z"
        fill={brown}
        stroke={brown}
        strokeWidth="3"
      />
      <path
        d="M25 38 C23 38 22 45 23 52 C24 56 27 58 29 55 C31 52 29 42 27 38 C26 37 26 37 25 38 Z"
        fill="white"
      />

      {/* Right ear (floppy, hanging down, orange) */}
      <path
        d="M75 35 C80 35 82 45 80 55 C78 60 72 62 68 58 C65 54 68 40 72 35 C73 34 74 34 75 35 Z"
        fill={brown}
        stroke={brown}
        strokeWidth="3"
      />
      <path
        d="M75 38 C77 38 78 45 77 52 C76 56 73 58 71 55 C69 52 71 42 73 38 C74 37 74 37 75 38 Z"
        fill="#FF8C42"
      />

      {/* Dog head outline */}
      <rect
        x="28"
        y="32"
        width="44"
        height="40"
        rx="18"
        fill="white"
        stroke={brown}
        strokeWidth="4"
      />

      {/* Orange patch on right side */}
      <path d="M50 32 L72 32 C72 32 78 38 78 50 C78 62 72 72 72 72 L50 72 Z" fill="#FF8C42" />

      {/* Left eye */}
      <ellipse cx="38" cy="45" rx="3" ry="5" fill={brown} />

      {/* Right eye */}
      <ellipse cx="62" cy="45" rx="3" ry="5" fill={brown} />

      {/* Big nose */}
      <ellipse cx="50" cy="58" rx="7" ry="6" fill={brown} />

      {/* Mouth line down from nose */}
      <line x1="50" y1="64" x2="50" y2="68" stroke={brown} strokeWidth="3" strokeLinecap="round" />

      {/* Smile curves */}
      <path
        d="M50 68 Q42 72 38 70"
        stroke={brown}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 68 Q58 72 62 70"
        stroke={brown}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bone at bottom */}
      <g transform="translate(50, 85)">
        <ellipse cx="-15" cy="0" rx="5" ry="6" fill={brown} />
        <ellipse cx="-15" cy="0" rx="3" ry="4" fill="white" />
        <ellipse cx="15" cy="0" rx="5" ry="6" fill={brown} />
        <ellipse cx="15" cy="0" rx="3" ry="4" fill="white" />
        <rect x="-12" y="-3" width="24" height="6" rx="3" fill={brown} />
        <rect x="-10" y="-2" width="20" height="4" rx="2" fill="white" />
      </g>
    </svg>
  )
}

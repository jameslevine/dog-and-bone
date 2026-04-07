import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Spinner } from '@/components/atoms/Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FFB703] text-[#2C1503] hover:bg-[#F0AA00] active:bg-[#E0A000] shadow-btn font-bold border-2 border-[#2C1503]',
  secondary:
    'bg-white text-[#2C1503] hover:bg-[#FFF8E7] active:bg-[#F5EDD8] border-2 border-[#2C1503] font-bold',
  ghost:
    'bg-transparent text-[#2C1503] hover:bg-[#FFF8E7] active:bg-[#F5EDD8] border-2 border-transparent font-semibold',
  danger:
    'bg-[#E63946] text-white hover:bg-[#CC2F3C] active:bg-[#B52830] font-bold border-2 border-[#E63946]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-6 py-3 text-base rounded-2xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-3 focus-visible:outline-[#FFB703] focus-visible:outline-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && <Spinner size={size === 'sm' ? 'sm' : 'md'} className="shrink-0" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

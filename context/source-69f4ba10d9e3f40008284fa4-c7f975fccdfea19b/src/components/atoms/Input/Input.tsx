import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-[#2C1503]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#1A1209] placeholder:text-[#5A4A3A]/50',
            'transition-colors duration-150 outline-none',
            'focus:border-[#FFB703] focus:ring-2 focus:ring-[#FFB703]/20',
            error
              ? 'border-[#E63946] focus:border-[#E63946] focus:ring-[#E63946]/20'
              : 'border-[#F5EDD8] hover:border-[#FFB703]/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        {error && (
          <span id={errorId} role="alert" className="text-xs text-[#E63946] font-semibold">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={helperId} className="text-xs text-[#5A4A3A]">
            {helperText}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

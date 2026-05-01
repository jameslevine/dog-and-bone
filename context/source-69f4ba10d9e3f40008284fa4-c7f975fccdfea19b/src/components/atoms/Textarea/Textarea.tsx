import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, helperText, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = error ? `${textareaId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-bold text-[#2C1503]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#1A1209] placeholder:text-[#5A4A3A]/50',
            'transition-colors duration-150 outline-none resize-vertical',
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
        {helperText && !error && <span className="text-xs text-[#5A4A3A]">{helperText}</span>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

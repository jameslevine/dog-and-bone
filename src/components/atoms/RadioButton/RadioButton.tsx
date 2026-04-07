import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const radioId = id || `${label.toLowerCase().replace(/\s+/g, '-')}-${props.value}`

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group p-4 rounded-2xl border-2 transition-all duration-150',
          'hover:border-[#FFB703] hover:bg-[#FFF8E7]',
          'has-[:checked]:border-[#FFB703] has-[:checked]:bg-[#FFF8E7]',
          className,
        )}
      >
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={cn(
            'mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 cursor-pointer appearance-none',
            'bg-white transition-colors duration-150',
            'checked:bg-[#FFB703] checked:border-[#2C1503]',
            'focus-visible:outline-2 focus-visible:outline-[#FFB703] focus-visible:outline-offset-2',
            'border-[#F5EDD8] group-hover:border-[#FFB703]',
          )}
          {...props}
        />
        <span className="flex flex-col">
          <span className="text-sm font-bold text-[#1A1209]">{label}</span>
          {description && <span className="text-xs text-[#5A4A3A] mt-0.5">{description}</span>}
        </span>
      </label>
    )
  },
)

RadioButton.displayName = 'RadioButton'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label htmlFor={checkboxId} className="flex items-start gap-3 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            aria-invalid={error ? 'true' : 'false'}
            className={cn(
              'mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 cursor-pointer',
              'appearance-none bg-white transition-colors duration-150',
              'checked:bg-[#FFB703] checked:border-[#2C1503]',
              'focus-visible:outline-2 focus-visible:outline-[#FFB703] focus-visible:outline-offset-2',
              error ? 'border-[#E63946]' : 'border-[#F5EDD8] group-hover:border-[#FFB703]',
            )}
            style={
              props.checked
                ? {
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='%232C1503' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '14px 14px',
                  }
                : {}
            }
            {...props}
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-[#1A1209]">{label}</span>
            {description && <span className="text-xs text-[#5A4A3A] mt-0.5">{description}</span>}
          </span>
        </label>
        {error && (
          <span role="alert" className="text-xs text-[#E63946] font-semibold ml-8">
            {error}
          </span>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'

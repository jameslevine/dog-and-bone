import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Step {
  label: string
  completed: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Order progress" className="flex items-center gap-0 w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = step.completed
        const isCurrent = stepNumber === currentStep
        const isFuture = !isCompleted && !isCurrent

        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                  isCompleted && 'bg-[#FFB703] border-[#2C1503]',
                  isCurrent && 'bg-[#FFB703] border-[#2C1503] ring-4 ring-[#FFB703]/30',
                  isFuture && 'bg-[#F5EDD8] border-[#D8CDB0]',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} className="text-[#2C1503]" aria-hidden="true" />
                ) : (
                  <span
                    className={cn(
                      'text-xs font-bold',
                      isCurrent ? 'text-[#2C1503]' : 'text-[#9C8870]',
                    )}
                  >
                    {stepNumber}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-semibold whitespace-nowrap',
                  isCurrent && 'text-[#2C1503]',
                  isCompleted && 'text-[#5A4A3A]',
                  isFuture && 'text-[#9C8870]',
                )}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-2 mb-5 transition-colors duration-200',
                  isCompleted ? 'bg-[#FFB703]' : 'bg-[#D8CDB0]',
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

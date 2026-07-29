import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

/**
 * Radio group styled as a segmented control, with the selection indicator
 * animating between options via a shared layout id.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  ariaLabel: string
}) {
  const layoutId = useId()

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex gap-1 rounded-xl border border-edge bg-tint p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex-1 rounded-[0.625rem] px-3 py-1.5 text-[0.8125rem] font-medium',
              'transition-colors duration-150',
              active ? 'text-ink' : 'text-ink-soft hover:text-ink',
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-[0.625rem] border border-edge bg-paper shadow-soft"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

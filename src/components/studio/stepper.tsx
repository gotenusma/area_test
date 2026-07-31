import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { STEPS, type StepId } from '@/lib/steps'

export function Stepper({
  current,
  furthest,
  onGo,
}: {
  current: StepId
  /** The highest step reached, so finished steps stay reachable. */
  furthest: StepId
  onGo: (step: StepId) => void
}) {
  return (
    <ol className="flex items-stretch gap-1.5 sm:gap-3">
      {STEPS.map((step) => {
        const done = step.id < furthest
        const active = step.id === current
        const reachable = step.id <= furthest

        return (
          <li key={step.id} className="min-w-0 flex-1">
            <button
              type="button"
              disabled={!reachable}
              aria-current={active ? 'step' : undefined}
              onClick={() => onGo(step.id as StepId)}
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
                'disabled:cursor-not-allowed',
                active
                  ? 'border-violet bg-wash'
                  : reachable
                    ? 'border-edge bg-panel hover:border-edge-strong'
                    : 'border-edge/60 bg-panel opacity-55',
              )}
            >
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full font-mono text-[0.6875rem] font-medium',
                  active
                    ? 'bg-violet text-on-violet'
                    : done
                      ? 'bg-good/15 text-good'
                      : 'bg-tint text-ink-faint',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : step.id}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    'block truncate text-[0.8125rem] font-medium',
                    active ? 'text-violet' : 'text-ink',
                  )}
                >
                  {step.label}
                </span>
                <span className="hidden truncate text-[0.75rem] text-ink-faint sm:block">
                  {step.hint}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Multi-select chip used for section toggles in the Studio. */
export function ToggleChip({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string
  active: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.8125rem]',
        'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-violet/30 bg-wash text-violet font-medium'
          : 'border-edge bg-panel text-ink-soft hover:border-edge-strong hover:text-ink',
      )}
    >
      <Check
        className={cn('size-3.5 transition-opacity', active ? 'opacity-100' : 'opacity-25')}
        strokeWidth={2.5}
        aria-hidden
      />
      {label}
    </button>
  )
}

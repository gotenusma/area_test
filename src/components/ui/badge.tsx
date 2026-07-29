import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Badge({
  children,
  className,
  tone = 'violet',
}: {
  children: ReactNode
  className?: string
  tone?: 'violet' | 'neutral' | 'good'
}) {
  const tones = {
    violet: 'border-violet/25 bg-wash text-violet',
    neutral: 'border-edge bg-tint text-ink-soft',
    good: 'border-good/30 bg-good/10 text-good',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
        'font-mono text-[0.6875rem] tracking-[0.1em] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

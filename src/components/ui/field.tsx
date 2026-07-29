import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const base =
  'w-full rounded-xl border border-edge bg-panel px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint ' +
  'transition-colors duration-150 hover:border-edge-strong focus:border-violet focus:outline-none ' +
  'focus:ring-4 focus:ring-violet/12'

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="eyebrow text-ink-soft">
      {children}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'resize-y leading-relaxed', className)} {...props} />
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        {hint ? <span className="font-mono text-[0.6875rem] text-ink-faint">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

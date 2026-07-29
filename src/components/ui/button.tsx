import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-violet text-on-violet border-violet hover:bg-violet-bright hover:border-violet-bright shadow-soft',
  outline: 'border-edge-strong text-ink hover:bg-tint hover:border-violet',
  ghost: 'border-transparent text-ink-soft hover:text-ink hover:bg-tint',
  quiet: 'border-transparent bg-wash text-violet hover:bg-violet hover:text-on-violet',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[0.8125rem] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-[0.9375rem] gap-2 rounded-xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children?: ReactNode
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center border font-medium whitespace-nowrap',
        'transition-[background-color,color,border-color,transform] duration-150',
        'active:translate-y-px disabled:pointer-events-none disabled:opacity-45',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  size?: Size
}

export function LinkButton({ className, variant = 'primary', size = 'md', ...props }: LinkButtonProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center justify-center border font-medium whitespace-nowrap',
        'transition-[background-color,color,border-color,transform] duration-150',
        'active:translate-y-px',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Class merge helper used by every primitive, matching the convention that
 * shadcn/ui and the 21st.dev registry expect so components drop in unchanged.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

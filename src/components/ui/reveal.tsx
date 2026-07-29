import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Scroll-triggered reveal. Sections use it once each, so the page has a
 * rhythm on the way down without every element animating independently.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? undefined : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

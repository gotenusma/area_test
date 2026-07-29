import { useEffect, useRef, useState } from 'react'

/**
 * Writes a brief into the prompt field on first load, character by character
 * and in uneven bursts so it reads like someone typing. The text lives in the
 * caller's state — this only drives it — so there is one source of truth.
 * Skipped under prefers-reduced-motion and cancelled as soon as the user types.
 */
export function useIntroTyping({
  text,
  onType,
  enabled,
  startDelay = 620,
  speed = 24,
}: {
  text: string
  onType: (value: string) => void
  enabled: boolean
  startDelay?: number
  speed?: number
}) {
  const [typing, setTyping] = useState(enabled)
  const cancelled = useRef(false)
  const onTypeRef = useRef(onType)
  onTypeRef.current = onType

  useEffect(() => {
    if (!enabled) {
      onTypeRef.current(text)
      setTyping(false)
      return
    }

    let index = 0
    let timer = 0

    const step = () => {
      if (cancelled.current) return
      index += Math.random() > 0.8 ? 3 : 2
      if (index >= text.length) {
        onTypeRef.current(text)
        setTyping(false)
        return
      }
      onTypeRef.current(text.slice(0, index))
      timer = window.setTimeout(step, speed + Math.random() * 32)
    }

    timer = window.setTimeout(step, startDelay)
    return () => window.clearTimeout(timer)
    // Runs once by design: the intro plays for the initial brief only, and every
    // later edit belongs to the user — re-running would fight their typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cancel = () => {
    cancelled.current = true
    setTyping(false)
  }

  return { typing, cancel }
}

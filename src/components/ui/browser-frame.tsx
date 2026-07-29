import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { DEVICE_WIDTH, type Device } from '@/lib/device'

/**
 * A browser chrome around a sandboxed iframe. The generated document is passed
 * as srcDoc, rendered at the chosen device width and scaled down to fit the
 * panel, so a phone layout is a real 390px viewport rather than a squeezed one.
 */
export function BrowserFrame({
  html,
  device = 'desktop',
  url,
  toolbar,
  className,
  viewportClassName,
  title,
}: {
  html: string
  device?: Device
  url: string
  toolbar?: ReactNode
  className?: string
  viewportClassName?: string
  title: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      setBox({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const target = DEVICE_WIDTH[device]
  const scale = box.width > 0 ? Math.min(1, box.width / target) : 1

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-frame border border-edge bg-panel shadow-lift',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-edge bg-tint px-3.5 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-edge-strong" />
          <span className="size-2.5 rounded-full bg-edge-strong" />
          <span className="size-2.5 rounded-full bg-edge-strong" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-edge bg-paper px-2.5 py-1">
          <span className="size-1.5 shrink-0 rounded-full bg-good" aria-hidden />
          <span className="truncate font-mono text-[0.6875rem] text-ink-soft">{url}</span>
        </div>
        {toolbar}
      </div>

      <div
        ref={viewportRef}
        className={cn('relative min-w-0 overflow-hidden bg-tint', viewportClassName)}
      >
        {box.height > 0 ? (
          /*
           * Positioned rather than in flow: a 1280px-wide iframe would otherwise
           * push its min-content width onto every ancestor track and stretch the
           * layout on narrow screens. Absolute keeps it out of intrinsic sizing,
           * and the measured offset centres the scaled result.
           */
          <iframe
            title={title}
            srcDoc={html}
            /* Nothing generated here needs scripts, so the preview runs fully sandboxed. */
            sandbox=""
            className="absolute top-0 border-0 bg-transparent"
            style={{
              left: Math.max(0, (box.width - target * scale) / 2),
              width: target,
              height: box.height / scale,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

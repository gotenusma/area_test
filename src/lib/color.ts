import type { Ramp } from '@/lib/spec'
import type { UipmPalette } from '@/lib/uipm-data'

function parseHex(hex: string): [number, number, number] {
  const raw = hex.replace('#', '')
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function toHex([r, g, b]: [number, number, number]): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`
}

/** Mix `amount` of `b` into `a` (0 → a, 1 → b). */
export function mix(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = parseHex(a)
  const [r2, g2, b2] = parseHex(b)
  return toHex([r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount])
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** WCAG relative luminance, used to tell a light palette from a dark one. */
export function luminance(hex: string): number {
  const channel = (value: number) => {
    const v = value / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = parseHex(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

export function isDark(hex: string): boolean {
  return luminance(hex) < 0.4
}

/** Pick whichever of black/white reads better on the given background. */
export function readableOn(background: string): string {
  return contrastRatio(background, '#ffffff') >= contrastRatio(background, '#111111')
    ? '#ffffff'
    : '#111111'
}

/**
 * Resolve a UI/UX Pro Max palette into the ramp the stylesheet needs, for the
 * requested theme. The databases hold both light and dark palettes, so a ramp
 * is flipped only when it does not already match the theme asked for — and the
 * accent is re-tinted so it keeps its contrast against the new ground.
 */
export function deriveRamp(palette: UipmPalette, dark: boolean, accentOverride?: string | null): Ramp {
  const accent = accentOverride || palette.accent
  const alreadyDark = isDark(palette.ground)

  if (alreadyDark === dark) {
    return {
      ground: palette.ground,
      raised: palette.raised,
      ink: palette.ink,
      muted: palette.muted,
      line: palette.line,
      accent,
      accentInk: accentOverride ? readableOn(accent) : palette.accentInk,
    }
  }

  if (dark) {
    const ground = mix(palette.ink, '#05050a', 0.55)
    const shifted = mix(accent, '#ffffff', 0.32)
    return {
      ground,
      raised: mix(ground, '#ffffff', 0.05),
      ink: mix(palette.ground, '#ffffff', 0.35),
      muted: mix(palette.muted, '#ffffff', 0.42),
      line: mix(ground, '#ffffff', 0.13),
      accent: shifted,
      accentInk: readableOn(shifted),
    }
  }

  const ground = mix(palette.ink, '#ffffff', 0.96)
  const shifted = mix(accent, '#000000', 0.24)
  return {
    ground,
    raised: mix(ground, '#ffffff', 0.6),
    ink: mix(palette.ground, '#05050a', 0.82),
    muted: mix(palette.muted, '#111118', 0.4),
    line: mix(ground, palette.ink, 0.12),
    accent: shifted,
    accentInk: readableOn(shifted),
  }
}

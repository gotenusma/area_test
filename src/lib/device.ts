export type Device = 'mobile' | 'tablet' | 'desktop'

/** Real viewport widths, so a phone preview is a phone, not a squeezed page. */
export const DEVICE_WIDTH: Record<Device, number> = {
  mobile: 390,
  tablet: 834,
  desktop: 1280,
}

export const DEVICE_OPTIONS: { value: Device; label: string }[] = [
  { value: 'desktop', label: 'Bureau' },
  { value: 'tablet', label: 'Tablette' },
  { value: 'mobile', label: 'Mobile' },
]

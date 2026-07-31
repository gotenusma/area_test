import type { ImportedFile } from '@/lib/spec'

/** Longest edge kept for an imported photo, before re-encoding. */
const MAX_EDGE = 1600
/** Anything past this, even after downscaling, is refused rather than embedded. */
export const MAX_EMBEDDED_BYTES = 1.6 * 1024 * 1024
export const MAX_IMAGES = 6

export const ACCEPTED = 'image/png,image/jpeg,image/webp,image/svg+xml,.txt,.md,.markdown'

export function isImage(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isText(file: File): boolean {
  return (
    file.type.startsWith('text/') ||
    /\.(txt|md|markdown)$/i.test(file.name)
  )
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function readAsDataUri(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('lecture impossible'))
    reader.readAsDataURL(file)
  })
}

export function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('lecture impossible'))
    reader.readAsText(file)
  })
}

/**
 * Shrink a photo before it becomes a data URI. A picture straight off a phone
 * is several megabytes, and base64 adds a third on top — embedding one as-is
 * would produce an export nobody can use. SVG is passed through untouched,
 * since rasterising it would be a downgrade.
 */
async function downscale(file: File): Promise<{ dataUri: string; bytes: number }> {
  if (file.type === 'image/svg+xml') {
    const dataUri = await readAsDataUri(file)
    return { dataUri, bytes: file.size }
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // The browser's own message here is English and cryptic ("The source image
    // could not be decoded"), so say what the user can actually act on.
    throw new Error(`${file.name} : image illisible. Essayez un PNG, un JPEG ou un WebP valide.`)
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas indisponible')
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // PNG keeps transparency (logos); everything else is cheaper as JPEG.
  const transparent = file.type === 'image/png'
  const dataUri = canvas.toDataURL(transparent ? 'image/png' : 'image/jpeg', 0.82)
  const bytes = Math.round((dataUri.length - dataUri.indexOf(',') - 1) * 0.75)
  return { dataUri, bytes }
}

let counter = 0

export async function importFile(file: File): Promise<ImportedFile> {
  const { dataUri, bytes } = await downscale(file)
  if (bytes > MAX_EMBEDDED_BYTES) {
    throw new Error(
      `${file.name} pèse encore ${formatBytes(bytes)} après réduction — la limite est ${formatBytes(MAX_EMBEDDED_BYTES)}.`,
    )
  }
  counter += 1
  return { id: `f${counter}-${Date.now()}`, name: file.name, dataUri, bytes }
}

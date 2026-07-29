/**
 * Accent-folding slug used for file names, anchors and preview URLs.
 * Folding happens before the character filter, so "Meulière" becomes
 * "meuliere" rather than "meuli-re".
 */
export function slugify(value: string, separator = '-'): string {
  const folded = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, separator)

  const trimmed = separator
    ? folded.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '')
    : folded

  return trimmed || 'site'
}

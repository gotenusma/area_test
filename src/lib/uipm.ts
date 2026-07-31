import {
  FONT_FALLBACK,
  UIPM_FONT_PAIRS,
  UIPM_PALETTES,
  type UipmFontPair,
  type UipmPalette,
} from '@/lib/uipm-data'

export { UIPM_FONT_PAIRS, UIPM_PALETTES }
export type { UipmFontPair, UipmPalette }

/** Words too common in a French brief to say anything about the design. */
const STOP = new Set([
  'site', 'pour', 'une', 'des', 'les', 'avec', 'dans', 'mon', 'ma', 'mes', 'the',
  'and', 'for', 'que', 'qui', 'sur', 'par', 'plus', 'tout', 'tous', 'page',
  'internet', 'web', 'faire', 'veux', 'voudrais', 'aussi', 'très', 'sont',
])

/** Loose FR→EN bridge: the databases are English, briefs are written in French. */
const BRIDGE: Record<string, string[]> = {
  restaurant: ['restaurant', 'food', 'dining'],
  bistrot: ['restaurant', 'bistro', 'cafe'],
  brasserie: ['restaurant', 'brewery', 'bar'],
  café: ['cafe', 'bakery', 'coffee'],
  cafe: ['cafe', 'bakery', 'coffee'],
  boulangerie: ['bakery', 'cafe'],
  pâtisserie: ['bakery', 'dessert'],
  cuisine: ['food', 'restaurant'],
  boutique: ['ecommerce', 'shop', 'retail'],
  commerce: ['ecommerce', 'retail'],
  vente: ['ecommerce', 'retail'],
  marque: ['brand', 'fashion'],
  mode: ['fashion', 'apparel'],
  bijou: ['jewelry', 'luxury'],
  céramique: ['ceramics', 'artisan', 'craft'],
  artisan: ['artisan', 'craft', 'handmade'],
  poterie: ['ceramics', 'craft'],
  logiciel: ['saas', 'software', 'platform'],
  application: ['app', 'saas', 'mobile'],
  appli: ['app', 'mobile'],
  plateforme: ['platform', 'saas'],
  outil: ['tool', 'productivity'],
  tableau: ['dashboard', 'analytics'],
  données: ['analytics', 'data', 'dashboard'],
  supervision: ['monitoring', 'analytics', 'devops'],
  studio: ['studio', 'agency', 'creative'],
  agence: ['agency', 'creative', 'marketing'],
  portfolio: ['portfolio', 'personal'],
  photographe: ['photography', 'portfolio'],
  architecte: ['architecture', 'interior'],
  designer: ['design', 'creative', 'portfolio'],
  avocat: ['legal', 'law', 'professional'],
  cabinet: ['professional', 'consulting'],
  médecin: ['healthcare', 'medical', 'clinic'],
  clinique: ['healthcare', 'clinic', 'medical'],
  santé: ['healthcare', 'wellness'],
  sport: ['fitness', 'sports'],
  salle: ['fitness', 'gym'],
  yoga: ['wellness', 'yoga', 'fitness'],
  beauté: ['beauty', 'spa', 'wellness'],
  spa: ['spa', 'beauty', 'wellness'],
  coiffeur: ['salon', 'beauty'],
  immobilier: ['real', 'estate', 'property'],
  banque: ['banking', 'finance', 'fintech'],
  finance: ['finance', 'fintech', 'banking'],
  assurance: ['insurance', 'finance'],
  école: ['education', 'school', 'learning'],
  formation: ['education', 'course', 'learning'],
  cours: ['course', 'education'],
  musique: ['music', 'audio', 'streaming'],
  jeu: ['game', 'gaming'],
  voyage: ['travel', 'booking', 'tourism'],
  hôtel: ['hotel', 'booking', 'hospitality'],
  association: ['nonprofit', 'charity', 'community'],
  événement: ['event', 'conference'],
  mariage: ['wedding', 'event'],
  vin: ['winery', 'wine', 'brewery'],
  ferme: ['agriculture', 'farm', 'organic'],
  bio: ['organic', 'natural', 'sustainability'],
  luxe: ['luxury', 'premium', 'elegant'],
  élégant: ['elegant', 'luxury', 'sophisticated'],
  sobre: ['minimal', 'clean', 'professional'],
  minimal: ['minimal', 'clean'],
  moderne: ['modern', 'contemporary'],
  chaleureux: ['warm', 'friendly', 'welcoming'],
  technique: ['technical', 'developer', 'engineering'],
  créatif: ['creative', 'playful', 'bold'],
  audacieux: ['bold', 'vibrant', 'striking'],
  sombre: ['dark', 'night'],
  gastronomique: ['gourmet', 'fine', 'dining', 'restaurant'],
}

function tokenise(brief: string): string[] {
  const words = brief
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 2 && !STOP.has(word))

  const out: string[] = []
  for (const word of words) {
    if (!out.includes(word)) out.push(word)
    for (const mapped of BRIDGE[word] ?? []) {
      if (!out.includes(mapped)) out.push(mapped)
    }
  }
  return out
}

/**
 * Score a row against the brief the way the skill's search does: count keyword
 * hits, weighting a hit on the label (its product type / pairing name) higher
 * than one buried in the keyword bag.
 */
function score(tokens: string[], label: string, keywords: string[]): number {
  const haystack = label.toLowerCase()
  let total = 0
  for (const token of tokens) {
    if (haystack.includes(token)) total += 3
    if (keywords.some((keyword) => keyword === token)) total += 2
    else if (keywords.some((keyword) => keyword.includes(token) || token.includes(keyword))) total += 1
  }
  return total
}

export interface UipmMatch {
  palette: UipmPalette
  fontPair: UipmFontPair
  paletteScore: number
  fontScore: number
}

/** Best palette + typography for a brief, with the runners-up available. */
export function matchBrief(brief: string): UipmMatch {
  const tokens = tokenise(brief)

  const ranked = <T extends { label: string; keywords: string[] }>(rows: T[]) =>
    rows
      .map((row) => ({ row, value: score(tokens, row.label, row.keywords) }))
      .sort((a, b) => b.value - a.value)

  const palettes = ranked(UIPM_PALETTES)
  const pairs = ranked(UIPM_FONT_PAIRS)

  return {
    palette: palettes[0].value > 0 ? palettes[0].row : defaultPalette(),
    fontPair: pairs[0].value > 0 ? pairs[0].row : defaultFontPair(),
    paletteScore: palettes[0].value,
    fontScore: pairs[0].value,
  }
}

/** Top N palettes for a brief — used to offer alternatives in the Studio. */
export function suggestPalettes(brief: string, count = 6): UipmPalette[] {
  const tokens = tokenise(brief)
  return UIPM_PALETTES.map((palette) => ({
    palette,
    value: score(tokens, palette.label, palette.keywords),
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count)
    .map((entry) => entry.palette)
}

export function suggestFontPairs(brief: string, count = 6): UipmFontPair[] {
  const tokens = tokenise(brief)
  return UIPM_FONT_PAIRS.map((pair) => ({
    pair,
    value: score(tokens, pair.label, pair.keywords),
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count)
    .map((entry) => entry.pair)
}

function defaultPalette(): UipmPalette {
  return UIPM_PALETTES.find((p) => p.label === 'SaaS (General)') ?? UIPM_PALETTES[0]
}

function defaultFontPair(): UipmFontPair {
  return UIPM_FONT_PAIRS.find((p) => p.label === 'Modern Professional') ?? UIPM_FONT_PAIRS[0]
}

export function paletteById(id: string): UipmPalette {
  return UIPM_PALETTES.find((p) => p.id === id) ?? defaultPalette()
}

export function fontPairById(id: string): UipmFontPair {
  return UIPM_FONT_PAIRS.find((p) => p.id === id) ?? defaultFontPair()
}

/** CSS font-family stack for a Google font, with a sensible generic fallback. */
export function fontStack(family: string): string {
  const generic = FONT_FALLBACK[family] ?? 'sans-serif'
  return `'${family}', ${generic}`
}

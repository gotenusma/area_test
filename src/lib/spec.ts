/**
 * The spec is the single source of truth for a generated site. The Studio
 * edits it, the engine renders it, and the export writes it out — nothing
 * else holds state about the site being produced.
 *
 * Palettes and font pairings come from the UI/UX Pro Max databases
 * (see lib/uipm.ts); everything below is the structure around them.
 */

export type TemplateId = 'studio' | 'boutique' | 'produit' | 'table'
export type FontDelivery = 'systeme' | 'google'
export type SectionId =
  | 'accueil'
  | 'preuves'
  | 'offre'
  | 'galerie'
  | 'temoignages'
  | 'tarifs'
  | 'contact'

/** A file the user brought in, held as a data URI so nothing leaves the page. */
export interface ImportedFile {
  id: string
  name: string
  dataUri: string
  bytes: number
}

export interface SiteAssets {
  logo: ImportedFile | null
  images: ImportedFile[]
  /** Plain text pulled from an imported .txt/.md, used as the intro copy. */
  notes: string
}

export interface SiteSpec {
  name: string
  tagline: string
  prompt: string
  template: TemplateId
  /** Id into UIPM_PALETTES. */
  paletteId: string
  /** Overrides the palette's accent when the user picks a colour by hand. */
  accent: string | null
  /** Id into UIPM_FONT_PAIRS. */
  fontPairId: string
  fontDelivery: FontDelivery
  sections: SectionId[]
  radius: number
  density: 'aere' | 'compact'
  dark: boolean
  assets: SiteAssets
}

/** The colour roles the generated stylesheet is written against. */
export interface Ramp {
  ground: string
  raised: string
  ink: string
  muted: string
  line: string
  accent: string
  accentInk: string
}

export interface TemplateMeta {
  id: TemplateId
  label: string
  blurb: string
  defaults: SectionId[]
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'studio',
    label: 'Studio',
    blurb: 'Agence, freelance, portfolio. La signature avant le catalogue.',
    defaults: ['accueil', 'preuves', 'offre', 'galerie', 'contact'],
  },
  {
    id: 'boutique',
    label: 'Boutique',
    blurb: 'Vitrine produit avec grille d’articles et prix lisibles.',
    defaults: ['accueil', 'galerie', 'offre', 'temoignages', 'contact'],
  },
  {
    id: 'produit',
    label: 'Produit',
    blurb: 'Logiciel ou service : promesse, bénéfices, plans.',
    defaults: ['accueil', 'preuves', 'offre', 'tarifs', 'contact'],
  },
  {
    id: 'table',
    label: 'Table',
    blurb: 'Restaurant, café, lieu. Carte, adresse, réservation.',
    defaults: ['accueil', 'offre', 'galerie', 'temoignages', 'contact'],
  },
]

export const SECTION_LABELS: Record<SectionId, string> = {
  accueil: 'Accueil',
  preuves: 'Chiffres',
  offre: 'Offre',
  galerie: 'Galerie',
  temoignages: 'Avis',
  tarifs: 'Tarifs',
  contact: 'Contact',
}

/** Section order is fixed so toggling one never reshuffles the page. */
export const SECTION_ORDER: SectionId[] = [
  'accueil',
  'preuves',
  'offre',
  'galerie',
  'temoignages',
  'tarifs',
  'contact',
]

export function sortSections(sections: SectionId[]): SectionId[] {
  return SECTION_ORDER.filter((id) => sections.includes(id))
}

export function templateOf(id: TemplateId): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}

export const EMPTY_ASSETS: SiteAssets = { logo: null, images: [], notes: '' }

/**
 * The spec is the single source of truth for a generated site. The Studio
 * edits it, the engine renders it, and the export writes it out — nothing
 * else holds state about the site being produced.
 */

export type TemplateId = 'studio' | 'boutique' | 'produit' | 'table'
export type PaletteId = 'violette' | 'encre' | 'agrume' | 'foret' | 'argile'
export type TypeSetId = 'editorial' | 'geometrique' | 'mecanique'
export type SectionId =
  | 'accueil'
  | 'preuves'
  | 'offre'
  | 'galerie'
  | 'temoignages'
  | 'tarifs'
  | 'contact'

export interface SiteSpec {
  name: string
  tagline: string
  prompt: string
  template: TemplateId
  palette: PaletteId
  typeset: TypeSetId
  sections: SectionId[]
  radius: number
  density: 'aere' | 'compact'
  dark: boolean
}

export interface TemplateMeta {
  id: TemplateId
  label: string
  blurb: string
  /** Sections switched on when this template is picked. */
  defaults: SectionId[]
}

export interface PaletteMeta {
  id: PaletteId
  label: string
  /** Swatch order: ground, ink, accent. */
  swatch: [string, string, string]
  light: PaletteRamp
  dark: PaletteRamp
}

export interface PaletteRamp {
  ground: string
  raised: string
  ink: string
  muted: string
  line: string
  accent: string
  accentInk: string
}

export interface TypeSetMeta {
  id: TypeSetId
  label: string
  display: string
  body: string
  /** Tracking applied to display type, in em. */
  tracking: string
  displayWeight: number
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

export const PALETTES: PaletteMeta[] = [
  {
    id: 'violette',
    label: 'Violette',
    swatch: ['#ffffff', '#191324', '#6c2bd9'],
    light: {
      ground: '#ffffff',
      raised: '#f7f4ff',
      ink: '#191324',
      muted: '#665d7b',
      line: '#e8e1f7',
      accent: '#6c2bd9',
      accentInk: '#ffffff',
    },
    dark: {
      ground: '#100c19',
      raised: '#1b1428',
      ink: '#f6f3fc',
      muted: '#a89ec0',
      line: '#2c2140',
      accent: '#a78bfa',
      accentInk: '#180f2c',
    },
  },
  {
    id: 'encre',
    label: 'Encre',
    swatch: ['#ffffff', '#0f1729', '#1d4ed8'],
    light: {
      ground: '#ffffff',
      raised: '#f3f6fc',
      ink: '#0f1729',
      muted: '#5b6478',
      line: '#e2e8f3',
      accent: '#1d4ed8',
      accentInk: '#ffffff',
    },
    dark: {
      ground: '#0b1120',
      raised: '#141d31',
      ink: '#f1f5fc',
      muted: '#9aa6bd',
      line: '#22304b',
      accent: '#7ea6ff',
      accentInk: '#0b1120',
    },
  },
  {
    id: 'agrume',
    label: 'Agrume',
    swatch: ['#fffdf8', '#231a12', '#d2600f'],
    light: {
      ground: '#fffdf8',
      raised: '#fdf4e8',
      ink: '#231a12',
      muted: '#6f6152',
      line: '#f0e3d1',
      accent: '#d2600f',
      accentInk: '#ffffff',
    },
    dark: {
      ground: '#17110c',
      raised: '#231a12',
      ink: '#fbf3e8',
      muted: '#bda992',
      line: '#382a1e',
      accent: '#f59e42',
      accentInk: '#17110c',
    },
  },
  {
    id: 'foret',
    label: 'Forêt',
    swatch: ['#fbfdfb', '#11201a', '#0f7a52'],
    light: {
      ground: '#fbfdfb',
      raised: '#eef6f1',
      ink: '#11201a',
      muted: '#4f6459',
      line: '#dbe9e1',
      accent: '#0f7a52',
      accentInk: '#ffffff',
    },
    dark: {
      ground: '#0b1512',
      raised: '#132320',
      ink: '#eef7f2',
      muted: '#9bb5a8',
      line: '#1f352e',
      accent: '#4ec295',
      accentInk: '#0b1512',
    },
  },
  {
    id: 'argile',
    label: 'Argile',
    swatch: ['#fdfbfb', '#241a1c', '#a8323f'],
    light: {
      ground: '#fdfbfb',
      raised: '#f7eeee',
      ink: '#241a1c',
      muted: '#6c5a5d',
      line: '#eddede',
      accent: '#a8323f',
      accentInk: '#ffffff',
    },
    dark: {
      ground: '#170f11',
      raised: '#241a1c',
      ink: '#faf0f1',
      muted: '#c0a2a6',
      line: '#382528',
      accent: '#ef7f8c',
      accentInk: '#170f11',
    },
  },
]

/*
 * Generated sites use font stacks rather than webfonts: the export must render
 * with zero network requests. Each stack walks macOS, then Windows, then the
 * common Linux faces, before landing on the generic family.
 */
export const TYPESETS: TypeSetMeta[] = [
  {
    id: 'editorial',
    label: 'Éditoriale',
    display:
      "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Liberation Serif', 'DejaVu Serif', Georgia, serif",
    body: "'Helvetica Neue', Helvetica, 'Liberation Sans', Arial, sans-serif",
    tracking: '-0.02em',
    displayWeight: 600,
  },
  {
    id: 'geometrique',
    label: 'Géométrique',
    display:
      "Futura, 'Avenir Next', 'Century Gothic', 'URW Gothic', 'Trebuchet MS', 'DejaVu Sans', sans-serif",
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Liberation Sans', sans-serif",
    tracking: '-0.015em',
    displayWeight: 600,
  },
  {
    id: 'mecanique',
    label: 'Mécanique',
    display:
      "'SF Mono', 'Roboto Mono', Menlo, Consolas, 'Liberation Mono', 'DejaVu Sans Mono', monospace",
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Liberation Sans', sans-serif",
    tracking: '-0.04em',
    displayWeight: 500,
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

export function paletteOf(id: PaletteId): PaletteMeta {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}

export function typesetOf(id: TypeSetId): TypeSetMeta {
  return TYPESETS.find((t) => t.id === id) ?? TYPESETS[0]
}

export function templateOf(id: TemplateId): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}

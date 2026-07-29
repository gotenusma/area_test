/** Example briefs, each written to land on a different template and palette. */
export const BRIEFS = [
  {
    label: 'Bistrot',
    text: 'Un site pour Le Comptoir Meulière, bistrot lyonnais de 28 couverts, carte du marché qui change le mardi, ton gastronomique et chaleureux.',
  },
  {
    label: 'Céramique',
    text: 'Une boutique pour Maison Talus, céramique tournée en petite série, matières tracées, palette terre et argile.',
  },
  {
    label: 'Logiciel',
    text: 'Une landing page pour Sillon, plateforme de supervision technique pour équipes SRE, ton sobre et technique.',
  },
  {
    label: 'Studio',
    text: 'Un portfolio pour Atelier Griffon, studio de design de six personnes, direction artistique violette et audacieuse.',
  },
] as const

export const DEFAULT_BRIEF: string = BRIEFS[0].text

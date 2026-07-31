export const STEPS = [
  { id: 1, label: 'Décrire', hint: 'votre idée' },
  { id: 2, label: 'Ajouter', hint: 'vos fichiers' },
  { id: 3, label: 'Ajuster', hint: 'et exporter' },
] as const

export type StepId = 1 | 2 | 3

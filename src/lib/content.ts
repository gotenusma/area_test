import type { SiteSpec, TemplateId } from '@/lib/spec'
import { slugify } from '@/lib/slug'
import { matchBrief } from '@/lib/uipm'
import { EMPTY_ASSETS, templateOf } from '@/lib/spec'

export interface Stat {
  value: string
  label: string
}

export interface OfferItem {
  title: string
  body: string
  price?: string
}

export interface GalleryItem {
  title: string
  meta: string
}

export interface Quote {
  quote: string
  who: string
  role: string
}

export interface Plan {
  name: string
  price: string
  period: string
  features: string[]
  featured?: boolean
}

export interface SiteContent {
  nav: string[]
  eyebrow: string
  headline: string
  intro: string
  primaryCta: string
  secondaryCta: string
  statsTitle: string
  stats: Stat[]
  offerTitle: string
  offerIntro: string
  offer: OfferItem[]
  galleryTitle: string
  galleryIntro: string
  gallery: GalleryItem[]
  quotesTitle: string
  quotes: Quote[]
  plansTitle: string
  plansIntro: string
  plans: Plan[]
  contactTitle: string
  contactIntro: string
  address: string[]
  email: string
  phone: string
  hours: string
}

const slug = (name: string) => slugify(name, '').slice(0, 18)

/* -------------------------------------------------------------------------- */
/*  Copy library — one voice per template, written out rather than templated.  */
/* -------------------------------------------------------------------------- */

function studioContent(spec: SiteSpec): SiteContent {
  return {
    nav: ['Travaux', 'Approche', 'Studio', 'Contact'],
    eyebrow: 'Studio de design — depuis 2019',
    headline: spec.tagline,
    intro:
      'Nous concevons des identités et des interfaces pour des équipes qui ont quelque chose de précis à dire. Peu de projets à la fois, menés du premier croquis à la mise en ligne.',
    primaryCta: 'Voir les travaux',
    secondaryCta: 'Prendre rendez-vous',
    statsTitle: 'Le studio en bref',
    stats: [
      { value: '48', label: 'projets livrés' },
      { value: '6', label: 'personnes' },
      { value: '11', label: 'secteurs' },
      { value: '92 %', label: 'clients qui reviennent' },
    ],
    offerTitle: 'Ce que nous faisons',
    offerIntro: 'Trois façons de travailler ensemble, selon là où vous en êtes.',
    offer: [
      {
        title: 'Identité',
        body: 'Nom, logo, système typographique, palette et un guide que votre équipe peut réellement appliquer sans nous.',
        price: 'à partir de 8 400 €',
      },
      {
        title: 'Interface',
        body: 'Maquettes, design system et intégration front. Nous livrons du code que vos développeurs reprennent sans le réécrire.',
        price: 'à partir de 12 000 €',
      },
      {
        title: 'Accompagnement',
        body: 'Un jour par semaine dans votre équipe : arbitrages, revues de design, montée en compétence des équipes produit.',
        price: '1 900 € / mois',
      },
    ],
    galleryTitle: 'Travaux récents',
    galleryIntro: 'Une sélection ; le reste se raconte mieux de vive voix.',
    gallery: [
      { title: 'Maison Verlaine', meta: 'Identité — 2025' },
      { title: 'Coteaux du Nord', meta: 'Site & packaging — 2025' },
      { title: 'Silo Analytics', meta: 'Interface produit — 2024' },
      { title: 'Fonderie Ouest', meta: 'Identité & signalétique — 2024' },
      { title: 'Radio Talus', meta: 'Direction artistique — 2024' },
      { title: 'Clinique Aubier', meta: 'Refonte complète — 2023' },
    ],
    quotesTitle: 'Ce qu’en disent nos clients',
    quotes: [
      {
        quote:
          'Ils ont posé les bonnes questions avant de dessiner quoi que ce soit. Le résultat tient debout deux ans plus tard, sans retouches.',
        who: 'Claire Aubert',
        role: 'Directrice générale, Maison Verlaine',
      },
      {
        quote:
          'Le design system nous a fait gagner un trimestre de développement. Nos développeurs ont adopté leurs composants tels quels.',
        who: 'Malik Sarr',
        role: 'CTO, Silo Analytics',
      },
    ],
    plansTitle: 'Formules d’accompagnement',
    plansIntro: 'Engagement mensuel, résiliable à tout moment.',
    plans: [
      {
        name: 'Ponctuel',
        price: '1 200 €',
        period: 'par jour',
        features: ['Ateliers de cadrage', 'Revue de design', 'Compte rendu écrit'],
      },
      {
        name: 'Régulier',
        price: '1 900 €',
        period: 'par mois',
        features: ['Un jour par semaine', 'Accès direct sur Slack', 'Revues illimitées', 'Bibliothèque de composants'],
        featured: true,
      },
      {
        name: 'Intégré',
        price: 'sur devis',
        period: 'trimestre',
        features: ['Deux designers dédiés', 'Pilotage produit', 'Formation des équipes'],
      },
    ],
    contactTitle: 'Parlons de votre projet',
    contactIntro:
      'Écrivez-nous en deux paragraphes : ce que vous faites, ce qui bloque. Nous répondons sous deux jours ouvrés.',
    address: ['14 rue des Fabriques', '69001 Lyon'],
    email: `bonjour@${slug(spec.name)}.fr`,
    phone: '+33 4 78 00 12 40',
    hours: 'Lundi – vendredi, 9 h – 18 h',
  }
}

function boutiqueContent(spec: SiteSpec): SiteContent {
  return {
    nav: ['Collection', 'Nouveautés', 'Atelier', 'Panier'],
    eyebrow: 'Fabriqué en petite série',
    headline: spec.tagline,
    intro:
      'Des pièces produites par lots de trente, dans notre atelier. Quand un lot est écoulé, il faut attendre le suivant — c’est le prix d’un objet fait correctement.',
    primaryCta: 'Voir la collection',
    secondaryCta: 'Notre atelier',
    statsTitle: 'La maison',
    stats: [
      { value: '30', label: 'pièces par lot' },
      { value: '4', label: 'artisans' },
      { value: '48 h', label: 'expédition' },
      { value: '2 ans', label: 'de garantie' },
    ],
    offerTitle: 'Pourquoi acheter ici',
    offerIntro: 'Trois engagements que nous tenons sur chaque commande.',
    offer: [
      {
        title: 'Matières tracées',
        body: 'Grès de Puisaye, chêne des Landes, laine des Pyrénées. Chaque fournisseur est nommé sur la fiche produit.',
      },
      {
        title: 'Réparable',
        body: 'Nous gardons les pièces de rechange dix ans. Envoyez-nous l’objet abîmé, nous le remettons en état.',
      },
      {
        title: 'Retour simple',
        body: 'Trente jours pour changer d’avis, retour prépayé, remboursement sous une semaine. Sans justification.',
      },
    ],
    galleryTitle: 'La collection',
    galleryIntro: 'Lot d’automne, disponible jusqu’à épuisement.',
    gallery: [
      { title: 'Carafe Bise', meta: '78 €' },
      { title: 'Bol Talus — grès émaillé', meta: '34 €' },
      { title: 'Plateau Fournil', meta: '96 €' },
      { title: 'Théière Sillon', meta: '124 €' },
      { title: 'Tasse Coteau, lot de 4', meta: '68 €' },
      { title: 'Vase Meulière, grand', meta: '142 €' },
    ],
    quotesTitle: 'Avis clients',
    quotes: [
      {
        quote:
          'La carafe a un défaut d’émail sur le bec, exactement comme annoncé sur la fiche. Ça se voit qu’elle a été faite à la main, et c’est ce que je voulais.',
        who: 'Hélène D.',
        role: 'Commande du 12 mars',
      },
      {
        quote:
          'Bol cassé au bout d’un an, j’écris sans trop y croire, ils en renvoient un sous huit jours. Rien à ajouter.',
        who: 'Thomas R.',
        role: 'Client depuis 2022',
      },
    ],
    plansTitle: 'Livraison & retours',
    plansIntro: 'Tarifs fixes, aucun frais ajouté au moment du paiement.',
    plans: [
      {
        name: 'France',
        price: '5,90 €',
        period: 'sous 48 h',
        features: ['Suivi Colissimo', 'Emballage sans plastique', 'Offert dès 90 €'],
      },
      {
        name: 'Europe',
        price: '12 €',
        period: 'sous 5 jours',
        features: ['Suivi complet', 'Droits inclus', 'Offert dès 180 €'],
        featured: true,
      },
      {
        name: 'Retrait atelier',
        price: 'gratuit',
        period: 'sur rendez-vous',
        features: ['Visite de l’atelier', 'Essai avant achat', 'Du mardi au samedi'],
      },
    ],
    contactTitle: 'Une question sur une pièce',
    contactIntro:
      'Dimensions, matières, délai du prochain lot : écrivez-nous, c’est l’atelier qui répond, pas un centre d’appels.',
    address: ['7 chemin de la Poterie', '89240 Saint-Sauveur'],
    email: `atelier@${slug(spec.name)}.fr`,
    phone: '+33 3 86 45 09 21',
    hours: 'Boutique ouverte du mardi au samedi, 10 h – 19 h',
  }
}

function produitContent(spec: SiteSpec): SiteContent {
  return {
    nav: ['Produit', 'Tarifs', 'Documentation', 'Connexion'],
    eyebrow: 'Nouvelle version 3.0',
    headline: spec.tagline,
    intro:
      'Branchez vos sources, écrivez la règle une fois, laissez tourner. Vos équipes reçoivent l’alerte au bon endroit avant que le client ne s’en aperçoive.',
    primaryCta: 'Essayer gratuitement',
    secondaryCta: 'Voir une démo',
    statsTitle: 'En production chez nos clients',
    stats: [
      { value: '2 400', label: 'équipes actives' },
      { value: '99,98 %', label: 'disponibilité' },
      { value: '180 ms', label: 'latence médiane' },
      { value: '40', label: 'connecteurs' },
    ],
    offerTitle: 'Ce que vous gagnez',
    offerIntro: 'Trois choses qui changent dès la première semaine.',
    offer: [
      {
        title: 'Détection sans réglages',
        body: 'Les seuils s’ajustent sur vos données historiques. Pas de tableau de valeurs à maintenir à la main.',
      },
      {
        title: 'Alertes utiles',
        body: 'Une alerte contient la requête, le graphe et la dernière modification liée. Assez pour agir sans ouvrir cinq onglets.',
      },
      {
        title: 'Traçabilité complète',
        body: 'Chaque décision automatique est journalisée et rejouable. Vos audits deviennent une exportation, pas un projet.',
      },
    ],
    galleryTitle: 'Dans l’interface',
    galleryIntro: 'Les écrans que vos équipes utilisent tous les jours.',
    gallery: [
      { title: 'Vue d’ensemble', meta: 'Tableau de bord' },
      { title: 'Fil des incidents', meta: 'Temps réel' },
      { title: 'Éditeur de règles', meta: 'Sans code' },
      { title: 'Rapports planifiés', meta: 'Exports' },
      { title: 'Connecteurs', meta: 'Intégrations' },
      { title: 'Journal d’audit', meta: 'Conformité' },
    ],
    quotesTitle: 'Retours d’équipes',
    quotes: [
      {
        quote:
          'Nous avons supprimé quatre cents alertes inutiles par semaine. L’astreinte est redevenue tenable pour l’équipe.',
        who: 'Nadia Bouchard',
        role: 'Responsable SRE, Orbite',
      },
      {
        quote:
          'Mise en place un mardi, premier incident détecté le jeudi, deux heures avant nos anciens tableaux de bord.',
        who: 'Pierre Lemoine',
        role: 'Directeur technique, Halte',
      },
    ],
    plansTitle: 'Tarifs',
    plansIntro: 'Facturation mensuelle, sans engagement, sans frais de mise en service.',
    plans: [
      {
        name: 'Équipe',
        price: '29 €',
        period: 'par mois',
        features: ['5 utilisateurs', '10 règles actives', 'Historique 30 jours', 'Support par courriel'],
      },
      {
        name: 'Société',
        price: '89 €',
        period: 'par mois',
        features: [
          'Utilisateurs illimités',
          'Règles illimitées',
          'Historique 2 ans',
          'Connexion SSO',
          'Support sous 4 h',
        ],
        featured: true,
      },
      {
        name: 'Hébergé chez vous',
        price: 'sur devis',
        period: 'par an',
        features: ['Installation sur votre infrastructure', 'Engagement contractuel', 'Ingénieur dédié'],
      },
    ],
    contactTitle: 'Parler à quelqu’un',
    contactIntro:
      'Une démonstration de vingt minutes sur vos propres données, menée par un ingénieur — pas par un commercial.',
    address: ['22 quai de Valmy', '75010 Paris'],
    email: `contact@${slug(spec.name)}.io`,
    phone: '+33 1 84 25 60 07',
    hours: 'Support 9 h – 19 h, astreinte 24 h/24 en formule Société',
  }
}

function tableContent(spec: SiteSpec): SiteContent {
  return {
    nav: ['La carte', 'Le lieu', 'Réserver', 'Nous trouver'],
    eyebrow: 'Cuisine du marché — Lyon 1er',
    headline: spec.tagline,
    intro:
      'La carte change tous les mardis, selon ce que les maraîchers de la Croix-Rousse ont sorti le matin. Vingt-huit couverts, une salle, pas de deuxième service précipité.',
    primaryCta: 'Réserver une table',
    secondaryCta: 'Voir la carte du jour',
    statsTitle: 'La maison',
    stats: [
      { value: '28', label: 'couverts' },
      { value: '9', label: 'producteurs' },
      { value: '2', label: 'services par jour' },
      { value: '1', label: 'menu, sans choix' },
    ],
    offerTitle: 'La carte de la semaine',
    offerIntro: 'Menu unique en quatre temps, 54 € — accord des vins, 28 €.',
    offer: [
      {
        title: 'Betterave de Charly, crème de raifort',
        body: 'Betteraves rôties au sel, raifort frais râpé, huile de noix de Grenoble, aneth du jardin.',
        price: 'entrée',
      },
      {
        title: 'Omble chevalier, beurre de cresson',
        body: 'Pêché au lac Léman, cuit sur peau, cresson de fontaine et pommes de terre de l’Île de Ré.',
        price: 'plat',
      },
      {
        title: 'Saint-Marcellin de la mère Richard',
        body: 'Affiné trois semaines, servi avec un pain de campagne au levain de la rue Burdeau.',
        price: 'fromage',
      },
      {
        title: 'Poire pochée au vin de Savoie',
        body: 'Poire williams, épices douces, glace au miel de châtaignier du Pilat.',
        price: 'dessert',
      },
    ],
    galleryTitle: 'La salle',
    galleryIntro: 'Trente mètres carrés, une verrière, la cuisine ouverte au fond.',
    gallery: [
      { title: 'La verrière', meta: 'Salle' },
      { title: 'Le comptoir', meta: '6 places' },
      { title: 'La cuisine', meta: 'Ouverte' },
      { title: 'La cave', meta: '120 références' },
      { title: 'La terrasse', meta: 'Avril – octobre' },
      { title: 'Le passe', meta: 'Service du soir' },
    ],
    quotesTitle: 'On en a parlé',
    quotes: [
      {
        quote:
          'Un menu unique, court, tenu par une cuisine qui sait exactement ce qu’elle veut. On sort en ayant mangé quelque chose, pas en ayant choisi.',
        who: 'Le Petit Guide',
        role: 'Édition 2026',
      },
      {
        quote:
          'La salle est minuscule et c’est tant mieux : le service reste attentif du premier au dernier couvert.',
        who: 'Camille Roussel',
        role: 'Chronique Table & Vigne',
      },
    ],
    plansTitle: 'Services & formules',
    plansIntro: 'Réservation conseillée dix jours à l’avance pour le vendredi et le samedi.',
    plans: [
      {
        name: 'Déjeuner',
        price: '32 €',
        period: 'entrée, plat',
        features: ['Du mardi au vendredi', '12 h – 14 h', 'Verre de vin compris'],
      },
      {
        name: 'Dîner',
        price: '54 €',
        period: 'menu en 4 temps',
        features: ['Du mardi au samedi', '19 h 30 – 22 h', 'Accord des vins 28 €', 'Menu végétal sur demande'],
        featured: true,
      },
      {
        name: 'Privatisation',
        price: '1 400 €',
        period: 'la salle',
        features: ['28 personnes', 'Menu écrit avec vous', 'Dimanche et lundi'],
      },
    ],
    contactTitle: 'Réserver',
    contactIntro:
      'Par téléphone entre 10 h et 12 h, ou par courriel à tout moment. Nous confirmons chaque table à la main.',
    address: ['3 rue du Griffon', '69001 Lyon'],
    email: `bonjour@${slug(spec.name)}.fr`,
    phone: '+33 4 72 00 84 31',
    hours: 'Mardi – samedi, 12 h – 14 h et 19 h 30 – 22 h',
  }
}

export function contentFor(spec: SiteSpec): SiteContent {
  switch (spec.template) {
    case 'boutique':
      return boutiqueContent(spec)
    case 'produit':
      return produitContent(spec)
    case 'table':
      return tableContent(spec)
    case 'studio':
      return studioContent(spec)
  }
}

/* -------------------------------------------------------------------------- */
/*  Prompt reading — the brief drives template, palette and wording.           */
/* -------------------------------------------------------------------------- */

interface Rule<T> {
  value: T
  words: string[]
}

const TEMPLATE_RULES: Rule<TemplateId>[] = [
  {
    value: 'table',
    words: [
      'restaurant', 'café', 'cafe', 'bistrot', 'bistro', 'brasserie', 'pizzeria', 'boulangerie',
      'pâtisserie', 'patisserie', 'traiteur', 'cuisine', 'chef', 'menu', 'carte', 'bar', 'cave',
      'table', 'gastronomi', 'coffee',
    ],
  },
  {
    value: 'boutique',
    words: [
      'boutique', 'commerce', 'vendre', 'vente', 'produit artisan', 'céramique', 'ceramique',
      'poterie', 'vêtement', 'vetement', 'bijou', 'marque', 'collection', 'panier', 'shop',
      'artisan', 'savon', 'librairie', 'fleuriste', 'torréfacteur',
    ],
  },
  {
    value: 'produit',
    words: [
      'saas', 'logiciel', 'application', 'appli', 'plateforme', 'outil', 'api', 'dashboard',
      'tableau de bord', 'startup', 'start-up', 'abonnement', 'b2b', 'crm', 'automatis',
      'intelligence artificielle', 'données', 'donnees', 'monitoring', 'analytique',
    ],
  },
  {
    value: 'studio',
    words: [
      'studio', 'agence', 'portfolio', 'freelance', 'photographe', 'architecte', 'designer',
      'graphiste', 'illustrat', 'consultant', 'avocat', 'cabinet', 'menuisier', 'artisanat d’art',
      'création', 'creation', 'vitrine',
    ],
  },
]

function firstMatch<T>(prompt: string, rules: Rule<T>[]): T | null {
  const hay = prompt.toLowerCase()
  let best: { value: T; at: number } | null = null
  for (const rule of rules) {
    for (const word of rule.words) {
      const at = hay.indexOf(word)
      if (at !== -1 && (best === null || at < best.at)) best = { value: rule.value, at }
    }
  }
  return best?.value ?? null
}

const FALLBACK_NAMES: Record<TemplateId, string> = {
  studio: 'Atelier Griffon',
  boutique: 'Maison Talus',
  produit: 'Sillon',
  table: 'Le Comptoir Meulière',
}

const TAGLINES: Record<TemplateId, string> = {
  studio: 'Un studio de six personnes, pour des marques qui ont quelque chose à défendre.',
  boutique: 'Des objets faits par lots de trente, dans un atelier que vous pouvez visiter.',
  produit: 'Repérez la panne avant vos clients, sans multiplier les alertes inutiles.',
  table: 'Vingt-huit couverts, une carte qui change le mardi, des producteurs qu’on nomme.',
}

/** Pull a plausible business name out of the brief, or fall back gracefully. */
function readName(prompt: string, template: TemplateId): string {
  const quoted = prompt.match(/[«"“']([^»"”']{2,32})[»"”']/)
  if (quoted) return quoted[1].trim()

  /* "… pour Le Comptoir Meulière, bistrot …" — take up to three capitalised words. */
  const named = prompt.match(
    /\b(?:pour|appel[ée]e?s?|nommée?s?)\s+((?:[A-ZÀ-Ý][\p{L}'’-]+)(?:\s+[A-ZÀ-Ý][\p{L}'’-]+){0,2})/u,
  )
  if (named) return named[1].trim()

  const capitals = prompt.match(/\b[A-ZÀ-Ý][\p{L}'’-]{2,}\b/gu)
  if (capitals) {
    const skip = new Set(['Je', 'Un', 'Une', 'Le', 'La', 'Les', 'Site', 'Fabrique', 'Mon', 'Ma'])
    const pick = capitals.find((w) => !skip.has(w))
    if (pick) return pick
  }
  return FALLBACK_NAMES[template]
}

/**
 * Turn a free-text brief into a full spec. Deterministic and local: the same
 * brief always yields the same site, which is what makes the preview trustable.
 */
export function specFromPrompt(prompt: string, base?: Partial<SiteSpec>): SiteSpec {
  const template = base?.template ?? firstMatch(prompt, TEMPLATE_RULES) ?? 'studio'
  /* Palette and typography are chosen by scoring the brief against the
     UI/UX Pro Max databases — 192 palettes and 74 pairings. */
  const match = matchBrief(prompt)
  const name = base?.name ?? readName(prompt, template)

  return {
    name,
    tagline: base?.tagline ?? TAGLINES[template],
    prompt,
    template,
    paletteId: base?.paletteId ?? match.palette.id,
    accent: base?.accent ?? null,
    fontPairId: base?.fontPairId ?? match.fontPair.id,
    fontDelivery: base?.fontDelivery ?? 'systeme',
    sections: base?.sections ?? templateOf(template).defaults,
    radius: base?.radius ?? (template === 'produit' ? 12 : template === 'table' ? 2 : 6),
    density: base?.density ?? 'aere',
    dark: base?.dark ?? false,
    assets: base?.assets ?? EMPTY_ASSETS,
  }
}

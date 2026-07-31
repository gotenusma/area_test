# Fabrique — la fabrique de sites

Front-end d’un générateur de sites : on écrit un brief en une phrase, Fabrique en
déduit un modèle, une palette et une typographie, compose les sections, puis rend
un fichier HTML autonome. **Aucun backend** — la génération tourne entièrement
dans le navigateur et le même brief produit toujours le même site.

## Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # tsc -b puis build de production
npm run preview  # servir le build
npm run lint
```

## Le parcours

| Route      | Contenu                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| `#/`       | Page d’accueil : aperçu en direct, galerie des modèles, système, tarifs.     |
| `#/studio` | Studio en trois étapes, l’aperçu restant visible du début à la fin.          |

1. **Décrire l’idée** — un brief en texte libre. Le modèle vient de règles maison ;
   la palette et l’association de polices sont choisies en interrogeant les bases
   UI/UX Pro Max. Un encadré montre ce qui a été compris.
2. **Ajouter des fichiers** — facultatif. Logo, photos, texte de présentation :
   le premier visuel sert de logo, les suivants remplissent la galerie, le texte
   devient l’introduction. Les images sont réduites à 1600 px puis réencodées.
3. **Ajuster et exporter** — police, couleur principale, palette, sections,
   arrondi, densité, thème. Puis `Télécharger` ou `Copier`.

Sur téléphone, une bascule `Étape / Aperçu` remplace les deux colonnes.

## Architecture

```
src/
├── app.tsx                   composition des deux vues
├── index.css                 tokens de couleur, thèmes clair/sombre, utilitaires
├── lib/
│   ├── spec.ts               SiteSpec : modèles, sections, fichiers importés
│   ├── uipm-data.ts          généré — 192 palettes, 74 associations de polices
│   ├── uipm.ts               correspondance brief → palette + typographie
│   ├── color.ts              mélange, luminance, contraste, dérivation clair/sombre
│   ├── files.ts              import, réduction et encodage des fichiers
│   ├── content.ts            lecture du brief + bibliothèque de textes par modèle
│   ├── generator.ts          composition du document HTML final
│   └── use-*.ts              thème, route par hash, frappe d’introduction
└── components/
    ├── ui/                   primitives réutilisables
    ├── site/                 sections de la page d’accueil
    └── studio/               assistant en trois étapes, aperçu, vue du code
```

Le flux tient en une ligne :
`brief → specFromPrompt() → SiteSpec → renderSite() → HTML`.
`SiteSpec` est la seule source de vérité ; le Studio l’édite, le moteur le rend,
l’export l’écrit.

### Le site généré

- un seul fichier, `<style>` intégré, images comprises ;
- polices en piles système par défaut, donc zéro requête externe ; les vraies
  Google Fonts restent possibles en un réglage, au prix d’un appel réseau ;
- les visuels manquants sont des aplats CSS calculés depuis la palette ;
- rendu dans un `<iframe sandbox="">` : l’aperçu n’exécute aucun script.

## Design

Fond blanc, violet comme unique accent, neutres légèrement teintés vers l’accent.
Bricolage Grotesque pour les titres, Geist pour le texte, Geist Mono pour les
étiquettes et les chiffres. Les deux thèmes sont définis au niveau des tokens :
`prefers-color-scheme` porte la préférence système, `data-theme` sur `<html>`
porte le choix explicite du visiteur et l’emporte dans les deux sens.

## Composants

Les primitives de `src/components/ui/` suivent les conventions du registre
[21st.dev](https://21st.dev) — mêmes bases que shadcn/ui : utilitaire `cn()`
(`clsx` + `tailwind-merge`), Tailwind v4, animations avec `motion`, icônes
`lucide-react`. Elles sont écrites à la main dans cet idiome plutôt qu’installées
depuis le registre, l’accès réseau à 21st.dev étant bloqué dans l’environnement de
développement utilisé ; un composant tiré du registre s’y intègre sans adaptation.

## Skills installés

Le générateur s’appuie sur les bases de ce paquet : `scripts/build-uipm-data.py`
les extrait des CSV vers `src/lib/uipm-data.ts`, puisque le navigateur ne peut
exécuter ni Python ni le script de recherche du skill. Relancez-le après une mise
à jour du paquet.

`.claude/skills/` contient le paquet [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
v2.11.0 (MIT), installé avec `npx ui-ux-pro-max-cli init --ai claude`. Sept skills
en font partie : `ui-ux-pro-max`, `ui-styling`, `design`, `design-system`,
`brand`, `banner-design` et `slides`. Ils s’activent d’eux-mêmes sur les tâches
de design ; les bases de données sont locales et interrogeables :

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<requête>" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<requête>" --design-system -p "Nom"
```

Les chemins des commandes documentées ont été réécrits en `.claude/skills/…`
(l’installateur les écrit relatifs à `.claude/`, ce qui échoue depuis la racine du
projet). Une réinstallation ou une mise à jour du paquet écrase cette correction.

Framer Motion est déjà présent : le paquet `motion` est le même projet
(`motiondivision/motion`) sous son nom actuel, en version 12.43.0 — les
animations l’importent via `motion/react`.

### Brancher 21st.dev (à faire en local)

Le MCP 21st.dev demande une clé API personnelle, à générer sur
`21st.dev/magic/console` → onglet API → *Create API key* (elle commence par
`an_sk_` et ne s’affiche qu’une fois). Elle reste sur votre machine : `--scope
user` l’écrit dans votre configuration personnelle. **Ne la committez jamais**
dans ce dépôt, ni dans un `.mcp.json` de projet.

```bash
# Recommandé aujourd'hui par 21st.dev
npx @21st-dev/cli@latest init

# Ancienne commande — fonctionne encore, via un paquet de compatibilité
claude mcp add magic --scope user --env API_KEY="VOTRE_CLE_API" -- npx -y @21st-dev/magic@latest
```

`@21st-dev/magic` est désormais un proxy de compatibilité conservé pour les
anciennes configurations ; le paquet lui-même renvoie vers `@21st-dev/cli`.

Ce branchement ne peut pas se faire depuis une session Claude Code distante : la
politique réseau y refuse `21st.dev` (403 sur le tunnel), donc le serveur MCP
démarrerait sans pouvoir joindre son API.

## Notes

Les textes générés sont écrits pour tenir la maquette et donner le bon rythme, pas
pour décrire une vraie entreprise : la structure est prête, les mots restent à
relire. Les tarifs, adresses et témoignages affichés relèvent de la démonstration.

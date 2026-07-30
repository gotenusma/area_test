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

## Les deux vues

| Route      | Contenu                                                                               |
| ---------- | ------------------------------------------------------------------------------------- |
| `#/`       | Page d’accueil : aperçu en direct dans le héros, galerie des modèles, système, tarifs. |
| `#/studio` | Studio : brief, modèle, palette, typographie, sections, arrondi, densité, thème.       |

Le brief saisi sur l’accueil suit l’utilisateur dans le Studio. Dans le Studio,
`Aperçu` affiche le rendu à la largeur de l’appareil choisi, `Code` montre le HTML
produit, et `Télécharger` enregistre le fichier.

## Architecture

```
src/
├── app.tsx                   composition des deux vues
├── index.css                 tokens de couleur, thèmes clair/sombre, utilitaires
├── lib/
│   ├── spec.ts               SiteSpec : modèles, palettes, typographies, sections
│   ├── content.ts            lecture du brief + bibliothèque de textes par modèle
│   ├── generator.ts          composition du document HTML final
│   ├── slug.ts               slugs sans accents (fichiers, ancres, URL d’aperçu)
│   └── use-*.ts              thème, route par hash, frappe d’introduction
└── components/
    ├── ui/                   primitives réutilisables
    ├── site/                 sections de la page d’accueil
    └── studio/               réglages, aperçu, vue du code
```

Le flux tient en une ligne : `brief → specFromPrompt() → SiteSpec → renderSite() → HTML`.
`SiteSpec` est la seule source de vérité ; le Studio l’édite, le moteur le rend,
l’export l’écrit.

### Le site généré

- un seul fichier, `<style>` intégré, zéro requête externe ;
- polices en piles système (macOS, Windows, Linux) plutôt qu’en webfonts, pour que
  le fichier téléchargé s’ouvre sans réseau ;
- visuels en aplats CSS calculés depuis la palette choisie, à remplacer par de
  vraies photos à l’intégration ;
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

## Notes

Les textes générés sont écrits pour tenir la maquette et donner le bon rythme, pas
pour décrire une vraie entreprise : la structure est prête, les mots restent à
relire. Les tarifs, adresses et témoignages affichés relèvent de la démonstration.

import { contentFor, type GalleryItem, type SiteContent } from '@/lib/content'
import {
  paletteOf,
  sortSections,
  typesetOf,
  type PaletteRamp,
  type SiteSpec,
  type TypeSetMeta,
} from '@/lib/spec'

/* -------------------------------------------------------------------------- */
/*  Small colour helpers — the generated site ships literal colours so it       */
/*  renders identically in an old browser, an iframe, or a downloaded file.     */
/* -------------------------------------------------------------------------- */

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function toHex([r, g, b]: [number, number, number]): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`
}

/** Mix `amount` of `b` into `a` (0 → a, 1 → b). */
export function mix(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = parseHex(a)
  const [r2, g2, b2] = parseHex(b)
  return toHex([r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount])
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function anchor(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/* -------------------------------------------------------------------------- */
/*  Artwork — four deterministic abstract fills stand in for photography,       */
/*  built from the site's own accent so a preview never looks like a stub.      */
/* -------------------------------------------------------------------------- */

function tileArt(index: number, ramp: PaletteRamp): string {
  const soft = mix(ramp.raised, ramp.accent, 0.12)
  const mid = mix(ramp.raised, ramp.accent, 0.32)
  const strong = mix(ramp.raised, ramp.accent, 0.62)

  switch (index % 4) {
    case 0:
      return `background-color:${soft};background-image:linear-gradient(118deg, ${strong} 0 18%, ${mid} 18% 34%, ${soft} 34% 100%);`
    case 1:
      return `background-color:${soft};background-image:radial-gradient(circle at 50% 58%, ${strong} 0 16%, transparent 16.5%), radial-gradient(circle at 50% 58%, ${mid} 0 30%, transparent 30.5%), radial-gradient(circle at 50% 58%, ${soft} 0 46%, transparent 46.5%);`
    case 2:
      return `background-color:${soft};background-image:radial-gradient(${mid} 1.4px, transparent 1.5px);background-size:14px 14px;`
    default:
      return `background-color:${soft};background-image:conic-gradient(from 210deg at 22% 78%, ${strong} 0 25%, ${mid} 25% 50%, ${soft} 50% 100%);`
  }
}

/* -------------------------------------------------------------------------- */
/*  Stylesheet                                                                 */
/* -------------------------------------------------------------------------- */

function stylesheet(spec: SiteSpec, ramp: PaletteRamp, type: TypeSetMeta): string {
  const gap = spec.density === 'compact' ? 72 : 116
  const scale = spec.density === 'compact' ? 0.92 : 1
  const heroSize = (spec.template === 'produit' ? 4 : 4.6) * scale
  const accentSoft = mix(ramp.ground, ramp.accent, 0.07)
  const accentLine = mix(ramp.line, ramp.accent, 0.35)

  return `
:root{
  --ground:${ramp.ground};
  --raised:${ramp.raised};
  --ink:${ramp.ink};
  --muted:${ramp.muted};
  --line:${ramp.line};
  --accent:${ramp.accent};
  --accent-ink:${ramp.accentInk};
  --accent-soft:${accentSoft};
  --accent-line:${accentLine};
  --radius:${spec.radius}px;
  --gap:${gap}px;
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  margin:0;background:var(--ground);color:var(--ink);
  font-family:${type.body};font-size:17px;line-height:1.65;
  -webkit-font-smoothing:antialiased;
}
h1,h2,h3{font-family:${type.display};font-weight:${type.displayWeight};letter-spacing:${type.tracking};line-height:1.06;margin:0;text-wrap:balance}
h1{font-size:clamp(2.4rem, 6.4vw, ${heroSize}rem)}
h2{font-size:clamp(1.7rem, 3.4vw, 2.45rem)}
h3{font-size:1.12rem;line-height:1.3}
p{margin:0;text-wrap:pretty}
a{color:inherit;text-decoration:none}
img{max-width:100%}
ul{margin:0;padding:0;list-style:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.wrap{width:min(1140px, 100% - 48px);margin-inline:auto}
.eyebrow{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.lede{font-size:1.12rem;color:var(--muted);max-width:62ch}
.rule{height:1px;background:var(--line);border:0;margin:0}

/* header */
.top{position:sticky;top:0;z-index:10;background:${withAlpha(ramp.ground, 0.86)};backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:70px}
.brand{display:flex;align-items:center;gap:10px;font-family:${type.display};font-weight:${type.displayWeight};font-size:1.06rem;letter-spacing:${type.tracking}}
.brand .mark{width:26px;height:26px;border-radius:calc(var(--radius) * .7);background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-size:.78rem;font-weight:700;font-family:${type.body}}
.nav{display:flex;gap:26px;font-size:.92rem;color:var(--muted)}
@media (max-width:520px){.top .btn{padding:9px 13px;font-size:.84rem}.brand{font-size:.98rem}}
.nav a:hover{color:var(--ink)}
@media (max-width:820px){.nav{display:none}}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:var(--radius);font-size:.92rem;font-weight:550;white-space:nowrap;border:1px solid transparent;cursor:pointer;transition:transform .15s ease, background-color .15s ease}
.btn-primary{background:var(--accent);color:var(--accent-ink)}
.btn-primary:hover{transform:translateY(-1px)}
.btn-ghost{border-color:var(--line);color:var(--ink)}
.btn-ghost:hover{background:var(--raised)}

/* sections */
section{padding-block:var(--gap);scroll-margin-top:82px}
section + section{border-top:1px solid var(--line)}
.head{display:flex;flex-direction:column;gap:14px;margin-bottom:44px;max-width:72ch}

/* hero */
.hero{padding-block:calc(var(--gap) * 1.15) var(--gap);position:relative;overflow:hidden}
.hero-grid{display:grid;gap:56px;align-items:end}
.hero h1{margin-block:18px 22px}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.hero-art{aspect-ratio:4/3;border-radius:calc(var(--radius) * 2);border:1px solid var(--line)}
[data-template="studio"] .hero-grid{grid-template-columns:minmax(0,1.25fr) minmax(0,.85fr)}
[data-template="boutique"] .hero-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
[data-template="produit"] .hero{text-align:center;background:linear-gradient(to bottom, var(--accent-soft), var(--ground))}
[data-template="produit"] .hero-grid{grid-template-columns:1fr;justify-items:center;text-align:center}
[data-template="produit"] .lede{margin-inline:auto}
[data-template="produit"] .actions{justify-content:center}
[data-template="produit"] .hero-art{width:100%;aspect-ratio:16/9;margin-top:52px}
[data-template="table"] .hero-grid{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
[data-template="table"] h1{font-size:clamp(2.5rem,6vw,4.1rem)}
@media (max-width:900px){.hero-grid{grid-template-columns:1fr !important}}

/* stats */
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.stat{background:var(--ground);padding:26px 22px}
.stat b{display:block;font-family:${type.display};font-weight:${type.displayWeight};font-size:2.1rem;letter-spacing:${type.tracking};font-variant-numeric:tabular-nums}
.stat span{font-size:.86rem;color:var(--muted)}
@media (max-width:760px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* cards */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(268px,1fr));gap:24px}
.card{padding:28px;border:1px solid var(--line);border-radius:calc(var(--radius) * 1.4);background:var(--raised);display:flex;flex-direction:column;gap:12px}
.card h3{font-family:${type.display}}
.card p{color:var(--muted);font-size:.97rem}
.card .price{margin-top:auto;font-size:.84rem;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);font-weight:600}

/* menu list (table) */
.menu{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.menu li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 28px;padding:24px 0;border-bottom:1px solid var(--line);align-items:baseline}
.menu h3{grid-column:1;font-family:${type.display}}
.menu .course{grid-column:2;grid-row:1;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600}
.menu p{grid-column:1/-1;color:var(--muted);font-size:.97rem;max-width:64ch}

/* gallery */
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
@media (max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.grid{grid-template-columns:1fr}}
.item{display:flex;flex-direction:column;gap:12px}
.item .art{aspect-ratio:4/3;border-radius:calc(var(--radius) * 1.4);border:1px solid var(--line)}
.item .cap{display:flex;justify-content:space-between;gap:14px;align-items:baseline}
.item .cap strong{font-weight:550;font-size:.98rem}
.item .cap span{font-size:.86rem;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-template="studio"] .grid .item:first-child{grid-column:span 2}
[data-template="studio"] .grid .item:first-child .art{aspect-ratio:16/9}
[data-template="boutique"] .item .art{aspect-ratio:1}

/* quotes */
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px}
.quote{padding:32px;border-radius:calc(var(--radius) * 1.4);background:var(--accent-soft);border:1px solid var(--accent-line);display:flex;flex-direction:column;gap:18px}
.quote p{font-size:1.06rem;font-family:${type.display};font-weight:${type.displayWeight};letter-spacing:${type.tracking};line-height:1.4}
.quote footer{font-size:.88rem;color:var(--muted)}
.quote footer b{display:block;color:var(--ink);font-weight:600}

/* plans */
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(258px,1fr));gap:24px;align-items:start}
.plan{border:1px solid var(--line);border-radius:calc(var(--radius) * 1.4);padding:30px;display:flex;flex-direction:column;gap:20px;background:var(--ground)}
.plan[data-featured]{border-color:var(--accent);box-shadow:0 24px 60px -32px ${withAlpha(ramp.accent, 0.45)}}
.plan .name{font-size:.78rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);font-weight:600}
.plan .amount{font-family:${type.display};font-weight:${type.displayWeight};font-size:2.3rem;letter-spacing:${type.tracking};font-variant-numeric:tabular-nums}
.plan .amount small{display:block;font-family:${type.body};font-size:.86rem;font-weight:400;color:var(--muted);letter-spacing:0;margin-top:6px}
.plan ul{display:flex;flex-direction:column;gap:10px;font-size:.95rem;color:var(--muted)}
.plan li{display:flex;gap:10px;align-items:flex-start}
.plan li::before{content:"";flex:none;width:6px;height:6px;margin-top:8px;border-radius:50%;background:var(--accent)}

/* contact */
.contact{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:56px;align-items:start}
@media (max-width:900px){.contact{grid-template-columns:1fr}}
.details{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.detail{background:var(--ground);padding:18px 22px;display:flex;justify-content:space-between;gap:20px;font-size:.95rem}
.detail span{color:var(--muted)}
.detail b{font-weight:550;text-align:right}
.form{display:flex;flex-direction:column;gap:14px}
.form label{display:flex;flex-direction:column;gap:7px;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}
.form input,.form textarea{padding:13px 15px;border:1px solid var(--line);border-radius:var(--radius);background:var(--raised);color:var(--ink);font-size:1rem;font-family:inherit;letter-spacing:0;text-transform:none}
.form textarea{min-height:120px;resize:vertical}

/* footer */
.foot{border-top:1px solid var(--line);padding-block:44px;color:var(--muted);font-size:.88rem}
.foot .wrap{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none !important}}
`.trim()
}

/* -------------------------------------------------------------------------- */
/*  Section renderers                                                          */
/* -------------------------------------------------------------------------- */

function galleryTile(item: GalleryItem, index: number, ramp: PaletteRamp): string {
  return `        <li class="item">
          <div class="art" style="${tileArt(index, ramp)}"></div>
          <div class="cap"><strong>${esc(item.title)}</strong><span>${esc(item.meta)}</span></div>
        </li>`
}

function heroArt(spec: SiteSpec, ramp: PaletteRamp): string {
  const a = mix(ramp.ground, ramp.accent, 0.14)
  const b = mix(ramp.ground, ramp.accent, 0.55)
  const c = mix(ramp.ground, ramp.accent, 0.85)

  if (spec.template === 'produit') {
    return `<div class="hero-art" style="background:${a};background-image:linear-gradient(to bottom, ${withAlpha(
      ramp.ground,
      0.9,
    )}, transparent), repeating-linear-gradient(90deg, ${withAlpha(ramp.accent, 0.16)} 0 1px, transparent 1px 46px), repeating-linear-gradient(0deg, ${withAlpha(
      ramp.accent,
      0.16,
    )} 0 1px, transparent 1px 46px)"></div>`
  }
  if (spec.template === 'table') {
    return `<div class="hero-art" style="background:${a};background-image:radial-gradient(circle at 70% 30%, ${c} 0 12%, transparent 12.5%), radial-gradient(circle at 30% 68%, ${b} 0 26%, transparent 26.5%)"></div>`
  }
  if (spec.template === 'boutique') {
    return `<div class="hero-art" style="background:${a};background-image:conic-gradient(from 140deg at 62% 40%, ${c} 0 22%, ${b} 22% 44%, ${a} 44% 100%)"></div>`
  }
  return `<div class="hero-art" style="background:${a};background-image:linear-gradient(122deg, ${c} 0 26%, ${b} 26% 48%, ${a} 48% 100%)"></div>`
}

function renderHero(spec: SiteSpec, c: SiteContent, ramp: PaletteRamp): string {
  return `    <section class="hero" id="accueil">
      <div class="wrap hero-grid">
        <div>
          <p class="eyebrow">${esc(c.eyebrow)}</p>
          <h1>${esc(c.headline)}</h1>
          <p class="lede">${esc(c.intro)}</p>
          <div class="actions">
            <a class="btn btn-primary" href="#${anchor(c.contactTitle)}">${esc(c.primaryCta)}</a>
            <a class="btn btn-ghost" href="#${anchor(c.offerTitle)}">${esc(c.secondaryCta)}</a>
          </div>
        </div>
        ${heroArt(spec, ramp)}
      </div>
    </section>`
}

function renderStats(c: SiteContent): string {
  const cells = c.stats
    .map((s) => `          <div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`)
    .join('\n')
  return `    <section id="${anchor(c.statsTitle)}">
      <div class="wrap">
        <div class="head"><p class="eyebrow">${esc(c.statsTitle)}</p></div>
        <div class="stats">
${cells}
        </div>
      </div>
    </section>`
}

function renderOffer(spec: SiteSpec, c: SiteContent): string {
  const body =
    spec.template === 'table'
      ? `        <ul class="menu">
${c.offer
  .map(
    (item) => `          <li>
            <h3>${esc(item.title)}</h3>
            ${item.price ? `<span class="course">${esc(item.price)}</span>` : ''}
            <p>${esc(item.body)}</p>
          </li>`,
  )
  .join('\n')}
        </ul>`
      : `        <div class="cards">
${c.offer
  .map(
    (item) => `          <article class="card">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.body)}</p>
            ${item.price ? `<p class="price">${esc(item.price)}</p>` : ''}
          </article>`,
  )
  .join('\n')}
        </div>`

  return `    <section id="${anchor(c.offerTitle)}">
      <div class="wrap">
        <div class="head">
          <h2>${esc(c.offerTitle)}</h2>
          <p class="lede">${esc(c.offerIntro)}</p>
        </div>
${body}
      </div>
    </section>`
}

function renderGallery(c: SiteContent, ramp: PaletteRamp): string {
  return `    <section id="${anchor(c.galleryTitle)}">
      <div class="wrap">
        <div class="head">
          <h2>${esc(c.galleryTitle)}</h2>
          <p class="lede">${esc(c.galleryIntro)}</p>
        </div>
        <ul class="grid">
${c.gallery.map((item, i) => galleryTile(item, i, ramp)).join('\n')}
        </ul>
      </div>
    </section>`
}

function renderQuotes(c: SiteContent): string {
  return `    <section id="${anchor(c.quotesTitle)}">
      <div class="wrap">
        <div class="head"><h2>${esc(c.quotesTitle)}</h2></div>
        <div class="quotes">
${c.quotes
  .map(
    (q) => `          <blockquote class="quote">
            <p>“${esc(q.quote)}”</p>
            <footer><b>${esc(q.who)}</b>${esc(q.role)}</footer>
          </blockquote>`,
  )
  .join('\n')}
        </div>
      </div>
    </section>`
}

function renderPlans(c: SiteContent): string {
  return `    <section id="${anchor(c.plansTitle)}">
      <div class="wrap">
        <div class="head">
          <h2>${esc(c.plansTitle)}</h2>
          <p class="lede">${esc(c.plansIntro)}</p>
        </div>
        <div class="plans">
${c.plans
  .map(
    (p) => `          <article class="plan"${p.featured ? ' data-featured' : ''}>
            <p class="name">${esc(p.name)}</p>
            <p class="amount">${esc(p.price)}<small>${esc(p.period)}</small></p>
            <ul>
${p.features.map((f) => `              <li>${esc(f)}</li>`).join('\n')}
            </ul>
            <a class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'}" href="#${anchor(c.contactTitle)}">Choisir</a>
          </article>`,
  )
  .join('\n')}
        </div>
      </div>
    </section>`
}

function renderContact(c: SiteContent): string {
  return `    <section id="${anchor(c.contactTitle)}">
      <div class="wrap contact">
        <div class="head" style="margin-bottom:0">
          <h2>${esc(c.contactTitle)}</h2>
          <p class="lede">${esc(c.contactIntro)}</p>
          <div class="details" style="margin-top:22px">
            <div class="detail"><span>Adresse</span><b>${c.address.map(esc).join('<br />')}</b></div>
            <div class="detail"><span>Courriel</span><b><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></b></div>
            <div class="detail"><span>Téléphone</span><b>${esc(c.phone)}</b></div>
            <div class="detail"><span>Horaires</span><b>${esc(c.hours)}</b></div>
          </div>
        </div>
        <form class="form" method="post" action="#">
          <label>Nom<input type="text" name="nom" autocomplete="name" required /></label>
          <label>Courriel<input type="email" name="courriel" autocomplete="email" required /></label>
          <label>Message<textarea name="message" required></textarea></label>
          <button class="btn btn-primary" type="submit">Envoyer</button>
        </form>
      </div>
    </section>`
}

/* -------------------------------------------------------------------------- */
/*  Document                                                                   */
/* -------------------------------------------------------------------------- */

export function renderSite(spec: SiteSpec): string {
  const palette = paletteOf(spec.palette)
  const ramp = spec.dark ? palette.dark : palette.light
  const type = typesetOf(spec.typeset)
  const c = contentFor(spec)
  const sections = sortSections(spec.sections)

  const navTargets: Record<string, string> = {
    accueil: 'accueil',
    preuves: anchor(c.statsTitle),
    offre: anchor(c.offerTitle),
    galerie: anchor(c.galleryTitle),
    temoignages: anchor(c.quotesTitle),
    tarifs: anchor(c.plansTitle),
    contact: anchor(c.contactTitle),
  }

  const navLinks = sections
    .filter((id) => id !== 'accueil')
    .map((id) => {
      const labels: Record<string, string> = {
        preuves: c.statsTitle,
        offre: c.offerTitle,
        galerie: c.galleryTitle,
        temoignages: c.quotesTitle,
        tarifs: c.plansTitle,
        contact: c.contactTitle,
      }
      return `          <a href="#${navTargets[id]}">${esc(labels[id])}</a>`
    })
    .join('\n')

  const body = sections
    .map((id) => {
      switch (id) {
        case 'accueil':
          return renderHero(spec, c, ramp)
        case 'preuves':
          return renderStats(c)
        case 'offre':
          return renderOffer(spec, c)
        case 'galerie':
          return renderGallery(c, ramp)
        case 'temoignages':
          return renderQuotes(c)
        case 'tarifs':
          return renderPlans(c)
        case 'contact':
          return renderContact(c)
      }
    })
    .join('\n')

  const initial = spec.name.trim().charAt(0).toUpperCase() || 'F'
  const year = new Date().getFullYear()

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(spec.name)} — ${esc(spec.tagline)}</title>
<meta name="description" content="${esc(spec.tagline)}" />
<meta name="theme-color" content="${ramp.ground}" />
<style>
${stylesheet(spec, ramp, type)}
</style>
</head>
<body data-template="${spec.template}">
  <header class="top">
    <div class="wrap">
      <a class="brand" href="#accueil"><span class="mark">${esc(initial)}</span>${esc(spec.name)}</a>
      <nav class="nav">
${navLinks}
      </nav>
      <a class="btn btn-primary" href="#${navTargets.contact ?? 'accueil'}">${esc(c.primaryCta)}</a>
    </div>
  </header>
  <main>
${body}
  </main>
  <footer class="foot">
    <div class="wrap">
      <p>© ${year} ${esc(spec.name)}. Tous droits réservés.</p>
      <p>${esc(c.address.join(', '))} · ${esc(c.email)}</p>
    </div>
  </footer>
</body>
</html>
`
}

/** Rough page-weight estimate shown in the Studio, in kilobytes. */
export function weightOf(html: string): string {
  const kb = new TextEncoder().encode(html).length / 1024
  return `${kb.toFixed(1)} ko`
}

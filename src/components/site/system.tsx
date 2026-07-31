import { FileCode2, Moon, SlidersHorizontal, Type } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/cn'
import { SECTION_LABELS, SECTION_ORDER } from '@/lib/spec'
import { UIPM_FONT_PAIRS, UIPM_PALETTES } from '@/lib/uipm'

function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-panel border border-edge bg-panel p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

function PanelHead({
  icon: Icon,
  label,
  title,
}: {
  icon?: typeof Type
  label: string
  title: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="eyebrow flex items-center gap-2">
        {Icon ? <Icon className="size-3.5 text-violet" aria-hidden /> : null}
        {label}
      </p>
      <h3 className="text-[1.0625rem]">{title}</h3>
    </div>
  )
}

const SAMPLE_PALETTES = ['SaaS (General)', 'Bakery/Cafe', 'Beauty/Spa/Wellness Service', 'Architecture / Interior', 'Banking/Traditional Finance']
  .map((label) => UIPM_PALETTES.find((p) => p.label === label))
  .filter((p): p is (typeof UIPM_PALETTES)[number] => Boolean(p))

const SAMPLE_PAIRS = UIPM_FONT_PAIRS.slice(0, 3)

export function System() {
  return (
    <section id="systeme" className="border-b border-edge bg-tint py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow">Le système</p>
          <h2 className="max-w-[28ch] text-[clamp(1.9rem,3.4vw,2.7rem)]">
            Sept blocs, {UIPM_PALETTES.length} palettes, {UIPM_FONT_PAIRS.length} associations de
            polices. Le brief choisit, vous tranchez.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Panel className="h-full">
              <PanelHead
                icon={SlidersHorizontal}
                label="Blocs"
                title="Chaque section s’ajoute ou se retire, l’ordre reste tenu"
              />
              <div className="flex flex-wrap gap-2">
                {SECTION_ORDER.map((section, index) => (
                  <span
                    key={section}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2 text-[0.8125rem]',
                      index < 5
                        ? 'border-violet/25 bg-wash text-violet'
                        : 'border-edge bg-paper text-ink-faint',
                    )}
                  >
                    <span className="num font-mono text-[0.6875rem] opacity-60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {SECTION_LABELS[section]}
                  </span>
                ))}
              </div>
              <p className="mt-auto text-[0.9375rem] leading-relaxed text-ink-soft">
                Les cinq premiers blocs sont actifs par défaut pour le modèle Studio. Retirer un bloc
                ne décale rien : la numérotation ci-dessus est l’ordre définitif de la page.
              </p>
            </Panel>
          </Reveal>

          <Reveal delay={0.06}>
            <Panel className="h-full">
              <PanelHead
                label="Palettes"
                title={`${UIPM_PALETTES.length} accords, indexés par métier`}
              />
              <ul className="flex flex-col gap-2.5">
                {SAMPLE_PALETTES.map((palette) => (
                  <li key={palette.id} className="flex items-center gap-3">
                    <span className="flex shrink-0 gap-1" aria-hidden>
                      {[palette.ground, palette.raised, palette.ink, palette.accent].map(
                        (hex, index) => (
                          <span
                            key={`${palette.id}-${index}`}
                            className="size-5 rounded-[5px] border border-edge"
                            style={{ background: hex }}
                          />
                        ),
                      )}
                    </span>
                    <span className="truncate text-[0.9375rem]">{palette.label}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          <Reveal delay={0.02}>
            <Panel className="h-full">
              <PanelHead
                icon={Type}
                label="Typographies"
                title={`${UIPM_FONT_PAIRS.length} associations prêtes`}
              />
              <ul className="flex flex-col gap-3">
                {SAMPLE_PAIRS.map((pair) => (
                  <li
                    key={pair.id}
                    className="flex flex-col gap-1 border-t border-edge pt-3 first:border-0 first:pt-0"
                  >
                    <span className="text-[1.05rem] leading-tight font-medium">{pair.label}</span>
                    <span className="truncate font-mono text-[0.6875rem] tracking-wider text-ink-faint">
                      {pair.heading} / {pair.body}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          <Reveal delay={0.06}>
            <Panel className="h-full">
              <PanelHead icon={FileCode2} label="Export" title="Un seul fichier, aucune dépendance" />
              <pre className="scroll-x rounded-xl border border-edge bg-paper p-4 font-mono text-[0.75rem] leading-relaxed text-ink-soft">
                <code>{`site.html
├── <style> intégré
├── images intégrées
├── polices système
└── 0 requête externe`}</code>
              </pre>
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                Déposez le fichier sur n’importe quel hébergeur, ou ouvrez-le directement. Il n’y a
                rien à construire. Les vraies Google Fonts restent possibles, au prix d’une requête.
              </p>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel className="h-full">
              <PanelHead icon={Moon} label="Thème" title="Les deux thèmes sont dessinés, pas inversés" />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2 rounded-xl border border-edge bg-white p-3">
                  <span className="h-1.5 w-10 rounded-full bg-[#6c2bd9]" />
                  <span className="h-1.5 w-16 rounded-full bg-[#e8e1f7]" />
                  <span className="h-1.5 w-12 rounded-full bg-[#e8e1f7]" />
                  <span className="mt-1 font-mono text-[0.625rem] tracking-wider uppercase text-[#665d7b]">
                    clair
                  </span>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-[#2c2140] bg-[#100c19] p-3">
                  <span className="h-1.5 w-10 rounded-full bg-[#a78bfa]" />
                  <span className="h-1.5 w-16 rounded-full bg-[#2c2140]" />
                  <span className="h-1.5 w-12 rounded-full bg-[#2c2140]" />
                  <span className="mt-1 font-mono text-[0.625rem] tracking-wider uppercase text-[#a89ec0]">
                    sombre
                  </span>
                </div>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                Chaque palette possède ses deux versants, avec un accent qui reste lisible sur fond
                clair comme sur fond sombre.
              </p>
            </Panel>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

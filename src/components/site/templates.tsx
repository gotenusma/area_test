import { useMemo, useState } from 'react'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { Reveal } from '@/components/ui/reveal'
import { Segmented } from '@/components/ui/segmented'
import { BRIEFS } from '@/lib/briefs'
import { cn } from '@/lib/cn'
import { DEVICE_OPTIONS, type Device } from '@/lib/device'
import { specFromPrompt } from '@/lib/content'
import { renderSite } from '@/lib/generator'
import { slugify } from '@/lib/slug'
import { TEMPLATES, type TemplateId } from '@/lib/spec'
import { paletteById } from '@/lib/uipm'

/** Each model is demonstrated with the brief that naturally lands on it. */
const BRIEF_FOR: Record<TemplateId, string> = {
  studio: BRIEFS[3].text,
  boutique: BRIEFS[1].text,
  produit: BRIEFS[2].text,
  table: BRIEFS[0].text,
}

export function Templates() {
  const [active, setActive] = useState<TemplateId>('studio')
  const [device, setDevice] = useState<Device>('desktop')

  const spec = useMemo(() => specFromPrompt(BRIEF_FOR[active], { template: active }), [active])
  const html = useMemo(() => renderSite(spec), [spec])
  const palette = paletteById(spec.paletteId)

  return (
    <section id="modeles" className="border-b border-edge py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow">Quatre modèles</p>
          <h2 className="max-w-[26ch] text-[clamp(1.9rem,3.4vw,2.7rem)]">
            Un point de départ par métier, pas un thème passe-partout.
          </h2>
          <p className="max-w-[58ch] text-ink-soft">
            Le brief détermine le modèle, mais rien n’est verrouillé : chaque choix reste modifiable
            dans le Studio. Les aperçus ci-dessous sont générés à l’instant, par le même moteur que
            votre export.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="flex flex-col gap-2.5">
            {TEMPLATES.map((template) => {
              const selected = template.id === active
              return (
                <button
                  key={template.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(template.id)}
                  className={cn(
                    'group rounded-panel border p-5 text-left transition-all duration-200',
                    selected
                      ? 'border-violet bg-wash shadow-soft'
                      : 'border-edge bg-panel hover:border-edge-strong hover:bg-tint',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-[1.0625rem] font-semibold">{template.label}</h3>
                    <span
                      className={cn(
                        'font-mono text-[0.6875rem] tracking-widest uppercase',
                        selected ? 'text-violet' : 'text-ink-faint',
                      )}
                    >
                      {selected ? 'affiché' : 'voir'}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {template.blurb}
                  </p>
                  <p className="mt-3 flex flex-wrap gap-1.5">
                    {template.defaults.map((section) => (
                      <span
                        key={section}
                        className="rounded border border-edge bg-paper px-1.5 py-0.5 font-mono text-[0.625rem] tracking-wider uppercase text-ink-faint"
                      >
                        {section}
                      </span>
                    ))}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="eyebrow">Palette retenue</span>
                <span className="flex items-center gap-1" aria-hidden>
                  {[palette.ground, palette.ink, palette.accent].map((hex, index) => (
                    <span
                      key={`${hex}-${index}`}
                      className="size-4 rounded-[4px] border border-edge"
                      style={{ background: hex }}
                    />
                  ))}
                </span>
                <span className="font-mono text-[0.8125rem] text-ink">{palette.label}</span>
              </div>

              <Segmented
                ariaLabel="Largeur d’aperçu"
                value={device}
                onChange={setDevice}
                options={DEVICE_OPTIONS}
                className="w-full sm:w-auto"
              />
            </div>

            <BrowserFrame
              html={html}
              device={device}
              url={`${slugify(spec.name)}.fr`}
              title={`Aperçu du modèle ${spec.template}`}
              viewportClassName="h-[520px] lg:h-[620px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

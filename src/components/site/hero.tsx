import { ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useDeferredValue, useMemo } from 'react'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { BRIEFS } from '@/lib/briefs'
import { cn } from '@/lib/cn'
import { specFromPrompt } from '@/lib/content'
import { renderSite, weightOf } from '@/lib/generator'
import { slugify } from '@/lib/slug'
import { templateOf, paletteOf } from '@/lib/spec'
import { useIntroTyping } from '@/lib/use-typewriter'

export function Hero({
  prompt,
  onPrompt,
  onOpenStudio,
}: {
  prompt: string
  onPrompt: (value: string) => void
  onOpenStudio: () => void
}) {
  const reduced = useReducedMotion()
  const { typing, cancel } = useIntroTyping({
    text: BRIEFS[0].text,
    onType: onPrompt,
    enabled: !reduced,
  })

  /* The preview follows the field one render behind, so typing stays smooth. */
  const deferred = useDeferredValue(prompt)
  const spec = useMemo(() => specFromPrompt(deferred || BRIEFS[0].text), [deferred])
  const html = useMemo(() => renderSite(spec), [spec])

  const readout = [
    { label: 'modèle', value: templateOf(spec.template).label },
    { label: 'palette', value: paletteOf(spec.palette).label },
    { label: 'poids', value: weightOf(html) },
  ]

  return (
    <section className="relative overflow-hidden border-b border-edge">
      <div className="blueprint blueprint-fade pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-[50%] bg-violet/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-14 px-6 pt-16 pb-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:pt-24 lg:pb-28">
        <div className="max-w-[36rem]">
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="size-3.5 text-violet" aria-hidden />
            Générateur de sites — tout se passe dans le navigateur
          </p>

          <h1 className="mt-5 text-[clamp(2.6rem,5.4vw,4.1rem)] leading-[0.98]">
            Décrivez le site.
            <br />
            <span className="text-violet">Repartez avec le code.</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft">
            Écrivez votre brief en une phrase. Fabrique choisit un modèle, une palette et une
            typographie, compose les sections et vous rend un fichier HTML autonome — sans compte,
            sans serveur, sans dépendance à installer.
          </p>

          <div className="mt-8">
            <label htmlFor="brief" className="eyebrow">
              Votre brief
            </label>
            <div className="relative mt-2.5">
              <Textarea
                id="brief"
                value={prompt}
                rows={3}
                spellCheck={false}
                onChange={(event) => {
                  cancel()
                  onPrompt(event.target.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) onOpenStudio()
                }}
                placeholder="Un site pour…"
                /* A full brief needs more lines before the text wraps on a phone. */
                className="min-h-[132px] pr-12 text-[0.9375rem] sm:min-h-[92px]"
              />
              {typing ? (
                <span
                  className="pointer-events-none absolute right-4 bottom-3 h-4 w-[2px] animate-caret bg-violet"
                  aria-hidden
                />
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1">Exemples</span>
              {BRIEFS.map((brief) => (
                <button
                  key={brief.label}
                  type="button"
                  onClick={() => {
                    cancel()
                    onPrompt(brief.text)
                  }}
                  className={cn(
                    'rounded-lg border border-edge bg-panel px-2.5 py-1 text-[0.8125rem] text-ink-soft',
                    'transition-colors hover:border-violet hover:bg-wash hover:text-violet',
                  )}
                >
                  {brief.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onOpenStudio}>
              Ouvrir dans le Studio
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink-faint">
              <CornerDownLeft className="size-3.5" aria-hidden />
              ⌘ + Entrée
            </span>
          </div>
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 22 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <BrowserFrame
            html={html}
            url={`${slugify(spec.name)}.fr`}
            title="Aperçu du site généré"
            viewportClassName="h-[440px] lg:h-[520px]"
            toolbar={
              <span className="hidden shrink-0 items-center gap-1.5 font-mono text-[0.6875rem] text-ink-faint sm:flex">
                <span className="size-1.5 rounded-full bg-violet" aria-hidden />
                aperçu en direct
              </span>
            }
          />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
            {readout.map((item) => (
              <p key={item.label} className="flex items-baseline gap-2">
                <span className="eyebrow">{item.label}</span>
                <span className="num font-mono text-[0.8125rem] text-ink">{item.value}</span>
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

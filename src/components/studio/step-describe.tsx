import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { BRIEFS } from '@/lib/briefs'
import { cn } from '@/lib/cn'
import { templateOf, type SiteSpec } from '@/lib/spec'
import { fontPairById, paletteById } from '@/lib/uipm'

const PROMPTS = [
  'Qui êtes-vous, et que proposez-vous ?',
  'À qui vous adressez-vous ?',
  'Quel ton : sobre, chaleureux, audacieux ?',
]

/** Step 1 — the brief, written the way you would explain the idea to someone. */
export function StepDescribe({
  brief,
  onBrief,
  spec,
  onNext,
}: {
  brief: string
  onBrief: (value: string) => void
  spec: SiteSpec
  onNext: () => void
}) {
  const palette = paletteById(spec.paletteId)
  const pair = fontPairById(spec.fontPairId)
  const ready = brief.trim().length >= 25

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-[1.375rem]">Décrivez votre idée</h2>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
          Écrivez-la comme vous l’expliqueriez à quelqu’un. Une ou deux phrases suffisent : le
          métier, le nom, le ton.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <Textarea
          value={brief}
          rows={6}
          spellCheck={false}
          autoFocus
          onChange={(event) => onBrief(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && ready) onNext()
          }}
          placeholder="Un site pour…"
          className="min-h-[150px] text-[0.9375rem] leading-relaxed"
          aria-label="Votre brief"
        />

        <ul className="flex flex-col gap-1">
          {PROMPTS.map((prompt) => (
            <li key={prompt} className="flex items-baseline gap-2 text-[0.8125rem] text-ink-faint">
              <span aria-hidden className="text-violet">
                ·
              </span>
              {prompt}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">Exemples</span>
        {BRIEFS.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => onBrief(example.text)}
            className={cn(
              'rounded-lg border border-edge bg-panel px-2.5 py-1 text-[0.8125rem] text-ink-soft',
              'transition-colors hover:border-violet hover:bg-wash hover:text-violet',
            )}
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* What the brief resolved to, so the reading is never a black box. */}
      <div className="flex flex-col gap-3 rounded-panel border border-edge bg-tint p-4">
        <p className="eyebrow flex items-center gap-2">
          <Sparkles className="size-3.5 text-violet" aria-hidden />
          Ce que Fabrique a compris
        </p>

        {ready ? (
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[0.8125rem]">
            <dt className="text-ink-faint">Nom</dt>
            <dd className="truncate font-medium">{spec.name}</dd>

            <dt className="text-ink-faint">Modèle</dt>
            <dd className="font-medium">{templateOf(spec.template).label}</dd>

            <dt className="text-ink-faint">Palette</dt>
            <dd className="flex min-w-0 items-center gap-2">
              <span className="flex shrink-0 gap-1" aria-hidden>
                {[palette.ground, palette.ink, palette.accent].map((hex, index) => (
                  <span
                    key={`${hex}-${index}`}
                    className="size-3.5 rounded-[3px] border border-edge"
                    style={{ background: hex }}
                  />
                ))}
              </span>
              <span className="truncate font-medium">{palette.label}</span>
            </dd>

            <dt className="text-ink-faint">Typographie</dt>
            <dd className="truncate font-medium">
              {pair.label}
              <span className="ml-1.5 font-normal text-ink-faint">
                {pair.heading} / {pair.body}
              </span>
            </dd>
          </dl>
        ) : (
          <p className="text-[0.8125rem] text-ink-faint">
            Encore quelques mots et Fabrique choisira le modèle, la palette et la typographie.
          </p>
        )}
      </div>

      <Button size="lg" onClick={onNext} disabled={!ready} className="w-full">
        Continuer
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </div>
  )
}

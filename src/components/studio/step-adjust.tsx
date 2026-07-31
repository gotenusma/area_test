import { ArrowLeft, Palette, Search, Type } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { Segmented } from '@/components/ui/segmented'
import { ToggleChip } from '@/components/ui/toggle-chip'
import { cn } from '@/lib/cn'
import {
  SECTION_LABELS,
  SECTION_ORDER,
  TEMPLATES,
  sortSections,
  templateOf,
  type SectionId,
  type SiteSpec,
} from '@/lib/spec'
import {
  UIPM_FONT_PAIRS,
  UIPM_PALETTES,
  fontPairById,
  paletteById,
  suggestFontPairs,
  suggestPalettes,
} from '@/lib/uipm'

/** Step 3 — every choice the generator made, now yours to change. */
export function StepAdjust({
  spec,
  patch,
  onBack,
}: {
  spec: SiteSpec
  patch: (next: Partial<SiteSpec>) => void
  onBack: () => void
}) {
  const [paletteQuery, setPaletteQuery] = useState('')
  const [fontQuery, setFontQuery] = useState('')

  const palette = paletteById(spec.paletteId)
  const pair = fontPairById(spec.fontPairId)

  const palettes = useMemo(() => {
    const query = paletteQuery.trim().toLowerCase()
    if (query) {
      return UIPM_PALETTES.filter((p) => p.label.toLowerCase().includes(query)).slice(0, 10)
    }
    const suggested = suggestPalettes(spec.prompt, 8)
    return suggested.some((p) => p.id === palette.id) ? suggested : [palette, ...suggested.slice(0, 7)]
  }, [paletteQuery, spec.prompt, palette])

  const pairs = useMemo(() => {
    const query = fontQuery.trim().toLowerCase()
    if (query) {
      return UIPM_FONT_PAIRS.filter(
        (p) =>
          p.label.toLowerCase().includes(query) ||
          p.heading.toLowerCase().includes(query) ||
          p.body.toLowerCase().includes(query),
      ).slice(0, 10)
    }
    const suggested = suggestFontPairs(spec.prompt, 6)
    return suggested.some((p) => p.id === pair.id) ? suggested : [pair, ...suggested.slice(0, 5)]
  }, [fontQuery, spec.prompt, pair])

  const toggleSection = (section: SectionId) => {
    const has = spec.sections.includes(section)
    if (has && spec.sections.length === 1) return
    patch({
      sections: has
        ? spec.sections.filter((s) => s !== section)
        : sortSections([...spec.sections, section]),
    })
  }

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-2">
        <h2 className="text-[1.375rem]">Ajustez</h2>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
          Rien n’est verrouillé. Les propositions viennent des bases UI/UX Pro Max —{' '}
          {UIPM_PALETTES.length} palettes et {UIPM_FONT_PAIRS.length} associations de polices.
        </p>
      </header>

      <Field label="Nom du site">
        <Input value={spec.name} onChange={(event) => patch({ name: event.target.value })} />
      </Field>

      <Field label="Modèle">
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              aria-pressed={spec.template === template.id}
              onClick={() =>
                patch({ template: template.id, sections: templateOf(template.id).defaults })
              }
              className={cn(
                'rounded-xl border px-3 py-2.5 text-left text-[0.8125rem] font-medium transition-colors',
                spec.template === template.id
                  ? 'border-violet bg-wash text-violet'
                  : 'border-edge bg-panel text-ink-soft hover:border-edge-strong hover:text-ink',
              )}
            >
              {template.label}
            </button>
          ))}
        </div>
      </Field>

      {/* ------------------------------- couleurs ------------------------------- */}
      <div className="flex flex-col gap-3 border-t border-edge pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow flex items-center gap-2">
            <Palette className="size-3.5 text-violet" aria-hidden />
            Couleurs
          </p>
          <span className="font-mono text-[0.6875rem] text-ink-faint">{palette.label}</span>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <Input
            value={paletteQuery}
            onChange={(event) => setPaletteQuery(event.target.value)}
            placeholder={`Chercher parmi ${UIPM_PALETTES.length} palettes…`}
            className="pl-9 text-[0.8125rem]"
            aria-label="Chercher une palette"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {palettes.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={spec.paletteId === entry.id}
              onClick={() => patch({ paletteId: entry.id, accent: null })}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-[0.8125rem] transition-colors',
                spec.paletteId === entry.id
                  ? 'border-violet bg-wash font-medium text-violet'
                  : 'border-edge bg-panel text-ink-soft hover:border-edge-strong hover:text-ink',
              )}
            >
              <span className="flex shrink-0 gap-1" aria-hidden>
                {[entry.ground, entry.raised, entry.ink, entry.accent].map((hex, index) => (
                  <span
                    key={`${entry.id}-${index}`}
                    className="size-4 rounded-[4px] border border-edge"
                    style={{ background: hex }}
                  />
                ))}
              </span>
              <span className="truncate">{entry.label}</span>
            </button>
          ))}
          {palettes.length === 0 && (
            <p className="px-1 text-[0.8125rem] text-ink-faint">Aucune palette pour cette recherche.</p>
          )}
        </div>

        <Field label="Couleur principale" hint={spec.accent ? 'personnalisée' : 'de la palette'}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={spec.accent ?? palette.accent}
              onChange={(event) => patch({ accent: event.target.value })}
              aria-label="Choisir la couleur principale"
              className="size-10 shrink-0 cursor-pointer rounded-lg border border-edge bg-panel p-1"
            />
            <Input
              value={spec.accent ?? palette.accent}
              onChange={(event) => patch({ accent: event.target.value })}
              className="font-mono text-[0.8125rem]"
              aria-label="Code hexadécimal de la couleur principale"
            />
            {spec.accent && (
              <Button variant="ghost" size="sm" onClick={() => patch({ accent: null })}>
                Rétablir
              </Button>
            )}
          </div>
        </Field>
      </div>

      {/* ------------------------------ typographie ----------------------------- */}
      <div className="flex flex-col gap-3 border-t border-edge pt-6">
        <p className="eyebrow flex items-center gap-2">
          <Type className="size-3.5 text-violet" aria-hidden />
          Police d’écriture
        </p>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <Input
            value={fontQuery}
            onChange={(event) => setFontQuery(event.target.value)}
            placeholder={`Chercher parmi ${UIPM_FONT_PAIRS.length} associations…`}
            className="pl-9 text-[0.8125rem]"
            aria-label="Chercher une association de polices"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {pairs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={spec.fontPairId === entry.id}
              onClick={() => patch({ fontPairId: entry.id })}
              className={cn(
                'flex flex-col gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors',
                spec.fontPairId === entry.id
                  ? 'border-violet bg-wash text-violet'
                  : 'border-edge bg-panel hover:border-edge-strong',
              )}
            >
              <span className="text-[0.8125rem] font-medium">{entry.label}</span>
              <span className="truncate text-[0.75rem] text-ink-faint">
                {entry.heading} / {entry.body}
              </span>
            </button>
          ))}
          {pairs.length === 0 && (
            <p className="px-1 text-[0.8125rem] text-ink-faint">Aucune association pour cette recherche.</p>
          )}
        </div>

        <Field
          label="Livraison des polices"
          hint={spec.fontDelivery === 'systeme' ? 'aucune requête' : '1 requête externe'}
        >
          <Segmented
            ariaLabel="Livraison des polices"
            value={spec.fontDelivery}
            onChange={(value) => patch({ fontDelivery: value })}
            options={[
              { value: 'systeme', label: 'Système' },
              { value: 'google', label: 'Google Fonts' },
            ]}
          />
        </Field>
        <p className="-mt-1 text-[0.75rem] leading-relaxed text-ink-faint">
          {spec.fontDelivery === 'systeme'
            ? 'Des piles système au caractère proche : le fichier exporté reste autonome.'
            : 'Les vraies polices, au prix d’un appel à fonts.googleapis.com au chargement.'}
        </p>
      </div>

      {/* -------------------------------- mise en page -------------------------- */}
      <div className="flex flex-col gap-4 border-t border-edge pt-6">
        <Field label="Sections" hint={`${spec.sections.length} / ${SECTION_ORDER.length}`}>
          <div className="flex flex-wrap gap-1.5">
            {SECTION_ORDER.map((section) => (
              <ToggleChip
                key={section}
                label={SECTION_LABELS[section]}
                active={spec.sections.includes(section)}
                onClick={() => toggleSection(section)}
              />
            ))}
          </div>
        </Field>

        <Field label="Arrondi" hint={`${spec.radius} px`}>
          <input
            type="range"
            min={0}
            max={22}
            step={1}
            value={spec.radius}
            onChange={(event) => patch({ radius: Number(event.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-edge"
            style={{ accentColor: 'var(--violet)' }}
            aria-label="Arrondi des angles"
          />
        </Field>

        <Field label="Densité">
          <Segmented
            ariaLabel="Densité"
            value={spec.density}
            onChange={(value) => patch({ density: value })}
            options={[
              { value: 'aere', label: 'Aérée' },
              { value: 'compact', label: 'Compacte' },
            ]}
          />
        </Field>

        <Field label="Thème du site généré">
          <Segmented
            ariaLabel="Thème du site généré"
            value={spec.dark ? 'sombre' : 'clair'}
            onChange={(value) => patch({ dark: value === 'sombre' })}
            options={[
              { value: 'clair', label: 'Clair' },
              { value: 'sombre', label: 'Sombre' },
            ]}
          />
        </Field>
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        <ArrowLeft className="size-4" aria-hidden />
        Retour aux fichiers
      </Button>
    </div>
  )
}

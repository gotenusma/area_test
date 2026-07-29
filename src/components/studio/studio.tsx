import { Check, Copy, Download, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CodeView } from '@/components/studio/code-view'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/field'
import { Segmented } from '@/components/ui/segmented'
import { ToggleChip } from '@/components/ui/toggle-chip'
import { cn } from '@/lib/cn'
import { DEVICE_OPTIONS, type Device } from '@/lib/device'
import { specFromPrompt } from '@/lib/content'
import { renderSite, weightOf } from '@/lib/generator'
import { slugify } from '@/lib/slug'
import {
  PALETTES,
  SECTION_LABELS,
  SECTION_ORDER,
  TEMPLATES,
  TYPESETS,
  sortSections,
  templateOf,
  type PaletteId,
  type SectionId,
  type SiteSpec,
  type TemplateId,
  type TypeSetId,
} from '@/lib/spec'

export function Studio({ prompt }: { prompt: string }) {
  const [brief, setBrief] = useState(prompt)
  const [spec, setSpec] = useState<SiteSpec>(() => specFromPrompt(prompt))
  const [device, setDevice] = useState<Device>('desktop')
  const [tab, setTab] = useState<'apercu' | 'code'>('apercu')
  const [copied, setCopied] = useState(false)

  const html = useMemo(() => renderSite(spec), [spec])
  const fileName = `${slugify(spec.name)}.html`

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const patch = (next: Partial<SiteSpec>) => setSpec((current) => ({ ...current, ...next }))

  const regenerate = () => {
    /* Re-reading the brief resets every inferred choice, including the copy. */
    setSpec(specFromPrompt(brief))
  }

  const pickTemplate = (template: TemplateId) => {
    patch({ template, sections: templateOf(template).defaults })
  }

  const toggleSection = (section: SectionId) => {
    setSpec((current) => {
      const has = current.sections.includes(section)
      if (has && current.sections.length === 1) return current
      const next = has
        ? current.sections.filter((s) => s !== section)
        : sortSections([...current.sections, section])
      return { ...current, sections: next }
    })
  }

  const download = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-[1480px] gap-6 px-6 py-8 lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* ------------------------------- controls ------------------------------- */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:pr-1">
        <div className="flex flex-col gap-3">
          <Field label="Brief" hint="relisez, puis régénérez">
            <Textarea
              value={brief}
              rows={4}
              spellCheck={false}
              onChange={(event) => setBrief(event.target.value)}
              className="text-[0.875rem]"
            />
          </Field>
          <Button variant="outline" onClick={regenerate} className="w-full">
            <RefreshCw className="size-4" aria-hidden />
            Régénérer depuis le brief
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-edge pt-6">
          <Field label="Nom du site">
            <Input value={spec.name} onChange={(event) => patch({ name: event.target.value })} />
          </Field>
          <Field label="Accroche">
            <Textarea
              value={spec.tagline}
              rows={2}
              onChange={(event) => patch({ tagline: event.target.value })}
              className="text-[0.875rem]"
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3 border-t border-edge pt-6">
          <Field label="Modèle">
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  aria-pressed={spec.template === template.id}
                  onClick={() => pickTemplate(template.id)}
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
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Palette">
            <div className="flex flex-col gap-1.5">
              {PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  aria-pressed={spec.palette === palette.id}
                  onClick={() => patch({ palette: palette.id as PaletteId })}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-2 text-[0.8125rem] transition-colors',
                    spec.palette === palette.id
                      ? 'border-violet bg-wash text-violet font-medium'
                      : 'border-edge bg-panel text-ink-soft hover:border-edge-strong hover:text-ink',
                  )}
                >
                  <span className="flex gap-1" aria-hidden>
                    {palette.swatch.map((hex) => (
                      <span
                        key={hex}
                        className="size-4 rounded-[4px] border border-edge"
                        style={{ background: hex }}
                      />
                    ))}
                  </span>
                  {palette.label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Typographie">
            <Segmented
              ariaLabel="Typographie"
              value={spec.typeset}
              onChange={(value) => patch({ typeset: value as TypeSetId })}
              options={TYPESETS.map((t) => ({ value: t.id, label: t.label }))}
            />
          </Field>

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
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-edge accent-violet"
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
      </aside>

      {/* ------------------------------- preview -------------------------------- */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            ariaLabel="Vue"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'apercu', label: 'Aperçu' },
              { value: 'code', label: 'Code' },
            ]}
          />

          <Segmented
            ariaLabel="Largeur d’aperçu"
            value={device}
            onChange={setDevice}
            options={DEVICE_OPTIONS}
          />

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden font-mono text-[0.6875rem] text-ink-faint sm:inline">
              {fileName} · {weightOf(html)}
            </span>
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? (
                <Check className="size-3.5 text-good" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              {copied ? 'Copié' : 'Copier'}
            </Button>
            <Button size="sm" onClick={download}>
              <Download className="size-3.5" aria-hidden />
              Télécharger
            </Button>
          </div>
        </div>

        {tab === 'apercu' ? (
          <BrowserFrame
            html={html}
            device={device}
            url={`${slugify(spec.name)}.fr`}
            title="Aperçu du site généré"
            viewportClassName="h-[calc(100dvh-13rem)] min-h-[460px]"
          />
        ) : (
          <div className="flex h-[calc(100dvh-13rem)] min-h-[460px] flex-col overflow-hidden rounded-frame border border-edge bg-panel shadow-lift">
            <div className="flex items-center justify-between gap-3 border-b border-edge bg-tint px-4 py-2.5">
              <span className="font-mono text-[0.6875rem] tracking-wider uppercase text-ink-faint">
                {fileName}
              </span>
              <span className="font-mono text-[0.6875rem] text-ink-faint">
                {html.split('\n').length} lignes · {weightOf(html)}
              </span>
            </div>
            <CodeView html={html} />
          </div>
        )}
      </div>
    </div>
  )
}

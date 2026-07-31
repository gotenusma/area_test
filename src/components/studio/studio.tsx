import { Check, Copy, Download } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CodeView } from '@/components/studio/code-view'
import { StepAdjust } from '@/components/studio/step-adjust'
import { StepDescribe } from '@/components/studio/step-describe'
import { StepFiles } from '@/components/studio/step-files'
import { Stepper } from '@/components/studio/stepper'
import { BrowserFrame } from '@/components/ui/browser-frame'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/ui/segmented'
import { specFromPrompt } from '@/lib/content'
import { DEVICE_OPTIONS, type Device } from '@/lib/device'
import { renderSite, weightOf } from '@/lib/generator'
import { slugify } from '@/lib/slug'
import type { StepId } from '@/lib/steps'
import type { SiteAssets, SiteSpec } from '@/lib/spec'

export function Studio({ prompt }: { prompt: string }) {
  const [step, setStep] = useState<StepId>(1)
  const [furthest, setFurthest] = useState<StepId>(1)
  const [brief, setBrief] = useState(prompt)
  const [spec, setSpec] = useState<SiteSpec>(() => specFromPrompt(prompt))
  const [device, setDevice] = useState<Device>('desktop')
  const [tab, setTab] = useState<'apercu' | 'code'>('apercu')
  const [pane, setPane] = useState<'etapes' | 'apercu'>('etapes')
  const [copied, setCopied] = useState(false)

  const html = useMemo(() => renderSite(spec), [spec])
  const fileName = `${slugify(spec.name)}.html`

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const patch = (next: Partial<SiteSpec>) => setSpec((current) => ({ ...current, ...next }))

  /* Editing the brief re-reads it, but keeps whatever the user has already
     imported or adjusted by hand — re-inferring over their choices would undo
     their work every keystroke. */
  const updateBrief = (value: string) => {
    setBrief(value)
    setSpec((current) => ({
      ...specFromPrompt(value, {
        name: current.name === specFromPrompt(current.prompt).name ? undefined : current.name,
      }),
      assets: current.assets,
    }))
  }

  const setAssets = (assets: SiteAssets) => patch({ assets })

  const go = (next: StepId) => {
    setStep(next)
    setFurthest((current) => (next > current ? next : current))
    setPane('etapes')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-6 sm:px-6">
      <Stepper current={step} furthest={furthest} onGo={go} />

      {/* One pane at a time on a phone; side by side from large screens up. */}
      <Segmented
        ariaLabel="Volet affiché"
        value={pane}
        onChange={setPane}
        options={[
          { value: 'etapes', label: `Étape ${step}` },
          { value: 'apercu', label: 'Aperçu' },
        ]}
        className="lg:hidden"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section
          className={cnPane(pane === 'etapes')}
          aria-label={`Étape ${step}`}
        >
          {step === 1 && (
            <StepDescribe brief={brief} onBrief={updateBrief} spec={spec} onNext={() => go(2)} />
          )}
          {step === 2 && (
            <StepFiles
              assets={spec.assets}
              onAssets={setAssets}
              onBack={() => go(1)}
              onNext={() => go(3)}
            />
          )}
          {step === 3 && <StepAdjust spec={spec} patch={patch} onBack={() => go(2)} />}
        </section>

        <section className={cnPane(pane === 'apercu')} aria-label="Aperçu">
          <div className="flex flex-col gap-3 lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
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
                className="hidden sm:flex"
              />

              <div className="ml-auto flex items-center gap-2">
                <span className="hidden font-mono text-[0.6875rem] text-ink-faint xl:inline">
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
                viewportClassName="h-[62dvh] min-h-[380px] lg:h-[calc(100dvh-13rem)]"
              />
            ) : (
              <div className="flex h-[62dvh] min-h-[380px] flex-col overflow-hidden rounded-frame border border-edge bg-panel shadow-lift lg:h-[calc(100dvh-13rem)]">
                <div className="flex items-center justify-between gap-3 border-b border-edge bg-tint px-4 py-2.5">
                  <span className="truncate font-mono text-[0.6875rem] tracking-wider uppercase text-ink-faint">
                    {fileName}
                  </span>
                  <span className="shrink-0 font-mono text-[0.6875rem] text-ink-faint">
                    {html.split('\n').length} lignes · {weightOf(html)}
                  </span>
                </div>
                <CodeView html={html} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

/** Panes collapse on small screens but stay mounted, so state survives a switch. */
function cnPane(visible: boolean): string {
  return visible ? 'min-w-0' : 'hidden min-w-0 lg:block'
}

import { ArrowLeft, ArrowRight, FileText, ImagePlus, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import {
  ACCEPTED,
  MAX_IMAGES,
  formatBytes,
  importFile,
  isImage,
  isText,
  readAsText,
} from '@/lib/files'
import type { SiteAssets } from '@/lib/spec'

/** Step 2 — optional. Files stay in the page and end up inside the export. */
export function StepFiles({
  assets,
  onAssets,
  onBack,
  onNext,
}: {
  assets: SiteAssets
  onAssets: (assets: SiteAssets) => void
  onBack: () => void
  onNext: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = async (files: FileList | File[]) => {
    setBusy(true)
    const problems: string[] = []
    let next = { ...assets, images: [...assets.images] }

    for (const file of Array.from(files)) {
      try {
        if (isText(file)) {
          const text = await readAsText(file)
          next = { ...next, notes: text.trim().slice(0, 600) }
        } else if (isImage(file)) {
          const imported = await importFile(file)
          if (!next.logo) next = { ...next, logo: imported }
          else if (next.images.length < MAX_IMAGES) next.images = [...next.images, imported]
          else problems.push(`${file.name} ignoré — ${MAX_IMAGES} photos au maximum.`)
        } else {
          problems.push(`${file.name} : format non pris en charge.`)
        }
      } catch (error) {
        problems.push(error instanceof Error ? error.message : `${file.name} illisible.`)
      }
    }

    onAssets(next)
    setErrors(problems)
    setBusy(false)
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer?.files?.length) void accept(event.dataTransfer.files)
  }

  const count = assets.images.length + (assets.logo ? 1 : 0)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-[1.375rem]">Ajoutez vos fichiers</h2>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
          Un logo, quelques photos, un texte de présentation. Le premier visuel sert de logo, les
          suivants remplissent la galerie. Tout reste dans cette page et part dans le fichier
          exporté.
        </p>
      </header>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center gap-3 rounded-panel border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-violet bg-wash' : 'border-edge bg-panel',
        )}
      >
        <span className="grid size-11 place-items-center rounded-full bg-wash text-violet">
          <Upload className="size-5" aria-hidden />
        </span>
        <p className="text-[0.9375rem] font-medium">Déposez vos fichiers ici</p>
        <p className="max-w-[34ch] text-[0.8125rem] text-ink-faint">
          PNG, JPEG, WebP, SVG ou un texte (.txt, .md). Les photos sont réduites automatiquement
          pour garder un export léger.
        </p>
        <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
          <ImagePlus className="size-4" aria-hidden />
          {busy ? 'Lecture…' : 'Choisir des fichiers'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) void accept(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-xl border border-violet/25 bg-wash p-3 text-[0.8125rem] text-violet">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {count > 0 && (
        <div className="flex flex-col gap-2">
          <p className="eyebrow">
            {assets.logo ? 'Logo' : ''}
            {assets.logo && assets.images.length ? ' et photos' : assets.images.length ? 'Photos' : ''}
          </p>

          {assets.logo && (
            <AssetRow
              label="Logo"
              name={assets.logo.name}
              bytes={assets.logo.bytes}
              dataUri={assets.logo.dataUri}
              onRemove={() => onAssets({ ...assets, logo: null })}
            />
          )}

          {assets.images.map((image, index) => (
            <AssetRow
              key={image.id}
              label={`Photo ${index + 1}`}
              name={image.name}
              bytes={image.bytes}
              dataUri={image.dataUri}
              onRemove={() =>
                onAssets({ ...assets, images: assets.images.filter((i) => i.id !== image.id) })
              }
            />
          ))}
        </div>
      )}

      {assets.notes && (
        <div className="flex flex-col gap-2 rounded-panel border border-edge bg-panel p-4">
          <p className="eyebrow flex items-center gap-2">
            <FileText className="size-3.5 text-violet" aria-hidden />
            Texte importé — servira d’introduction
          </p>
          <p className="line-clamp-4 text-[0.8125rem] leading-relaxed text-ink-soft">
            {assets.notes}
          </p>
          <button
            type="button"
            onClick={() => onAssets({ ...assets, notes: '' })}
            className="self-start text-[0.8125rem] text-violet underline-offset-2 hover:underline"
          >
            Retirer ce texte
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="size-4" aria-hidden />
          Retour
        </Button>
        <Button onClick={onNext} className="flex-[2]">
          {count > 0 || assets.notes ? 'Continuer' : 'Passer cette étape'}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}

function AssetRow({
  label,
  name,
  bytes,
  dataUri,
  onRemove,
}: {
  label: string
  name: string
  bytes: number
  dataUri: string
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-edge bg-panel p-2">
      <img
        src={dataUri}
        alt=""
        className="size-11 shrink-0 rounded-lg border border-edge bg-tint object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8125rem] font-medium">{name}</p>
        <p className="font-mono text-[0.6875rem] text-ink-faint">
          {label} · {formatBytes(bytes)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Retirer ${name}`}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-tint hover:text-ink"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  )
}

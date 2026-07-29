import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Mark } from '@/components/site/header'
import { Reveal } from '@/components/ui/reveal'

export function ClosingCta({ onOpenStudio }: { onOpenStudio: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-edge">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-[50%] bg-violet/10 blur-3xl"
        aria-hidden
      />
      <Reveal className="relative mx-auto flex w-full max-w-[1240px] flex-col items-center gap-7 px-6 py-24 text-center">
        <p className="eyebrow">Prêt en une phrase</p>
        <h2 className="max-w-[22ch] text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02]">
          Votre prochain site existe déjà. Il attend le brief.
        </h2>
        <p className="max-w-[46ch] text-ink-soft">
          Ouvrez le Studio, écrivez une phrase, ajustez trois réglages, téléchargez le fichier. Le
          tout sans créer de compte.
        </p>
        <Button size="lg" onClick={onOpenStudio}>
          Ouvrir le Studio
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex max-w-[30ch] flex-col gap-3">
            <span className="flex items-center gap-2.5 font-display text-[1.0625rem] font-semibold">
              <Mark />
              Fabrique
            </span>
            <p className="text-[0.875rem] leading-relaxed text-ink-soft">
              Générateur de sites qui tourne entièrement dans votre navigateur. Démonstration front,
              sans backend.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-14 gap-y-2.5 text-[0.875rem] sm:grid-cols-3">
            <a href="#modeles" className="text-ink-soft transition-colors hover:text-ink">
              Modèles
            </a>
            <a href="#systeme" className="text-ink-soft transition-colors hover:text-ink">
              Le système
            </a>
            <a href="#methode" className="text-ink-soft transition-colors hover:text-ink">
              Méthode
            </a>
            <a href="#tarifs" className="text-ink-soft transition-colors hover:text-ink">
              Tarifs
            </a>
            <a href="#/studio" className="text-ink-soft transition-colors hover:text-ink">
              Studio
            </a>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge pt-6">
          <p className="font-mono text-[0.6875rem] tracking-wider uppercase text-ink-faint">
            © {new Date().getFullYear()} Fabrique — projet de démonstration
          </p>
          <p className="font-mono text-[0.6875rem] tracking-wider uppercase text-ink-faint">
            Aucune donnée ne quitte cette page
          </p>
        </div>
      </div>
    </footer>
  )
}

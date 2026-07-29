import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/cn'

const PLANS = [
  {
    name: 'Établi',
    price: '0 €',
    period: 'pour toujours',
    pitch: 'Pour essayer sérieusement, sans compte à créer.',
    features: [
      'Les quatre modèles',
      'Aperçu multi-appareils',
      'Export HTML autonome',
      'Un site à la fois',
    ],
    cta: 'Commencer',
    featured: false,
  },
  {
    name: 'Atelier',
    price: '12 €',
    period: 'par mois',
    pitch: 'Pour livrer des sites à des clients, régulièrement.',
    features: [
      'Sites illimités, gardés en mémoire',
      'Vos palettes et vos typographies',
      'Retrait du bloc de mentions',
      'Export en archive ZIP',
      'Historique des versions',
    ],
    cta: 'Prendre l’Atelier',
    featured: true,
  },
  {
    name: 'Fonderie',
    price: '39 €',
    period: 'par mois',
    pitch: 'Pour une équipe qui produit sous une même identité.',
    features: [
      'Cinq places incluses',
      'Modèles maison partagés',
      'Verrouillage de la charte',
      'Accès à l’API de génération',
      'Support sous quatre heures',
    ],
    cta: 'Parler à l’équipe',
    featured: false,
  },
]

export function Pricing({ onOpenStudio }: { onOpenStudio: () => void }) {
  return (
    <section id="tarifs" className="border-b border-edge bg-tint py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow">Tarifs</p>
          <h2 className="max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.7rem)]">
            Le générateur est gratuit. On paie pour garder son travail.
          </h2>
          <p className="max-w-[54ch] text-ink-soft">
            Aucune carte demandée pour l’Établi. Les formules payantes sont mensuelles et
            s’arrêtent quand vous le décidez.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.05} className="h-full">
              <article
                className={cn(
                  'flex h-full flex-col gap-6 rounded-panel border p-7',
                  plan.featured
                    ? 'border-violet bg-paper shadow-lift'
                    : 'border-edge bg-panel',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="eyebrow">{plan.name}</p>
                  {plan.featured ? <Badge>Le plus pris</Badge> : null}
                </div>

                <p className="flex items-baseline gap-2">
                  <span className="num font-display text-[2.4rem] leading-none font-semibold">
                    {plan.price}
                  </span>
                  <span className="text-[0.875rem] text-ink-faint">{plan.period}</span>
                </p>

                <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{plan.pitch}</p>

                <ul className="flex flex-col gap-2.5 border-t border-edge pt-5 text-[0.9375rem]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-violet" strokeWidth={2.5} aria-hidden />
                      <span className="text-ink-soft">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-auto w-full"
                  size="lg"
                  variant={plan.featured ? 'primary' : 'outline'}
                  onClick={onOpenStudio}
                >
                  {plan.cta}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

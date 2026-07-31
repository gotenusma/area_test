import { Reveal } from '@/components/ui/reveal'

/** A real sequence — the numbering carries the order, it isn't decoration. */
const STEPS = [
  {
    title: 'Décrire l’idée',
    body: 'Écrivez-la comme vous l’expliqueriez à quelqu’un : le métier, le nom, le ton. Fabrique en déduit le modèle, puis choisit la palette et l’association de polices en interrogeant les bases UI/UX Pro Max.',
    detail: '192 palettes, 74 associations',
  },
  {
    title: 'Ajouter vos fichiers',
    body: 'Un logo, quelques photos, un texte de présentation — ou rien du tout, l’étape se saute. Les images sont réduites puis intégrées au document, elles ne transitent par aucun serveur.',
    detail: 'Facultatif',
  },
  {
    title: 'Ajuster et exporter',
    body: 'Changez la police, la couleur principale, les sections, l’arrondi, le thème. L’aperçu se recompose à chaque geste, puis vous récupérez un HTML lisible et indenté.',
    detail: 'site.html — un seul fichier',
  },
]

export function Method() {
  return (
    <section id="methode" className="border-b border-edge py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow">Méthode</p>
          <h2 className="max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.7rem)]">
            Trois étapes, dans cet ordre, sans jamais quitter la page.
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-panel border border-edge bg-edge md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4 bg-paper p-7">
              <div className="flex items-center gap-3">
                <span className="num grid size-8 place-items-center rounded-lg bg-violet font-mono text-[0.8125rem] font-medium text-on-violet">
                  {index + 1}
                </span>
                <span className="h-px flex-1 bg-edge" aria-hidden />
              </div>
              <h3 className="text-[1.125rem]">{step.title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
              <p className="mt-auto font-mono text-[0.6875rem] tracking-wider uppercase text-violet">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

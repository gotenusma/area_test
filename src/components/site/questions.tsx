import { Plus } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

const QUESTIONS = [
  {
    q: 'Où tourne la génération ?',
    a: 'Entièrement dans votre navigateur. Le brief n’est envoyé nulle part, aucune requête ne part de la page, et la même phrase produit toujours exactement le même site.',
  },
  {
    q: 'Le code exporté m’appartient-il ?',
    a: 'Oui, sans réserve. C’est du HTML et du CSS que vous pouvez relire, modifier et revendre. Aucune mention de Fabrique n’est laissée dans le fichier.',
  },
  {
    q: 'Puis-je reprendre le résultat dans mon éditeur ?',
    a: 'C’est l’usage prévu. Le fichier est indenté et les classes portent des noms lisibles ; l’intégrer dans un projet React ou WordPress se fait bloc par bloc.',
  },
  {
    q: 'Et les images ?',
    a: 'Les aperçus utilisent des aplats construits à partir de votre palette, pour que rien ne dépende d’un fichier externe. Vous remplacez chaque bloc par vos photos au moment de l’intégration.',
  },
  {
    q: 'Les textes générés sont-ils utilisables tels quels ?',
    a: 'Ils sont écrits pour tenir dans la maquette et donner le bon rythme, pas pour parler de votre entreprise. Comptez une relecture : la structure est prête, les mots restent les vôtres.',
  },
]

export function Questions() {
  return (
    <section className="border-b border-edge py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <Reveal className="flex flex-col gap-4">
          <p className="eyebrow">Questions</p>
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)]">Ce qu’on nous demande avant d’essayer.</h2>
        </Reveal>

        <Reveal className="flex flex-col" delay={0.05}>
          {QUESTIONS.map((item) => (
            <details
              key={item.q}
              className="group border-t border-edge py-5 last:border-b [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h3 className="text-[1.0625rem] font-medium">{item.q}</h3>
                <Plus
                  className="mt-1 size-4 shrink-0 text-violet transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                {item.a}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

import { Moon, Sun } from 'lucide-react'
import { Button, LinkButton } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import type { Theme } from '@/lib/use-theme'

const LINKS = [
  { href: '#modeles', label: 'Modèles' },
  { href: '#systeme', label: 'Le système' },
  { href: '#methode', label: 'Méthode' },
  { href: '#tarifs', label: 'Tarifs' },
]

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid size-7 place-items-center rounded-[0.5rem] bg-violet font-display',
        'text-[0.9rem] leading-none font-semibold text-on-violet',
        className,
      )}
      aria-hidden
    >
      F
    </span>
  )
}

export function Header({
  theme,
  onToggleTheme,
  onOpenStudio,
  compact,
}: {
  theme: Theme
  onToggleTheme: () => void
  onOpenStudio: () => void
  compact?: boolean
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-6 px-6">
        <a href="#/" className="flex items-center gap-2.5 font-display text-[1.0625rem] font-semibold">
          <Mark />
          Fabrique
        </a>

        {!compact && (
          <nav className="ml-4 hidden items-center gap-7 text-sm text-ink-soft md:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
            className="size-8 px-0"
          >
            {theme === 'dark' ? (
              <Sun className="size-4" aria-hidden />
            ) : (
              <Moon className="size-4" aria-hidden />
            )}
          </Button>
          {compact ? (
            <LinkButton href="#/" variant="outline" size="sm">
              Retour au site
            </LinkButton>
          ) : (
            <Button size="sm" onClick={onOpenStudio}>
              Ouvrir le Studio
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

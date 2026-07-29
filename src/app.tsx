import { useState } from 'react'
import { Header } from '@/components/site/header'
import { ClosingCta, Footer } from '@/components/site/footer'
import { Hero } from '@/components/site/hero'
import { Method } from '@/components/site/method'
import { Pricing } from '@/components/site/pricing'
import { Questions } from '@/components/site/questions'
import { System } from '@/components/site/system'
import { Templates } from '@/components/site/templates'
import { Studio } from '@/components/studio/studio'
import { DEFAULT_BRIEF } from '@/lib/briefs'
import { go, useHashRoute } from '@/lib/use-hash-route'
import { useTheme } from '@/lib/use-theme'

export function App() {
  const route = useHashRoute()
  const { theme, toggle } = useTheme()
  /* The brief written on the landing page is the one the Studio opens with. */
  const [prompt, setPrompt] = useState(DEFAULT_BRIEF)

  const openStudio = () => go('studio')

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        theme={theme}
        onToggleTheme={toggle}
        onOpenStudio={openStudio}
        compact={route === 'studio'}
      />

      {route === 'studio' ? (
        <main className="flex-1">
          <Studio prompt={prompt} />
        </main>
      ) : (
        <>
          <main className="flex-1">
            <Hero prompt={prompt} onPrompt={setPrompt} onOpenStudio={openStudio} />
            <Templates />
            <System />
            <Method />
            <Pricing onOpenStudio={openStudio} />
            <Questions />
            <ClosingCta onOpenStudio={openStudio} />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

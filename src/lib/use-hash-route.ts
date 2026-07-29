import { useEffect, useState } from 'react'

export type Route = 'accueil' | 'studio'

function read(): Route {
  return window.location.hash.startsWith('#/studio') ? 'studio' : 'accueil'
}

/**
 * Two views, no router dependency — the hash keeps the Studio linkable and
 * survives a refresh, which is all this app needs.
 */
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? 'accueil' : read(),
  )

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function go(route: Route) {
  window.location.hash = route === 'studio' ? '#/studio' : '#/'
  if (route === 'accueil') window.scrollTo({ top: 0, behavior: 'auto' })
}

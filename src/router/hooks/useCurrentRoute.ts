import { useMatches } from '@tanstack/react-router'
import { match, P } from 'ts-pattern'
import type { ProviderOrConsumer } from '@/types/common.types'

/** Returns the route informations of the current location */
export function useCurrentRoute() {
  const currentRoute = useMatches({ select: (m) => m[m.length - 1] })

  const mode = match(currentRoute.pathname)
    .returnType<ProviderOrConsumer | null>()
    .with(P.string.includes('erogazione'), () => 'provider')
    .with(P.string.includes('fruizione'), () => 'consumer')
    .otherwise(() => null)

  const { staticData, ...rest } = currentRoute

  return {
    mode,
    ...staticData,
    ...rest,
  }
}

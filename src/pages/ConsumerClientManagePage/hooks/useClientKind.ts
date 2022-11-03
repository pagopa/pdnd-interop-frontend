import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useCurrentRoute } from '@/router'
import { ClientKind } from '@/types/client.types'

export function useClientKind(): ClientKind {
  const { route } = useCurrentRoute()
  const currentLanguage = useCurrentLanguage()

  let clientKind: ClientKind | null = null

  const locationPath = route.PATH[currentLanguage]

  if (locationPath.includes('interop-m2m')) {
    clientKind = 'API'
  }

  if (locationPath.includes('client')) {
    clientKind = 'CONSUMER'
  }

  if (!clientKind) {
    throw new Error('useClientKind has been called outside client routes')
  }

  return clientKind
}

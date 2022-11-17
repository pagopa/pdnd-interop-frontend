import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useCurrentRoute } from '@/router'
import { ClientKind } from '@/types/client.types'

export function useClientKind(): ClientKind {
  const { route } = useCurrentRoute()
  const currentLanguage = useCurrentLanguage()

  const locationPath = route.PATH[currentLanguage]

  if (locationPath.includes('interop-m2m')) {
    return 'API'
  }

  if (locationPath.includes('client')) {
    return 'CONSUMER'
  }

  throw new Error('useClientKind has been called outside client routes')
}

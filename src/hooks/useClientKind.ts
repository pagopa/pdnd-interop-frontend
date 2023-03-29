import type { ClientKind } from '@/api/api.generatedTypes'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useCurrentRoute } from '@/router'

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

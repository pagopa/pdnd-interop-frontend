import type { ClientKind } from '@/api/api.generatedTypes'
import { useLocation } from 'react-router-dom'

export function useClientKind(): ClientKind {
  const { pathname } = useLocation()

  if (pathname.includes('interop-m2m')) {
    return 'API'
  }

  if (pathname.includes('client')) {
    return 'CONSUMER'
  }

  throw new Error('useClientKind has been called outside client routes')
}

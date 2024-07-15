import type { ProviderOrConsumer } from '@/types/common.types'
import memoize from 'lodash/memoize'

export const isProviderOrConsumerRoute = memoize((pathname: string): ProviderOrConsumer | null => {
  if (pathname.includes('erogazione')) {
    return 'provider'
  }

  if (pathname.includes('fruizione')) {
    return 'consumer'
  }

  return null
})

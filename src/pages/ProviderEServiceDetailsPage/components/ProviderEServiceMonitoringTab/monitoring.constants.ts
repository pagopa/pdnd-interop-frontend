import type { GetProducerEServiceMonitoringSaturationParams } from '@/api/api.generatedTypes'

/** Internal `?tab=` value of the classic provider e-service details page monitoring tab. */
export const PROVIDER_ESERVICE_MONITORING_TAB = 'monitoring'

/** Consumer preview: top five consumers by expected threshold consumption. */
export const MONITORING_CONSUMERS_PREVIEW_PARAMS = {
  offset: 0,
  limit: 5,
  sortBy: 'PERCENTAGE_DESC',
} as const satisfies Pick<
  GetProducerEServiceMonitoringSaturationParams,
  'offset' | 'limit' | 'sortBy'
>

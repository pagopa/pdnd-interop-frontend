import type { GetProducerEServiceMonitoringSaturationParams } from '../api.generatedTypes'

export const DEFAULT_ESERVICE_MONITORING_SATURATION_PARAMS = {
  offset: 0,
  limit: 5,
  sortBy: 'PERCENTAGE_DESC',
} as const satisfies Pick<
  GetProducerEServiceMonitoringSaturationParams,
  'offset' | 'limit' | 'sortBy'
>

export type GetProducerEServiceMonitoringSaturationRequest = Omit<
  GetProducerEServiceMonitoringSaturationParams,
  'offset' | 'limit' | 'sortBy'
> &
  Partial<Pick<GetProducerEServiceMonitoringSaturationParams, 'offset' | 'limit' | 'sortBy'>>

export function withDefaultEServiceMonitoringSaturationParams(
  params: GetProducerEServiceMonitoringSaturationRequest
): GetProducerEServiceMonitoringSaturationParams {
  return {
    ...params,
    offset: params.offset ?? DEFAULT_ESERVICE_MONITORING_SATURATION_PARAMS.offset,
    limit: params.limit ?? DEFAULT_ESERVICE_MONITORING_SATURATION_PARAMS.limit,
    sortBy: params.sortBy ?? DEFAULT_ESERVICE_MONITORING_SATURATION_PARAMS.sortBy,
  }
}

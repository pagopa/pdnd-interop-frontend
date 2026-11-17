import type { MUIColor } from '@/types/common.types'
import type {
  CompactEServiceLight,
  CompactOrganization,
  DateNameSortBy,
  PurposeVersionState,
} from '@/api/api.generatedTypes'
import type { RouteKey } from '@/router'

/** Entry point the page was opened from; it is encoded in the route itself so it survives refresh/sharing. */
export type ConsumerEServiceDetailOrigin = 'dashboard' | 'monitoring'

export const ROUTE_KEY_BY_ORIGIN = {
  dashboard: 'PROVIDE_DASHBOARD_CONSUMER_ESERVICE_DETAIL',
  monitoring: 'PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL',
} as const satisfies Record<ConsumerEServiceDetailOrigin, RouteKey>

export const PURPOSES_SORT_OPTIONS: DateNameSortBy[] = [
  'DATE_DESC',
  'DATE_ASC',
  'NAME_ASC',
  'NAME_DESC',
]
export const PURPOSES_DEFAULT_SORT: DateNameSortBy = 'DATE_DESC'

/** `includeArchived` is always false on this page, so ARCHIVED is not offered as a filter. */
export const PURPOSE_STATE_FILTER_OPTIONS: PurposeVersionState[] = [
  'ACTIVE',
  'WAITING_FOR_APPROVAL',
  'SUSPENDED',
  'REJECTED',
  'DRAFT',
]

/** Keep the same thresholds as the monitoring SaturationDonut. */
export function getPercentageChipColor(percentage: number): MUIColor {
  if (percentage >= 90) return 'error'
  if (percentage >= 70) return 'warning'
  return 'success'
}

/**
 * Builds the search params understood by the provider purposes list (interop-fe-commons
 * `useFilters` serializes `autocomplete-multiple` values as JSON `[[label, value]]`).
 */
export function buildWaitingPurposesListSearch({
  eservice,
  consumer,
  waitingForApprovalLabel,
}: {
  eservice: CompactEServiceLight
  consumer: CompactOrganization
  waitingForApprovalLabel: string
}): string {
  return new URLSearchParams({
    eservicesIds: JSON.stringify([[eservice.name, eservice.id]]),
    consumersIds: JSON.stringify([[consumer.name, consumer.id]]),
    states: JSON.stringify([[waitingForApprovalLabel, 'WAITING_FOR_APPROVAL']]),
  }).toString()
}

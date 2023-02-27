import type { AgreementState } from '@/types/agreement.types'
import type { BackendAttributes } from '@/types/attribute.types'
import type {
  EServiceDocumentKind,
  EServiceFlatten,
  EServiceState,
  EServiceTechnologyType,
} from '@/types/eservice.types'
import type { PaginationParams } from '../api.types'

/** @deprecated TO BE REMOVED */
export type EServiceGetListFlatUrlParams = {
  state?: EServiceState
  callerId: string | undefined
  producerId?: string
  consumerId?: string
  agreementStates?: Array<AgreementState>
}

/** @deprecated TO BE REMOVED */
export type EServiceGetListFlatResponse = Array<EServiceFlatten>

export type EServiceGetCatalogListQueryFilters = {
  /** Query to filter e-services by name */
  q?: string
  /** List of producers IDs */
  producersIds?: Array<string>
  /** List of e-service states */
  states?: Array<EServiceState>
}

export type EServiceGetCatalogListUrlParams = EServiceGetCatalogListQueryFilters & PaginationParams

export type EServiceGetProviderListQueryFilters = {
  /** Query to filter e-services by name */
  q?: string
  /** List of consumers IDs */
  consumersIds?: Array<string>
  /** Pagination offset, MAX 50 */
}

export type EServiceGetProviderListUrlParams = EServiceGetProviderListQueryFilters &
  PaginationParams

export type EServiceGetConsumersQueryFilters = {
  /** Query to filter consumers by name */
  q?: string
}

export type EServiceGetProducersQueryFilters = {
  /** Query to filter producers by name */
  q?: string
}

export type EServiceGetConsumersUrlParams = EServiceGetConsumersQueryFilters & PaginationParams
export type EServiceGetProducersUrlParams = EServiceGetProducersQueryFilters & PaginationParams

export type EServiceDraftPayload = {
  name?: string | undefined
  description?: string | undefined
  technology?: EServiceTechnologyType | undefined
  attributes: BackendAttributes
}

export type EServiceVersionDraftPayload = {
  audience: string[]
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: string
}

export type PostEServiceVersionDraftDocumentPayload = {
  kind: EServiceDocumentKind
  prettyName: string
  doc: File
}

export type UpdateEServiceVersionDraftDocumentPayload = {
  prettyName: string
}

import { AgreementState } from '@/types/agreement.types'
import { BackendAttributes } from '@/types/attribute.types'
import {
  EServiceDocumentKind,
  EServiceFlatten,
  EServiceState,
  EServiceTechnologyType,
} from '@/types/eservice.types'

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

export type EServiceGetCatalogListUrlParams = {
  /** Query to filter e-services by name */
  q?: string
  /** List of producers IDs */
  producerIds?: Array<string>
  /** List of e-service states */
  states?: Array<EServiceState>
  /** Pagination offset, MAX 50 */
  offset: number
  /** Pagination limit, MAX 50 */
  limit: number
}

export type EServiceGetProviderListUrlParams = {
  /** Query to filter e-services by name */
  q?: string
  /** List of consumers IDs */
  consumersIds?: Array<string>
  /** Pagination offset, MAX 50 */
  offset: number
  /** Pagination limit, MAX 50 */
  limit: number
}

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

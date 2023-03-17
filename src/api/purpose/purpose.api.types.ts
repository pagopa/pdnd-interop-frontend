import type { PaginationParams } from '@/api/api.types'
import type { PurposeRiskAnalysisForm, PurposeState } from '@/types/purpose.types'

export type PurposeGetListQueryFilters = {
  q?: string
  eservicesIds?: Array<string>
  consumersIds?: Array<string>
  producersIds?: Array<string>
  states?: Array<PurposeState>
}

export type PurposeGetListUrlParams = PurposeGetListQueryFilters & PaginationParams

export type PurposeCreateDraftPayload = {
  eserviceId: string
  consumerId: string
  riskAnalysisForm?: PurposeRiskAnalysisForm
  title: string
  description: string
}

export type PurposeUpdateDraftPayload = {
  riskAnalysisForm?: PurposeRiskAnalysisForm
  title: string
  description: string
}

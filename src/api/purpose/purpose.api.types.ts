import { PurposeRiskAnalysisForm, PurposeState } from '@/types/purpose.types'

export type PurposeGetAllUrlParams = {
  eserviceId?: string
  consumerId?: string
  states?: Array<PurposeState>
}

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

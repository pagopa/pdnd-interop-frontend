import { BackendAttributes } from '@/types/attribute.types'
import {
  EServiceDocumentKind,
  EServiceFlatten,
  EServiceState,
  EServiceTechnologyType,
} from '@/types/eservice.types'

export type EServiceGetListFlatUrlParams = {
  state?: EServiceState
  callerId: string | undefined
  producerId?: string
}

export type EServiceGetListFlatResponse = Array<EServiceFlatten>

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

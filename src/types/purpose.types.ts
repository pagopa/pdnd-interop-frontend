import type { AgreementSummary } from './agreement.types'
import type { Client } from './client.types'
import type { EServiceDescriptorRead, EServiceReadType } from './eservice.types'

export type PurposeState = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'WAITING_FOR_APPROVAL' | 'ARCHIVED'

export type PurposeRiskAnalysisForm = {
  version: string
  answers: { [id: string]: Array<string> }
}

type PurposeRiskAnalysisDocument = {
  contentType: string
  createdAt: string
  id: string
}
export type PurposeVersion = {
  id: string
  state: PurposeState
  dailyCalls: number
  riskAnalysis: PurposeRiskAnalysisDocument
  createdAt: string
  expectedApprovalDate?: string
  firstActivationAt?: string
}

export type PurposeListingItem = {
  id: string
  title: string
  consumer: {
    id: string
    name: string
  }
  eservice: {
    id: string
    name: string
    producer: {
      id: string
      name: string
    }
  }
  currentVersion?: {
    id: string
    state: PurposeState
    dailyCalls: number
  }
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
  waitingForApprovalVersion?: {
    id: string
    state: PurposeState
    dailyCalls: number
    expectedApprovalDate?: string
  }
}

export type Purpose = {
  consumer: {
    id: string
    name: string
  }
  id: string
  title: string
  description: string
  eservice: Pick<EServiceReadType, 'id' | 'name' | 'producer'> & {
    descriptor: Pick<
      EServiceDescriptorRead,
      // TEMP PIN-1194
      'id' | 'version' | 'state'
    > & { dailyCalls: number }
  }
  agreement: Pick<AgreementSummary, 'id' | 'state'>
  riskAnalysisForm: PurposeRiskAnalysisForm
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
  clients: Array<Pick<Client, 'id' | 'name'>>
  versions: Array<PurposeVersion>
}

// The frontend adds this, currentVersion and mostRecentVersion
// differ if mostRecentVersion's state is WAITING_FOR_APPROVAL
export type DecoratedPurpose = Purpose & {
  waitingForApprovalVersion: PurposeVersion | null
  currentVersion: PurposeVersion | null
}

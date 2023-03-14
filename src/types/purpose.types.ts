import type { AgreementSummary } from './agreement.types'
import type { Client } from './client.types'
import type { EServiceState } from './eservice.types'

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

export type PurposeVersion = {
  id: string
  state: PurposeState
  createdAt: string
  expectedApprovalDate?: string
  updatedAt?: string
  firstActivationAt?: string
  dailyCalls: number
  riskAnalysisDocument: PurposeRiskAnalysisDocument
}

export type Purpose = {
  id: string
  title: string
  description: string
  consumer: {
    id: string
    name: string
  }
  riskAnalysisForm: PurposeRiskAnalysisForm
  eservice: {
    id: string
    name: string
    producer: {
      id: string
      name: string
    }
    descriptor: {
      id: string
      version: string
      state: EServiceState
      audience: Array<string>
    }
  }
  agreement: Pick<AgreementSummary, 'id' | 'state'> & {
    canBeUpgraded: boolean
  }
  currentVersion?: PurposeVersion
  versions: Array<PurposeVersion>
  clients: Array<
    Pick<Client, 'id' | 'name'> & {
      hasKeys: boolean
    }
  >
  waitingForApprovalVersion?: PurposeVersion
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
}

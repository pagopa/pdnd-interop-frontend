import { AgreementState } from './agreement.types'
import { BackendAttribute, BackendAttributes } from './attribute.types'
import { DocumentRead } from './common.types'

type EServiceReadProducerType = {
  id: string
  name: string
}

export type EServiceTechnologyType = 'REST' | 'SOAP'
export type EServiceState = 'PUBLISHED' | 'DRAFT' | 'SUSPENDED' | 'ARCHIVED' | 'DEPRECATED'

export type EServiceDocumentKind = 'INTERFACE' | 'DOCUMENT'

export type EServiceReadType = {
  id: string
  producer: EServiceReadProducerType
  name: string
  description: string
  technology: EServiceTechnologyType
  attributes: BackendAttributes
  descriptors: Array<EServiceDescriptorRead>
  state?: EServiceState
  viewingDescriptor?: EServiceDescriptorRead // TEMP REFACTOR : this is added by the client
}

/** @deprecated TO BE REMOVED */
export type EServiceFlatten = {
  name: string
  description: string
  id: string
  producerId: string
  producerName: string
  descriptorId?: string
  state?: EServiceState
  version?: string
  agreement?: {
    id: string
    state: AgreementState
  }
  certifiedAttributes: Array<BackendAttribute>
}

export type EServiceCatalog = {
  id: string
  name: string
  description: string
  producer: {
    id: string
    name: string
  }
  agreement: {
    id: string
    state: AgreementState
  }
  isMine: true
  canSubscribe: true
  activeDescriptor: {
    id: string
    state: EServiceState
    version: string
  }
}

export type EServiceDescriptorRead = {
  id: string
  state: EServiceState
  docs: Array<DocumentRead>
  interface?: DocumentRead
  version: string
  voucherLifespan: number
  description: string
  audience: Array<string>
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: 'MANUAL' | 'AUTOMATIC'
}

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

/** @deprecated TO BE REMOVED */
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

export type EServiceRead = {
  id: string
  name: string
  description: string
  technology: EServiceTechnologyType
  attributes: BackendAttributes
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
  isMine: boolean
  hasCertifiedAttributes: boolean
  activeDescriptor: {
    id: string
    state: EServiceState
    version: string
  }
}

export type EServiceProvider = {
  id: string
  name: string
  activeDescriptor?: {
    id: string
    state: EServiceState
    version: string
  }
  draftDescriptor?: {
    id: string
    state: EServiceState
    version: string
  }
}

export type EServiceDescriptorCatalog = {
  id: string
  version: string
  description?: string
  interface?: DocumentRead
  docs: Array<DocumentRead>
  state: EServiceState
  audience: Array<string>
  voucherLifespan: number
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: 'MANUAL' | 'AUTOMATIC'
  eservice: {
    id: string
    name: string
    description: string
    technology: EServiceTechnologyType
    attributes: BackendAttributes
    descriptors: Array<{
      id: string
      state: EServiceState
      version: string
    }>
    agreement: {
      id: string
      state: AgreementState
    }
    isMine: boolean
    hasCertifiedAttributes: boolean
    isSubscribed: boolean
    activeDescriptor?: {
      id: string
      state: EServiceState
      version: string
    }
    mail?: {
      address: string
      description: string
    }
  }
}

export type EServiceDescriptorProvider = {
  id: string
  version: string
  description?: string
  interface?: DocumentRead
  docs: Array<DocumentRead>
  state: EServiceState
  audience: Array<string>
  voucherLifespan: number
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: 'MANUAL' | 'AUTOMATIC'
  eservice: {
    id: string
    name: string
    description: string
    technology: EServiceTechnologyType
    attributes: BackendAttributes
    descriptors: Array<{
      id: string
      state: EServiceState
      version: string
    }>
    draftDescriptor?: {
      id: string
      state: EServiceState
      version: string
    }
    mail?: {
      address: string
      description: string
    }
  }
}

/** @deprecated TO BE REMOVED */
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

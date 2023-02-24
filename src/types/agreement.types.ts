import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from './attribute.types'
import type { DocumentRead } from './common.types'
import type { EServiceState } from './eservice.types'

export type AgreementState =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'PENDING'
  | 'ARCHIVED'
  | 'DRAFT'
  | 'REJECTED'
  | 'MISSING_CERTIFIED_ATTRIBUTES'

type AgreementProducer = {
  name: string
  id: string
}
type AgreementConsumer = {
  name: string
  selfcareId?: string
  externalId: { origin: string; value: string }
  createdAt: string
  updatedAt?: string
  id: string
  attributes: {
    certified: Array<CertifiedTenantAttribute>
    verified: Array<VerifiedTenantAttribute>
    declared: Array<DeclaredTenantAttribute>
  }
  contactMail: {
    address: string
    description?: string
  }
}

type AgreementEService = {
  id: string
  name: string
  version: string
  activeDescriptor?: {
    id: string
    state: EServiceState
    version: string
  }
}

export type AgreementAttribute = {
  id: string
  description: string
  name: string
  creationTime: string
}

export type AgreementListingItem = {
  id: string
  state: AgreementState
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
  descriptor: {
    id: string
    state: EServiceState
    version: string
  }
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
  suspendedByPlatform?: boolean
  canBeUpgraded: boolean
}

export type AgreementSummary = {
  id: string
  descriptorId: string
  consumer: AgreementConsumer
  producer: AgreementProducer
  state: AgreementState
  eservice: AgreementEService
  verifiedAttributes: Array<AgreementAttribute>
  certifiedAttributes: Array<AgreementAttribute>
  declaredAttributes: Array<AgreementAttribute>
  suspendedByProducer?: boolean
  suspendedByConsumer?: boolean
  suspendedByPlatform?: boolean
  consumerNotes?: string
  consumerDocuments: Array<DocumentRead & { createdAt: string }>
  createdAt: string
  updatedAt?: string
  rejectionReason?: string
  isContractPresent: boolean
}

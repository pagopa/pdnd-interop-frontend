import { AgreementListingItem, AgreementSummary } from '../../src/types/agreement.types'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockAgreementSummary = createMockFactory<AgreementSummary>({
  id: '',
  state: 'ACTIVE',
  eservice: {
    name: '',
    id: '',
    descriptorId: '',
    version: '',
    state: 'SUSPENDED',
    activeDescriptor: undefined,
  },
  descriptorId: '',
  consumer: {
    name: '',
    id: '',
    attributes: [],
  },
  producer: {
    name: '',
    id: '',
  },
  verifiedAttributes: [],
  certifiedAttributes: [],
  declaredAttributes: [],
  consumerDocuments: [],
  createdAt: '',
})

const createMockAgreementListingItem = createMockFactory<AgreementListingItem>({
  id: '',
  state: 'ACTIVE',
  consumer: {
    id: '',
    name: '',
  },
  eservice: {
    id: '',
    name: '',
    producer: {
      id: '',
      name: '',
    },
  },
  descriptor: {
    version: 0,
  },
  suspendedByConsumer: false,
  suspendedByProducer: false,
  suspendedByPlatform: false,
  canBeUpgraded: false,
})

export { createMockAgreementListingItem, createMockAgreementSummary }

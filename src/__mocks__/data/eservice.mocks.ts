import {
  EServiceCatalog,
  EServiceDescriptorCatalog,
  EServiceProvider,
  EServiceRead,
} from '../../types/eservice.types'
import { createMockFactory } from '../mock.utils'

const createMockEServiceRead = createMockFactory<EServiceRead>({
  id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
  name: '-- CAMMELLO --',
  description: 'Lore ipsum',
  technology: 'REST',
  attributes: {
    certified: [],
    verified: [],
    declared: [],
  },
})

const createMockEServiceProvider = createMockFactory<EServiceProvider>({
  id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
  name: '-- CAMMELLO --',
})

const createMockEServiceCatalog = createMockFactory<EServiceCatalog>({
  activeDescriptor: {
    id: 'e9762e42-129a-4b07-9b2e-9614998ef9b8',
    state: 'PUBLISHED',
    version: '1',
  },
  name: '!! -- CAMMELLO -- Test 18/10 [1]',
  description: 'lorem ipsum',
  hasCertifiedAttributes: true,
  id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
  isMine: false,
  producer: {
    id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
    name: "Agenzia per L'Italia Digitale",
  },
})

const createMockEServiceDescriptorCatalog = createMockFactory<EServiceDescriptorCatalog>({
  agreementApprovalPolicy: 'MANUAL',
  audience: ['Lorem'],
  dailyCallsPerConsumer: 1,
  dailyCallsTotal: 1,
  description: 'Lorem',
  docs: [],
  eservice: {
    activeDescriptor: {
      id: 'ec94e366-cbb2-4203-ac07-95acf5289a31',
      state: 'PUBLISHED',
      version: '1',
    },
    attributes: {
      certified: [],
      declared: [],
      verified: [],
    },
    description: 'lorem',
    descriptors: [{ id: 'ec94e366-cbb2-4203-ac07-95acf5289a31', state: 'PUBLISHED', version: '1' }],
    hasCertifiedAttributes: false,
    id: '03d0c725-47e5-4ec5-8ecd-1a1f3ce45d29',
    isMine: false,
    isSubscribed: false,
    name: '!! -- CAMMELLO -- Test 18/10 [1] - clone',
    technology: 'REST',
  },
  id: 'ec94e366-cbb2-4203-ac07-95acf5289a31',
  interface: {
    contentType: 'application/octet-stream',
    id: '4cd1ef19-77b7-468f-8693-c6cebac12912',
    name: 'example_open_api.yml',
    prettyName: 'Specifica API',
  },
  state: 'PUBLISHED',
  version: '1',
  voucherLifespan: 60,
})

export {
  createMockEServiceProvider,
  createMockEServiceCatalog,
  createMockEServiceRead,
  createMockEServiceDescriptorCatalog,
}

import type {
  CatalogEService,
  CatalogEServiceDescriptor,
  ProducerEService,
  ProducerEServiceDescriptor,
  ProducerEServiceDetails,
} from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockEServiceRead = createMockFactory<ProducerEServiceDetails>({
  id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
  name: '-- CAMMELLO --',
  description: 'Lore ipsum',
  technology: 'REST',
  mode: 'DELIVER',
  riskAnalysis: [],
})

const createMockEServiceProvider = createMockFactory<ProducerEService>({
  id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
  name: '-- CAMMELLO --',
  mode: 'DELIVER',
})

const createMockEServiceCatalog = createMockFactory<CatalogEService>({
  activeDescriptor: {
    id: 'e9762e42-129a-4b07-9b2e-9614998ef9b8',
    state: 'PUBLISHED',
    version: '1',
    audience: [],
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

const createMockEServiceDescriptorCatalog = createMockFactory<CatalogEServiceDescriptor>({
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
      audience: [],
    },
    producer: {
      id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
      name: '-- CAMMELLO --',
    },
    description: 'lorem',
    descriptors: [
      {
        id: 'ec94e366-cbb2-4203-ac07-95acf5289a31',
        state: 'PUBLISHED',
        version: '1',
        audience: [],
      },
    ],
    hasCertifiedAttributes: false,
    id: '03d0c725-47e5-4ec5-8ecd-1a1f3ce45d29',
    isMine: false,
    isSubscribed: false,
    name: '!! -- CAMMELLO -- Test 18/10 [1] - clone',
    technology: 'REST',
    mode: 'DELIVER',
    riskAnalysis: [],
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
  attributes: {
    certified: [],
    declared: [],
    verified: [],
  },
})

const createMockEServiceDescriptorProvider = createMockFactory<ProducerEServiceDescriptor>({
  agreementApprovalPolicy: 'MANUAL',
  audience: ['nikon'],
  dailyCallsPerConsumer: 1,
  dailyCallsTotal: 1,
  description: 'kinoin',
  docs: [],
  eservice: {
    description: 'Lorem ipsum',
    descriptors: [
      {
        id: '2092c1ef-9127-4dd5-ad81-c9ecf492975a',
        state: 'PUBLISHED',
        version: '1',
        audience: [],
      },
    ],
    id: '4edda5fd-2fed-485c-9ab4-bc7d78a67624',
    name: '-- LUMACA -- test 20/10 [4]\t',
    technology: 'REST',
    mode: 'DELIVER',
    riskAnalysis: [],
  },
  id: '2092c1ef-9127-4dd5-ad81-c9ecf492975a',
  interface: {
    contentType: 'application/octet-stream',
    id: '7b92cd7e-c485-4660-9344-608242ba0786',
    name: 'VerificaCodiceFiscale.yaml',
    prettyName: 'Specifica API',
  },
  state: 'PUBLISHED',
  version: '3',
  voucherLifespan: 60,
  attributes: {
    certified: [],
    declared: [],
    verified: [],
  },
})

export {
  createMockEServiceProvider,
  createMockEServiceCatalog,
  createMockEServiceRead,
  createMockEServiceDescriptorCatalog,
  createMockEServiceDescriptorProvider,
}

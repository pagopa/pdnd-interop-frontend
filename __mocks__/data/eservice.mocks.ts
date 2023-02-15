import {
  EServiceCatalog,
  EServiceDescriptorCatalog,
  EServiceDescriptorProvider,
  EServiceProvider,
  EServiceRead,
  EServiceReadType,
} from '../../src/types/eservice.types'
import { createMockFactory } from '../../src/utils/testing.utils'

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

const createMockEServiceReadType = createMockFactory<EServiceReadType>({
  attributes: {
    certified: [],
    declared: [],
    verified: [],
  },
  description: 'lorem ipsum',
  descriptors: [
    {
      agreementApprovalPolicy: 'MANUAL',
      audience: ['lorem'],
      dailyCallsPerConsumer: 1,
      dailyCallsTotal: 1,
      description: 'lorem ipsum',
      docs: [],
      id: 'fd09a069-81f8-4cb5-a302-64320e83a033',
      interface: {
        contentType: 'application/octet-stream',
        id: 'd6d38b0a-ce0a-4960-a498-289c35717bb1',
        name: 'example_open_api.yml',
        prettyName: 'Specifica API',
      },
      state: 'DRAFT',
      version: '1',
      voucherLifespan: 60,
    },
  ],
  id: '6dbb7416-8315-4970-a6be-393a03d0a79d',
  name: 'Test 3 - clone',
  producer: {
    id: '6b16be70-9230-4209-bd1f-7e5ae0eed289',
    name: '',
  },
  technology: 'REST',
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

const createMockEServiceDescriptorProvider = createMockFactory<EServiceDescriptorProvider>({
  agreementApprovalPolicy: 'MANUAL',
  audience: ['nikon'],
  dailyCallsPerConsumer: 1,
  dailyCallsTotal: 1,
  description: 'kinoin',
  docs: [],
  eservice: {
    attributes: {
      certified: [],
      declared: [],
      verified: [],
    },
    description: 'Lorem ipsum',
    descriptors: [{ id: '2092c1ef-9127-4dd5-ad81-c9ecf492975a', state: 'PUBLISHED', version: '1' }],
    id: '4edda5fd-2fed-485c-9ab4-bc7d78a67624',
    name: '-- LUMACA -- test 20/10 [4]\t',
    technology: 'REST',
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
})

export {
  createMockEServiceProvider,
  createMockEServiceCatalog,
  createMockEServiceRead,
  createMockEServiceReadType,
  createMockEServiceDescriptorCatalog,
  createMockEServiceDescriptorProvider,
}

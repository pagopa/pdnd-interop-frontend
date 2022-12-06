import { EServiceCatalog, EServiceProvider, EServiceRead } from '../../types/eservice.types'
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

export { createMockEServiceProvider, createMockEServiceCatalog, createMockEServiceRead }

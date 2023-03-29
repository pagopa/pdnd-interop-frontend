import type { Client } from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockClient = createMockFactory<Client>({
  id: '85ceaa96-a95e-4cf9-b1f9-b85be1e09369',
  name: 'test - 24/02/23',
  consumer: {
    id: 'consumer-id',
    name: 'PagoPa',
  },
  description: 'test test test',
  kind: 'CONSUMER',
  purposes: [],
})

export { createMockClient }

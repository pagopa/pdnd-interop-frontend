import type { Client } from '../../src/types/client.types'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockClient = createMockFactory<Client>({
  id: '85ceaa96-a95e-4cf9-b1f9-b85be1e09369',
  name: 'test - 24/02/23',
  description: 'test test test',
  operators: [],
  kind: 'CONSUMER',
  purposes: [],
  consumer: { description: "Agenzia per L'Italia Digitale", institutionId: 'agid' },
})

export { createMockClient }

import type { CompactTenant } from '../../src/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockCompactTenant = createMockFactory<CompactTenant>({
  id: 'tenant id',
  name: 'tenant name',
})

export { createMockCompactTenant }

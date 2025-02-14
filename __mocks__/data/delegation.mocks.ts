import { createMockFactory } from '../../src/utils/testing.utils'
import type { DelegationWithCompactTenants } from '../../src/api/api.generatedTypes'

const createMockDelegationWithCompactTenants = createMockFactory<DelegationWithCompactTenants>({
  id: 'delegation-id',
  delegator: {
    id: 'delegator-id',
    name: 'delegator-name',
    kind: 'PA',
    contactMail: { address: 'test-email', description: 'test' },
  },
  delegate: {
    id: 'delegate-id',
    name: 'delegate-name',
    kind: 'PA',
    contactMail: { address: 'test-email', description: 'test' },
  },
})

export { createMockDelegationWithCompactTenants }

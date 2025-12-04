import { createMockFactory } from '../../src/utils/testing.utils'
import type { Delegation, DelegationWithCompactTenants } from '../../src/api/api.generatedTypes'

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

const createMockDelegation = createMockFactory<Delegation>({
  id: 'delegation-id',
  isDocumentReady: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  delegator: {
    id: 'delegator-id',
    name: 'delegator-name',
  },
  delegate: {
    id: 'delegate-id',
    name: 'delegate-name',
  },
  state: 'ACTIVE',
  kind: 'DELEGATED_PRODUCER',
})

export { createMockDelegationWithCompactTenants, createMockDelegation }

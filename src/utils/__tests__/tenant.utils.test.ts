import { TenantFeature } from '@/api/api.generatedTypes'
import { hasTenantGivenProducerDelegationAvailability, isTenantCertifier } from '../tenant.utils'

const mockTenant = {
  id: 'test-id',
  name: 'test-name',
  externalId: { origin: 'test-origin', value: 'test-value' },
  features: [
    {
      certifier: { certifierId: 'test-certifierId' },
      delegatedProducer: { availabilityTimestamp: 'test-timestamp' },
    },
  ],
  createdAt: 'test-createdAt',
  attributes: { declared: [], verified: [], certified: [] },
}

describe('isTenantCertifier utility function testing', () => {
  it('should correctly verify if tenant is certifier', () => {
    const result = isTenantCertifier(mockTenant)
    expect(result).toBe(true)
  })
})

describe('hasTenantGivenProducerDelegationAvailability utility function testing', () => {
  it('should correctly verify if tenant has given the producer delegations availability', () => {
    const result = hasTenantGivenProducerDelegationAvailability(mockTenant)
    expect(result).toEqual('test-timestamp')
  })
})

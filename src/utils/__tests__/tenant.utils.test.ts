import {
  formatTenantHierarchy,
  hasTenantGivenConsumerDelegationAvailability,
  hasTenantGivenProducerDelegationAvailability,
  isTenantCertifier,
} from '../tenant.utils'

const mockTenant = {
  id: 'test-id',
  name: 'test-name',
  externalId: { origin: 'test-origin', value: 'test-value' },
  features: [
    {
      certifier: { certifierId: 'test-certifierId' },
      delegatedProducer: { availabilityTimestamp: 'test-timestamp' },
      delegatedConsumer: { availabilityTimestamp: 'test-timestamp' },
    },
  ],
  createdAt: 'test-createdAt',
  attributes: { declared: [], verified: [], certified: [], certifiedDiscrete: [] },
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
    expect(result).toBe(true)
  })
})

describe('hasTenantGivenProducerDelegationAvailability utility function testing', () => {
  it('should correctly verify if tenant has given the producer delegations availability', () => {
    const result = hasTenantGivenConsumerDelegationAvailability(mockTenant)
    expect(result).toBe(true)
  })
})

describe('formatTenantHierarchy utility function testing', () => {
  it('returns the tenant name when parent tenants are undefined', () => {
    expect(formatTenantHierarchy('Tenant')).toBe('Tenant')
  })

  it('returns the tenant name when there are no parent tenants', () => {
    expect(formatTenantHierarchy('Tenant', [])).toBe('Tenant')
  })

  it('joins the tenant name and parent names in order', () => {
    expect(
      formatTenantHierarchy('Tenant-UO', [
        { id: 'parent-AOO', name: 'Parent AOO', subUnitType: 'AOO' },
        { id: 'parent root', name: 'Parent root' },
      ])
    ).toBe('Tenant-UO - Parent AOO - Parent root')
  })
})

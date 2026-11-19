import {
  formatTenantHierarchy,
  getTenantPageTitle,
  getTenantPageDescription,
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

describe('Party registry page title and description', () => {
  it('UO case: title includes UO and AOO, description shows root', () => {
    const tenant = { ...mockTenant, name: 'Ufficio Permessi ZTL', subUnitType: 'UO' as const }
    const parentTenants = [
      { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' as const },
      { id: 'comune-id', name: 'Comune di Milano' },
    ]
    expect(getTenantPageTitle(tenant, parentTenants)).toBe(
      'Ufficio Permessi ZTL - Direzione Mobilità'
    )
    expect(getTenantPageDescription(parentTenants)).toBe('Comune di Milano')
  })

  it('AOO case: title is AOO only, description shows root', () => {
    const tenant = { ...mockTenant, name: 'Direzione Mobilità', subUnitType: 'AOO' as const }
    const parentTenants = [{ id: 'comune-id', name: 'Comune di Milano' }]
    expect(getTenantPageTitle(tenant, parentTenants)).toBe('Direzione Mobilità')
    expect(getTenantPageDescription(parentTenants)).toBe('Comune di Milano')
  })

  it('Root case: title is tenant name, description is empty', () => {
    const tenant = { ...mockTenant, name: 'Comune di Milano', subUnitType: undefined }
    expect(getTenantPageTitle(tenant)).toBe('Comune di Milano')
    expect(getTenantPageDescription()).toBe('')
  })
})

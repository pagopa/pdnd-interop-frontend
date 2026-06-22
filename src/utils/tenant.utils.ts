import type { Tenant, TenantFeature, TenantKind, TargetTenantKind } from '@/api/api.generatedTypes'

export function isTenantCertifier(tenant: Tenant) {
  return tenant.features.some((feature) => 'certifier' in feature && feature.certifier?.certifierId)
}

export function hasTenantGivenProducerDelegationAvailability(tenant: Tenant) {
  return Boolean(
    tenant.features.find(
      (feature): feature is Extract<TenantFeature, { delegatedProducer?: unknown }> =>
        Boolean('delegatedProducer' in feature && feature.delegatedProducer?.availabilityTimestamp)
    )?.delegatedProducer?.availabilityTimestamp
  )
}

export function hasTenantGivenConsumerDelegationAvailability(tenant: Tenant) {
  return Boolean(
    tenant.features.find(
      (feature): feature is Extract<TenantFeature, { delegatedConsumer?: unknown }> =>
        Boolean('delegatedConsumer' in feature && feature.delegatedConsumer?.availabilityTimestamp)
    )?.delegatedConsumer?.availabilityTimestamp
  )
}

export function tenantKindForPurposeTemplate(tenantKind: TenantKind): TargetTenantKind {
  // normalize tenant kind for purpose templates: map all non-PA kinds to PRIVATE because RA for scp/gsp/private are the same
  if (tenantKind !== 'PA') {
    return 'PRIVATE'
  }
  return tenantKind
}

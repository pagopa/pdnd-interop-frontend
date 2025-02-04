import type { Tenant, TenantFeature } from '@/api/api.generatedTypes'

export function isTenantCertifier(tenant: Tenant) {
  return tenant.features.some((feature) => 'certifier' in feature && feature.certifier?.certifierId)
}

export function hasTenantGivenProducerDelegationAvailability(tenant: Tenant) {
  return tenant.features.find(
    (feature): feature is Extract<TenantFeature, { delegatedProducer?: unknown }> =>
      Boolean('delegatedProducer' in feature && feature.delegatedProducer?.availabilityTimestamp)
  )?.delegatedProducer?.availabilityTimestamp
}

export function hasTenantGivenConsumerDelegationAvailability(tenant: Tenant) {
  return tenant.features.find(
    (feature): feature is Extract<TenantFeature, { delegatedConsumer?: unknown }> =>
      Boolean('delegatedConsumer' in feature && feature.delegatedConsumer?.availabilityTimestamp)
  )?.delegatedConsumer?.availabilityTimestamp
}

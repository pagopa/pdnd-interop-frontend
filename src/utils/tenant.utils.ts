import type { Tenant } from '@/api/api.generatedTypes'

export function isCertifier(tenant: Tenant) {
  return Boolean(tenant.features[0]?.certifier?.certifierId)
}

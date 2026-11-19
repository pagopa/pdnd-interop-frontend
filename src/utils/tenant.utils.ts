import type {
  Tenant,
  TenantFeature,
  TenantKind,
  TargetTenantKind,
  ParentTenant,
} from '@/api/api.generatedTypes'

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

export function formatTenantHierarchy(tenantName: string, parentTenants?: ParentTenant[]): string {
  return [tenantName, ...(parentTenants?.map((parent) => parent.name) ?? [])].join(' - ')
}

export function getTenantPageTitle(tenant: Tenant, parentTenants?: ParentTenant[]): string {
  /* Case root: title is the tenant name only */
  if (!tenant.subUnitType) {
    return tenant.name
  }

  /* Case UO: include the first parent tenant in the title */
  if (tenant.subUnitType === 'UO' && parentTenants?.length) {
    return `${tenant.name} - ${parentTenants[0]?.name ?? ''}`
  }

  /* Case AOO: title is the tenant name only */
  return tenant.name
}

export function getTenantPageDescription(parentTenants?: ParentTenant[]): string {
  /* Case root: description shows the root tenant name */
  if (!parentTenants || parentTenants.length === 0) {
    return ''
  }

  /* Case UO - AOO: find the root tenant in the parent tenants */
  const root = parentTenants.find((parent) => !parent.subUnitType)
  return root?.name ?? ''
}

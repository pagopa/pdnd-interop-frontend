import type {
  Tenant,
  TenantFeature,
  TenantKind,
  TargetTenantKind,
  ParentTenant,
  TenantUnitType,
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

export function formatHierarchyWithoutParentRoot(
  tenant: {
    name: string
    subUnitType?: TenantUnitType
  },
  parentTenants?: ParentTenant[]
): string {
  /* Case root: gets the tenant name only */
  if (!tenant.subUnitType) {
    return tenant.name
  }

  /* Case UO: include the first parent tenant in the title */
  if (tenant.subUnitType === 'UO' && parentTenants?.length) {
    return [tenant.name, parentTenants[0]?.name].filter(Boolean).join(' - ')
  }

  /* Case AOO: gets the tenant name only */
  return tenant.name
}

export function getRootTenantFromHierarchy(parentTenants?: ParentTenant[]): string | undefined {
  return parentTenants?.find((parent) => !parent.subUnitType)?.name
}

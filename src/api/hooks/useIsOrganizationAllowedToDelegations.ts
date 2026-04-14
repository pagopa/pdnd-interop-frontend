import { FEATURE_FLAG_DELEGATION_CONSTRAINT_SKIP } from '@/config/env'
import { useQuery } from '@tanstack/react-query'
import { TenantQueries } from '../tenant'

export const useIsOrganizationAllowedToDelegations = (tenantId: string) => {
  const { data, isLoading } = useQuery({
    ...TenantQueries.getIsTenantAllowedToDelegation(tenantId),
    enabled: !FEATURE_FLAG_DELEGATION_CONSTRAINT_SKIP,
  })

  if (FEATURE_FLAG_DELEGATION_CONSTRAINT_SKIP) {
    return { isAllowed: true, isLoading: false }
  }

  const isAllowed = data?.isAllowed ?? false

  return { isAllowed, isLoading }
}

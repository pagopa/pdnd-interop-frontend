import { FEATURE_FLAG_DELEGATION_CONSTRAINT_SKIP } from '@/config/env'
import { useQuery } from '@tanstack/react-query'
import { TenantQueries } from '../tenant'

export const useIsOrganizationAllowedToDelegations = (
  tenantId: string,
  shouldCheckDelegationsPermission?: boolean
) => {
  const { data, isLoading, isError } = useQuery({
    ...TenantQueries.getIsTenantAllowedToDelegation(tenantId),
    enabled: !FEATURE_FLAG_DELEGATION_CONSTRAINT_SKIP && shouldCheckDelegationsPermission !== false,
    retry: false,
    throwOnError: false,
  })

  if (FEATURE_FLAG_DELEGATION_CONSTRAINT_SKIP) {
    return { isAllowed: true, isLoading: false }
  }

  if (isError) {
    return { isAllowed: false, isLoading: false }
  }

  return { isAllowed: data?.isAllowed ?? false, isLoading }
}

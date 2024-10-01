import { useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '../auth'
import { TenantQueries } from './tenant.queries'

function useGetActiveUserParty() {
  const { jwt } = AuthHooks.useJwt()
  return useSuspenseQuery(TenantQueries.getParty(jwt?.organizationId as string))
}

export const TenantHooks = {
  useGetActiveUserParty,
}

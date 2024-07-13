import { getPartyQueryOptions } from '@/api/party'
import { UnauthorizedError } from '@/utils/errors.utils'
import { isCertifier } from '@/utils/tenant.utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes/aderente/certificatore/_certificator-guard'
)({
  staticData: {
    routeKey: 'CERTIFICATOR_GUARD',
    authLevels: ['admin'],
  },
  loader: async ({ context: { queryClient, auth } }) => {
    const currentUser = await queryClient.ensureQueryData(
      getPartyQueryOptions(auth.user?.organizationId)
    )
    if (!isCertifier(currentUser)) {
      throw new UnauthorizedError()
    }
  },
})

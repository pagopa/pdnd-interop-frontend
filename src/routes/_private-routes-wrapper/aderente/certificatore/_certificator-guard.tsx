import { jwtQueryOptions } from '@/api/auth'
import { getPartyQueryOptions } from '@/api/party'
import { AuthenticationError, UnauthorizedError } from '@/utils/errors.utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes-wrapper/aderente/certificatore/_certificator-guard'
)({
  staticData: {
    routeKey: 'CERTIFICATOR_GUARD',
    authLevels: ['admin'],
  },
  loader: async ({ context: { queryClient } }) => {
    const { jwt } = await queryClient.ensureQueryData(jwtQueryOptions())
    if (!jwt) {
      throw new AuthenticationError()
    }
    const currentUser = await queryClient.ensureQueryData(getPartyQueryOptions(jwt.organizationId))
    const isCertifier = Boolean(currentUser.features[0]?.certifier?.certifierId)
    if (!isCertifier) {
      throw new UnauthorizedError()
    }
  },
})

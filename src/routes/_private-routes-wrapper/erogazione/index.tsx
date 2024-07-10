import { jwtQueryOptions } from '@/api/auth'
import { UnauthorizedError } from '@/utils/errors.utils'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/erogazione/')({
  staticData: {
    authLevels: ['admin', 'support', 'security', 'api'],
    routeKey: 'PROVIDE',
  },
  loader: async ({ context: { queryClient } }) => {
    const { isSupport, isOrganizationAllowedToProduce } =
      await queryClient.ensureQueryData(jwtQueryOptions())

    if (!isSupport && !isOrganizationAllowedToProduce) {
      throw new UnauthorizedError()
    }

    throw redirect({ to: '/fruizione/catalogo-e-service' })
  },
})

import { UnauthorizedError } from '@/utils/errors.utils'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes/erogazione/')({
  staticData: {
    authLevels: ['admin', 'support', 'security', 'api'],
    routeKey: 'PROVIDE',
  },
  beforeLoad: ({
    context: {
      auth: { user },
    },
  }) => {
    if (!user?.isSupport && !user?.isOrganizationAllowedToProduce) {
      throw new UnauthorizedError()
    }

    throw redirect({ to: '/erogazione/e-service' })
  },
})

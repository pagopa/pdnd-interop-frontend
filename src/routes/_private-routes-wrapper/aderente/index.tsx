import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/aderente/')({
  staticData: {
    authLevels: ['admin', 'support', 'api', 'security'],
    routeKey: 'TENANT',
  },
  beforeLoad: () => {
    throw redirect({ to: '/fruizione/catalogo-e-service' })
  },
})

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/fruizione/')({
  staticData: {
    authLevels: ['admin', 'support', 'security', 'api'],
    routeKey: 'SUBSCRIBE',
  },
  beforeLoad: () => {
    throw redirect({ to: '/fruizione/catalogo-e-service' })
  },
})

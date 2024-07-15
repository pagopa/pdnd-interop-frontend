import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  staticData: {
    authLevels: ['admin', 'support', 'security', 'api'],
    routeKey: 'INDEX',
  },
  beforeLoad: () => {
    throw redirect({ to: '/fruizione/catalogo-e-service' })
  },
})

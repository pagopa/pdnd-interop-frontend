import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/'
)({
  staticData: {
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security', 'api'],
  },
  beforeLoad: () => {
    throw redirect({ to: '/fruizione/catalogo-e-service' })
  },
})

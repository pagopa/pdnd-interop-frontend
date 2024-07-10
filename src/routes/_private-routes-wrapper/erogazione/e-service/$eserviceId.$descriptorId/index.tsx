import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes-wrapper/erogazione/e-service/$eserviceId/$descriptorId/'
)({
  staticData: {
    routeKey: 'PROVIDE_ESERVICE_MANAGE',
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api'],
  },
  component: () => (
    <div>Hello /_private-routes-wrapper/erogazione/e-service/$eserviceId/$descriptorId/!</div>
  ),
})

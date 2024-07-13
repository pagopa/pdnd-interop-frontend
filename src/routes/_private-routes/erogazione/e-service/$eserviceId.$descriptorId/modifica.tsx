import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes/erogazione/e-service/$eserviceId/$descriptorId/modifica'
)({
  staticData: {
    routeKey: 'PROVIDE_ESERVICE_EDIT',
    hideSideNav: true,
    authLevels: ['admin', 'api'],
  },
  component: () => (
    <div>
      Hello /_private-routes-wrapper/erogazione/e-service/$eserviceId/$descriptorId/modifica!
    </div>
  ),
})

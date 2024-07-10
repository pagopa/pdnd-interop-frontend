import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes-wrapper/erogazione/e-service/$eserviceId/$descriptorId/modifica/riepilogo'
)({
  staticData: {
    routeKey: 'PROVIDE_ESERVICE_SUMMARY',
    hideSideNav: true,
    authLevels: ['admin', 'api'],
  },
  component: () => (
    <div>
      Hello
      /_private-routes-wrapper/erogazione/e-service/$eserviceId/$descriptorId/modifica/riepilogo!
    </div>
  ),
})

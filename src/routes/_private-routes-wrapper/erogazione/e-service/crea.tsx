import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/erogazione/e-service/crea')({
  component: () => <div>Hello /_private-routes-wrapper/erogazione/e-service/crea!</div>,
  staticData: {
    routeKey: 'PROVIDE_ESERVICE_CREATE',
    authLevels: ['admin', 'api'],
    hideSideNav: true,
  },
})

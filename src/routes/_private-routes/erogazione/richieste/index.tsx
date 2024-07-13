import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes/erogazione/richieste/')({
  staticData: {
    authLevels: ['admin', 'support', 'api'],
    routeKey: 'PROVIDE_AGREEMENT_LIST',
  },
  component: () => (
    <div>
      Hello
      /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/erogazione/richieste/!
    </div>
  ),
})

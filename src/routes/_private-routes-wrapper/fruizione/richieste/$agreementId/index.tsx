import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/fruizione/richieste/$agreementId/')({
  staticData: {
    authLevels: ['admin', 'support', 'security'],
    routeKey: 'SUBSCRIBE_AGREEMENT_READ',
  },
  component: () => (
    <div>
      Hello
      /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/richieste/$agreementId/!
    </div>
  ),
})

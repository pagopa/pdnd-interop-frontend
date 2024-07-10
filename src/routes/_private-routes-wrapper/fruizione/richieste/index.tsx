import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/fruizione/richieste/')({
  staticData: {
    authLevels: ['admin', 'support', 'security'],
    routeKey: 'SUBSCRIBE_AGREEMENT_LIST',
  },
  component: () => (
    <div>
      Hello /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/richieste/!
    </div>
  ),
})

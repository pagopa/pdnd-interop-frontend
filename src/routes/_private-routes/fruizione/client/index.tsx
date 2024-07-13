import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes/fruizione/client/')({
  staticData: {
    authLevels: ['admin', 'support', 'security'],
    routeKey: 'SUBSCRIBE_CLIENT_LIST',
  },
  component: () => (
    <div>
      Hello /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/client/!
    </div>
  ),
})

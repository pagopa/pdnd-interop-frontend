import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes/fruizione/finalita/')({
  staticData: {
    authLevels: ['admin', 'support', 'security'],
    routeKey: 'SUBSCRIBE_PURPOSE_LIST',
  },
  component: () => (
    <div>
      Hello /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/finalita/!
    </div>
  ),
})

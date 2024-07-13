import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes/fruizione/interop-m2m/')({
  staticData: {
    authLevels: ['admin', 'support', 'security'],
    routeKey: 'SUBSCRIBE_INTEROP_M2M',
  },
  component: () => (
    <div>
      Hello
      /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/interop-m2m/!
    </div>
  ),
})

import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/fruizione/debug-voucher/')({
  staticData: {
    authLevels: ['admin', 'support', 'api', 'security'],
    routeKey: 'SUBSCRIBE_DEBUG_VOUCHER',
  },
  component: () => (
    <div>
      Hello
      /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/debug-voucher/!
    </div>
  ),
})

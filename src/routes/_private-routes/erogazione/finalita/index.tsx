import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes/erogazione/finalita/')({
  staticData: {
    authLevels: ['admin', 'support', 'api'],
    routeKey: 'PROVIDE_PURPOSE_LIST',
  },
  component: () => (
    <div>
      Hello /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/erogazione/finalita/!
    </div>
  ),
})

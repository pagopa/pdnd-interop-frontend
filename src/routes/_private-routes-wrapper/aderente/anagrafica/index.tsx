import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-routes-wrapper/aderente/anagrafica/')({
  staticData: {
    authLevels: ['admin', 'support', 'api', 'security'],
    routeKey: 'PARTY_REGISTRY',
  },
  component: () => (
    <div>
      Hello /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/aderente/anagrafica/!
    </div>
  ),
})

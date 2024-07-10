import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes-wrapper/aderente/certificatore/_certificator-guard/'
)({
  staticData: {
    authLevels: ['admin'],
    routeKey: 'TENANT_CERTIFIER',
  },
  loader: () => {
    console.log('LOADER')
  },
  component: () => (
    <div>
      Hello
      /_authentication-guard/_tos-guard/_app-layout/_authorization-guard/aderente/certificatore/!
    </div>
  ),
})

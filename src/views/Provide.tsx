import React from 'react'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../lib/constants'

export function Provide() {
  return (
    <ProtectedSubroutes
      subroutes={ROUTES.PROVIDE.SUBROUTES!}
      redirectSrcRoute={ROUTES.PROVIDE}
      redirectDestRoute={ROUTES.PROVIDE.SUBROUTES!.ESERVICE.SUBROUTES!.LIST}
    />
  )
}

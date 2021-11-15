import React from 'react'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../config/routes'

export function Subscribe() {
  return (
    <ProtectedSubroutes
      subroutes={ROUTES.SUBSCRIBE.SUBROUTES!}
      redirectSrcRoute={ROUTES.SUBSCRIBE}
      redirectDestRoute={ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG.SUBROUTES!.LIST}
    />
  )
}

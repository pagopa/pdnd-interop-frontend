import React from 'react'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../lib/constants'

export function Subscribe() {
  return (
    <ProtectedSubroutes
      subroutes={ROUTES.SUBSCRIBE.SUBROUTES!}
      redirectSrcRoute={ROUTES.SUBSCRIBE}
      redirectDestRoute={ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST}
    />
  )
}

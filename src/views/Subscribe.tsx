import React from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../lib/constants'

export function Subscribe() {
  return (
    <React.Fragment>
      <SectionHeader view="subscriber" />

      <ProtectedSubroutes
        subroutes={ROUTES.SUBSCRIBE.SUBROUTES!}
        redirectSrcRoute={ROUTES.SUBSCRIBE}
        redirectDestRoute={ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST}
      />
    </React.Fragment>
  )
}

import React from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../lib/constants'

export function Provide() {
  return (
    <React.Fragment>
      <SectionHeader view="provider" />

      <ProtectedSubroutes
        subroutes={ROUTES.PROVIDE.SUBROUTES!}
        redirectSrcRoute={ROUTES.PROVIDE}
        redirectDestRoute={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST}
      />
    </React.Fragment>
  )
}

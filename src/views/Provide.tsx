import React from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { withLogin } from '../components/withLogin'
import { ROUTES } from '../lib/constants'

function ProvideComponent() {
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

export const Provide = withLogin(ProvideComponent)

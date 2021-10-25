import React from 'react'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../lib/constants'
import { Layout } from '../components/Shared/Layout'

export function Provide() {
  return (
    <Layout>
      <ProtectedSubroutes
        subroutes={ROUTES.PROVIDE.SUBROUTES!}
        redirectSrcRoute={ROUTES.PROVIDE}
        redirectDestRoute={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST}
      />
    </Layout>
  )
}

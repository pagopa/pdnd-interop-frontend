import React from 'react'
import { ProtectedSubroutes } from '../components/ProtectedSubroutes'
import { ROUTES } from '../lib/constants'
import { Layout } from '../components/Shared/Layout'

export function Subscribe() {
  return (
    <Layout>
      <ProtectedSubroutes
        subroutes={ROUTES.SUBSCRIBE.SUBROUTES!}
        redirectSrcRoute={ROUTES.SUBSCRIBE}
        redirectDestRoute={ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST}
      />
    </Layout>
  )
}

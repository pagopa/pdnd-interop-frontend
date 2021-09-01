import React from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getLastBit } from '../lib/url-utils'

export function EServiceRead() {
  const eserviceId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<any>(
    {
      path: {
        endpoint: 'ESERVICE_GET_SINGLE',
        endpointParams: { eserviceId },
      },
      config: { method: 'GET' },
    },
    {}
  )

  return (
    <React.Fragment>
      <WhiteBackground>
        <h1>E-service {data?.name}</h1>
        <h2>Versione {data?.descriptors?.[0]?.version}</h2>
      </WhiteBackground>
      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo e-service" />}
    </React.Fragment>
  )
}

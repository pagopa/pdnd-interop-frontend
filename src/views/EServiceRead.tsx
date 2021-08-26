import React from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'

export function EServiceRead() {
  const location = useLocation()
  const urlBits = location.pathname.split('/').filter((b) => b)
  const eserviceId = urlBits[urlBits.length - 1]
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
    <LoadingOverlay isLoading={loading} loadingText="Stiamo caricando il tuo e-service">
      <WhiteBackground>
        <h1>E-service {data?.name}</h1>
        <h2>Versione {data?.descriptors?.[0]?.version}</h2>
      </WhiteBackground>
    </LoadingOverlay>
  )
}

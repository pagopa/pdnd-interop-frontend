import React from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'

export function AgreementEdit() {
  const location = useLocation()
  const urlBits = location.pathname.split('/').filter((b) => b)
  const agreementId = urlBits[urlBits.length - 1]
  const { data, loading } = useAsyncFetch<any>(
    {
      path: {
        endpoint: 'AGREEMENT_GET_SINGLE',
        endpointParams: { agreementId },
      },
      config: { method: 'GET' },
    },
    {}
  )

  return (
    <LoadingOverlay isLoading={loading} loadingText="Stiamo caricando l'accordo richiesto">
      <WhiteBackground>
        <h1>Accordo: {data?.id}</h1>
      </WhiteBackground>
    </LoadingOverlay>
  )
}

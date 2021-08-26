import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { WhiteBackground } from '../components/WhiteBackground'
import { fetchWithLogs } from '../lib/api-utils'

export function EServiceRead() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>()

  useEffect(() => {
    async function asyncFetchService() {
      const urlBits = location.pathname.split('/').filter((b) => b)
      const eserviceId = urlBits[urlBits.length - 1]

      setLoading(true)
      const resp = await fetchWithLogs(
        {
          endpoint: 'ESERVICE_GET_SINGLE',
          endpointParams: { eserviceId },
        },
        { method: 'GET' }
      )

      setData(resp.data)
      setLoading(false)
    }

    asyncFetchService()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LoadingOverlay isLoading={loading} loadingText="Stiamo caricando il tuo e-service">
      <WhiteBackground>
        <h1>E-service {data?.name}</h1>
        <h2>Versione {data?.descriptors?.[0]?.version}</h2>
      </WhiteBackground>
    </LoadingOverlay>
  )
}

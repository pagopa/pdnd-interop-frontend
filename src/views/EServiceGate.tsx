import React from 'react'
import { useLocation } from 'react-router-dom'
import { EServiceDataType, EServiceSummary } from '../../types'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getLastBit } from '../lib/url-utils'
import { EServiceRead } from './EServiceRead'
// import { EServiceWrite } from './EServiceWrite'

export function EServiceGate() {
  const eserviceId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<EServiceDataType & EServiceSummary>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
      config: { method: 'GET' },
    },
    { defaultValue: {} }
  )

  const props = { data }

  return (
    <React.Fragment>
      {data &&
      data?.descriptors &&
      (data?.descriptors.length === 0 || data?.descriptors[0].status === 'draft') ? (
        // <EServiceWrite {...props} />
        <EServiceRead {...props} />
      ) : (
        <EServiceRead {...props} />
      )}
      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo e-service" />}
    </React.Fragment>
  )
}

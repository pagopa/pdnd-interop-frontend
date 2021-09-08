import React from 'react'
import { useLocation } from 'react-router-dom'
import { EServiceReadType, EServiceWriteType } from '../../types'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getLastBit } from '../lib/url-utils'
import { EServiceRead } from './EServiceRead'
import { EServiceWrite } from './EServiceWrite'

export function EServiceGate() {
  const eserviceId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<EServiceWriteType | EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
      config: { method: 'GET' },
    },
    { defaultValue: {} }
  )

  return (
    <React.Fragment>
      {data &&
      data?.descriptors &&
      (data?.descriptors.length === 0 || data?.descriptors[0].status === 'draft') ? (
        <EServiceWrite data={data as EServiceWriteType} />
      ) : (
        <EServiceRead data={data as EServiceReadType} />
      )}
      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo e-service" />}
    </React.Fragment>
  )
}

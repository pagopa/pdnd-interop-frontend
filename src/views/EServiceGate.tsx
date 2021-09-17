import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { EServiceNoDescriptorId, EServiceReadType } from '../../types'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits } from '../lib/url-utils'
import { EServiceRead } from './EServiceRead'
import { EServiceWrite } from './EServiceWrite'

export function EServiceGate() {
  const bits = getBits(useLocation())
  // EServiceNoDescriptorId disappears in the typing
  // (cannot do better than this because of #6579 – https://github.com/Microsoft/TypeScript/issues/6579)
  // but it is important to realize descriptorId might have a value that identifies a not-yet-created descriptor
  const descriptorId: string | EServiceNoDescriptorId | undefined = bits.pop() // last item in bits array
  const eserviceId = bits.pop() // last-but-two item in bits array

  const { data, loading } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
      config: { method: 'GET' },
    },
    {
      defaultValue: {},
      // Isolate activeDescriptor for easier access
      mapFn: (eserviceData) => {
        // Fails in case descriptorId is EServiceNoDescriptorId
        const activeDescriptor = eserviceData.descriptors.find(({ id }) => id === descriptorId)
        return { ...eserviceData, activeDescriptor }
      },
    }
  )

  // We are sure that !isEmpty(data) as EServiceGate is only called on an already existing eservice
  // When a user creates a new e-service, it directly goes throuth EServiceWrite in the router
  const isEditable = isEmpty(data.activeDescriptor) || data.activeDescriptor!.status === 'draft'

  return (
    <React.Fragment>
      {isEditable ? <EServiceWrite fetchedData={data} /> : <EServiceRead data={data} />}
      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo e-service" />}
    </React.Fragment>
  )
}

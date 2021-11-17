import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { EServiceNoDescriptorId, EServiceReadType } from '../../types'
import { NotFound } from './NotFound'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits } from '../lib/router-utils'
import { EServiceRead } from './EServiceRead'
import { EServiceWrite } from './EServiceWrite'
import { decorateEServiceWithActiveDescriptor } from '../lib/eservice-utils'
import { Skeleton } from '@mui/material'

export function EServiceGate() {
  const location = useLocation()
  const bits = getBits(location)
  // EServiceNoDescriptorId disappears in the typing
  // (cannot do better than this because of #6579 – https://github.com/Microsoft/TypeScript/issues/6579)
  // but it is important to realize descriptorId might have a value that identifies a not-yet-created descriptor
  const descriptorId: string | EServiceNoDescriptorId | undefined = bits.pop() // last item in bits array
  const eserviceId = bits.pop() // last-but-two item in bits array

  const { data, error, isItReallyLoading } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      defaultValue: {},
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      useEffectDeps: [location],
      loadingTextLabel: 'Stiamo caricando il tuo e-service',
    }
  )

  const getInitialStepIndexDestination = () => {
    // Descriptors never created
    if (data.descriptors.length === 0) {
      // Go to step 2 to create them
      return 1
    }

    // Version step already completed
    // We do not have to check all fields. If there is an activeDescriptor,
    // it means that the user has already saved a version step for this version
    // before. This means that the version step is already complete, and we can
    // skip to the following step, aka go to step 3
    return 2
  }

  // We are sure that !isEmpty(data) as EServiceGate is only called on an already existing eservice
  // When a user creates a new e-service, it directly goes throuth EServiceWrite in the router
  const isEditable = isEmpty(data.activeDescriptor) || data.activeDescriptor!.status === 'draft'

  if (error) {
    return <NotFound errorType="server-error" />
  }

  // We are sure that no data means loading because if the e-service has no data at all,
  // it should directly mount the EServiceWrite component without passing any fetchedDataMaybe
  if (isItReallyLoading) {
    return <Skeleton height={400} />
  }

  return isEditable ? (
    <EServiceWrite
      fetchedDataMaybe={data}
      initialStepIndexDestination={getInitialStepIndexDestination()}
    />
  ) : (
    <EServiceRead data={data} />
  )
}

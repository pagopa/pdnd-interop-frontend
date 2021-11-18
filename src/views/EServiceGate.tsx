import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { EServiceNoDescriptorId, EServiceReadType } from '../../types'
import { NotFound } from './NotFound'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits, isSamePath } from '../lib/router-utils'
import { EServiceRead } from './EServiceRead'
import { EServiceWrite } from './EServiceWrite'
import { decorateEServiceWithActiveDescriptor } from '../lib/eservice-utils'
import { useActiveStep } from '../hooks/useActiveStep'
import { Skeleton } from '@mui/material'
import { ROUTES } from '../config/routes'

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
  // Active step logic should belong in EServiceWrite. It was raised here
  // with good reason, to allow for the step index logic to work better
  // and to avoid it breaking if a Skeleton is introduced when the component is loading
  const { back, forward, activeStep } = useActiveStep({ data })

  const isCreatePage = isSamePath(location.pathname, ROUTES.PROVIDE_ESERVICE_CREATE.PATH)
  const isDraft = isEmpty(data.activeDescriptor) || data.activeDescriptor!.status === 'draft'
  const isEditable = isCreatePage || isDraft

  if (error && !isCreatePage) {
    return <NotFound errorType="server-error" />
  }

  if (isItReallyLoading) {
    return <Skeleton height={400} />
  }

  return isEditable ? (
    <EServiceWrite back={back} forward={forward} activeStep={activeStep} fetchedDataMaybe={data} />
  ) : (
    <EServiceRead data={data} />
  )
}

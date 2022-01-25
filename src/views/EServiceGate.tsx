import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { EServiceDescriptorRead, EServiceReadType } from '../../types'
import { NotFound } from './NotFound'
import { isSamePath } from '../lib/router-utils'
import { EServiceRead } from './EServiceRead'
import { EServiceWrite } from './EServiceWrite'
import { useActiveStep } from '../hooks/useActiveStep'
import { ROUTES } from '../config/routes'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'

export function EServiceGate() {
  // Active step logic should belong in EServiceWrite. It was raised here
  // with good reason, to allow for the step index logic to work better
  // and to avoid it breaking if a Skeleton is introduced when the component is loading
  const { back, forward, activeStep } = useActiveStep()

  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const { data, error, isItReallyLoading } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      // Data must be fetched every time step changes since the info stored
      // in the db may change, and the "back" button may display obsolete info
      useEffectDeps: [activeStep],
      loadingTextLabel: 'Stiamo caricando il tuo e-service',
    }
  )

  const isCreatePage = isSamePath(location.pathname, ROUTES.PROVIDE_ESERVICE_CREATE.PATH)
  const isDraft =
    !data ||
    isEmpty(data.activeDescriptor) ||
    (data.activeDescriptor as EServiceDescriptorRead).state === 'DRAFT'
  const isEditable = isCreatePage || isDraft

  if (error && !isCreatePage) {
    return <NotFound errorType="server-error" />
  }

  return isEditable ? (
    <EServiceWrite back={back} forward={forward} activeStep={activeStep} fetchedData={data} />
  ) : (
    <EServiceRead isLoading={isItReallyLoading} data={data as EServiceReadType} />
  )
}

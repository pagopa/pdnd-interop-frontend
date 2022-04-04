import { useLocation } from 'react-router-dom'
import { EServiceReadType } from '../../types'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useAsyncFetch } from './useAsyncFetch'

export const useEserviceCreateFetch = () => {
  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)

  const { data, error, isLoading } = useAsyncFetch<EServiceReadType>(
    { path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } } },
    { mapFn: decorateEServiceWithActiveDescriptor(descriptorId) }
  )

  return { data, error, isLoading, eserviceId, descriptorId }
}

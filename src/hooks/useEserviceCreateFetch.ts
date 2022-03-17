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

  const { data, error } = useAsyncFetch<EServiceReadType>(
    {
      path: {
        endpoint: 'ESERVICE_GET_SINGLE',
        endpointParams: { eserviceId },
      },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      loadingTextLabel: 'Stiamo caricando il tuo E-Service',
    }
  )

  return { data, error, eserviceId, descriptorId }
}

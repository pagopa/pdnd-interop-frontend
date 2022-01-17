import { useLocation } from 'react-router-dom'
import { EServiceReadType } from '../../types'
import {
  decorateEServiceWithActiveDescriptor,
  getEserviceAndDescriptorFromUrl,
} from '../lib/eservice-utils'
import { useAsyncFetch } from './useAsyncFetch'

export const useEservice = () => {
  const location = useLocation()
  const { eserviceId, descriptorId } = getEserviceAndDescriptorFromUrl(location)
  const { loadingText, data, error, isItReallyLoading } = useAsyncFetch<EServiceReadType>(
    {
      path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } },
    },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      useEffectDeps: [location],
      loadingTextLabel: 'Stiamo caricando il tuo e-service',
    }
  )

  return { loadingText, data, error, isItReallyLoading }
}

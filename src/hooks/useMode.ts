import { useLocation } from 'react-router-dom'
import { isProviderOrSubscriber } from '../lib/router-utils'

export const useMode = () => {
  const location = useLocation()
  return isProviderOrSubscriber(location)
}

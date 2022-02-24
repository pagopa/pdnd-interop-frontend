import { useLocation } from 'react-router-dom'

export const useClientKind = () => {
  const location = useLocation()
  return location.pathname.includes('interop-m2m') ? 'api' : 'consumer'
}

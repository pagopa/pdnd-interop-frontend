import { useQuery } from '@tanstack/react-query'
import { getMaintenanceJson } from './maintenance.services'

export function useGetMaintenanceJson() {
  return useQuery(['Maintenance json'], getMaintenanceJson, {
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}

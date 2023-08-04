import { useQuery } from '@tanstack/react-query'
import { getMaintenanceJson } from './maintenance.services'

export enum MaintenanceQueryKeys {
  GetMaintenanceJson = 'GetMaintenanceJson',
}

export function useGetMaintenanceJson() {
  return useQuery({
    queryKey: [MaintenanceQueryKeys.GetMaintenanceJson],
    queryFn: getMaintenanceJson,
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}

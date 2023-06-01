import { getMaintenanceJson } from './maintenance.services'
import { useQueryWrapper } from '../react-query-wrappers'

enum MaintenanceQueryKeys {
  MaintenanceJson = 'MaintenanceJson',
}

export function useGetMaintenanceJson() {
  return useQueryWrapper([MaintenanceQueryKeys.MaintenanceJson], getMaintenanceJson, {
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}

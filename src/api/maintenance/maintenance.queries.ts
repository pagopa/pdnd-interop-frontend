import { queryOptions } from '@tanstack/react-query'
import { MaintenanceServices } from './maintenance.services'

function getMaintenanceJson() {
  return queryOptions({
    queryKey: ['GetMaintenanceJson'],
    queryFn: MaintenanceServices.getMaintenanceJson,
    throwOnError: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const MaintenanceQueries = {
  getMaintenanceJson,
}

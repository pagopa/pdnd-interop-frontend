import { useQuery } from '@tanstack/react-query'
import { MaintenanceQueries } from '@/api/maintenance'
import { useBaseBanner } from './useBaseBanner'

const STORAGE_KEY = 'lastMaintenanceViewed'

export function useMaintenanceBanner() {
  const { data } = useQuery(MaintenanceQueries.getMaintenanceJson())

  return useBaseBanner({
    data,
    storageKey: STORAGE_KEY,
    translationKeyPrefix: 'maintenanceBanner',
  })
}

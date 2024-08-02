import { INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import type { MaintenanceData } from '@/hooks/useMaintenanceBanner'
import axios from 'axios'

async function getMaintenanceJson() {
  const response = await axios.get<MaintenanceData>(
    `${INTEROP_RESOURCES_BASE_URL}/maintenance-window/data.json`
  )
  return response.data
}

export const MaintenanceServices = {
  getMaintenanceJson,
}

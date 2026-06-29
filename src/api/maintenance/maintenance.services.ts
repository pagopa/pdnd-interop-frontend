import { INTEROP_RESOURCES_BASE_URL, APP_MODE } from '@/config/env'
import type { BannerData } from '@/types/banner.types'
import axios from 'axios'

async function getMaintenanceJson() {
  // Mock data in development to avoid CORS issues with S3
  if (APP_MODE === 'development') {
    const bannerData: BannerData = {
      start: {
        date: '2023-05-25',
        time: '10:47',
      },
      end: {
        date: '2028-05-25',
        time: '12:47',
      },
    }

    return bannerData
  }

  const response = await axios.get<BannerData>(
    `${INTEROP_RESOURCES_BASE_URL}/maintenance-window/data.json`
  )
  return response.data
}
export const MaintenanceServices = {
  getMaintenanceJson,
}

import { APP_MODE, INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import type { BannerData } from '@/hooks/bannerHooks/utils'
import axios from 'axios'

async function getProductUpdatesJson() {
  // Mock data in development to avoid CORS issues with S3
  if (APP_MODE === 'development') {
    return {
      start: {
        date: '2023-05-25',
        time: '10:47',
      },
      end: {
        date: '2028-05-25',
        time: '12:47',
      },
    } as BannerData
  }

  const response = await axios.get<BannerData>(
    `${INTEROP_RESOURCES_BASE_URL}/banner-info-window/data.json`
  )
  return response.data
}

export const ProductUpdatesServices = {
  getProductUpdatesJson,
}

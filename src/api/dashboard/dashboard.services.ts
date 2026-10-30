import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  GetProducerDashboardSaturationParams,
  ProducerDashboardSaturation,
} from '../api.generatedTypes'

async function getProducerDashboardSaturation(params: GetProducerDashboardSaturationParams) {
  const response = await axiosInstance.get<ProducerDashboardSaturation>(
    `${BACKEND_FOR_FRONTEND_URL}/producers/dashboard/saturation`,
    { params }
  )
  return response.data
}

export const DashboardServices = {
  getProducerDashboardSaturation,
}

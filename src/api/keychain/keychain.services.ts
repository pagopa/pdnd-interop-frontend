import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  CompactProducerKeychains,
  GetProducerKeychainsParams,
  ProducerKeychain,
} from '../api.generatedTypes'

async function getKeychainsList(params: GetProducerKeychainsParams) {
  const response = await axiosInstance.get<CompactProducerKeychains>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains`,
    {
      params,
    }
  )
  return response.data
}

function deleteKeychain({ producerKeychainId }: { producerKeychainId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}`)
}

async function getSingle(producerKeychainId: string) {
  const response = await axiosInstance.get<ProducerKeychain>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}`
  )
  return response.data
}

export const KeychainServices = {
  deleteKeychain,
  getKeychainsList,
  getSingle,
}

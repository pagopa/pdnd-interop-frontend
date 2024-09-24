import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  CreatedResource,
  ProducerKeychainSeed,
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

async function createKeychain(payload: ProducerKeychainSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains`,
    payload
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

async function addOperator({
  producerKeychainId,
  userId,
}: {
  producerKeychainId: string
  userId: string
}) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/users/${userId}`
  )
  return response.data
}

export const KeychainServices = {
  deleteKeychain,
  getKeychainsList,
  getSingle,
  createKeychain,
  addOperator,
}

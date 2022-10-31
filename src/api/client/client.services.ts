import { AUTHORIZATION_PROCESS_URL, PURPOSE_PROCESS_URL } from '@/config/env'
import axiosInstance from '@/lib/axios'
import { Client } from '@/types/client.types'
import { ClientCreatePayload, ClientGetAllUrlParams } from './client.api.types'

async function getAll(params: ClientGetAllUrlParams) {
  const response = await axiosInstance.get<{ clients: Array<Client> }>(
    `${AUTHORIZATION_PROCESS_URL}/clients`,
    {
      params,
    }
  )
  return response.data.clients
}

async function getSingle(clientId: string) {
  const response = await axiosInstance.get<Client>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}`
  )
  return response.data
}

async function create({ payload }: { payload: ClientCreatePayload }) {
  const response = await axiosInstance.post<Client>(
    `${PURPOSE_PROCESS_URL}/clientsConsumer`,
    payload
  )
  return response.data
}

async function createInteropM2M({ payload }: { payload: ClientCreatePayload }) {
  const response = await axiosInstance.post<Client>(
    `${AUTHORIZATION_PROCESS_URL}/clientsApi`,
    payload
  )
  return response.data
}

function deleteOne({ clientId }: { clientId: string }) {
  return axiosInstance.delete(`${AUTHORIZATION_PROCESS_URL}/clients/${clientId}`)
}

function joinWithPurpose({ clientId, purposeId }: { clientId: string; purposeId: string }) {
  return axiosInstance.post(`${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/purposes`, {
    purposeId,
  })
}

function removeFromPurpose({ clientId, purposeId }: { clientId: string; purposeId: string }) {
  return axiosInstance.delete(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/purposes/${purposeId}`
  )
}

const ClientServices = {
  getAll,
  getSingle,
  create,
  createInteropM2M,
  deleteOne,
  joinWithPurpose,
  removeFromPurpose,
}

export default ClientServices

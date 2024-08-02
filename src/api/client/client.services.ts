import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  Client,
  ClientSeed,
  CompactClients,
  CompactUsers,
  CreatedResource,
  EncodedClientKey,
  GetClientKeysParams,
  GetClientsParams,
  KeysSeed,
  PublicKey,
  PublicKeys,
  User,
} from '../api.generatedTypes'

async function getList(params: GetClientsParams) {
  const response = await axiosInstance.get<CompactClients>(`${BACKEND_FOR_FRONTEND_URL}/clients`, {
    params,
  })
  return response.data
}

async function getSingle(clientId: string) {
  const response = await axiosInstance.get<Client>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}`
  )
  return response.data
}

async function getKeyList({ clientId, ...params }: GetClientKeysParams) {
  const response = await axiosInstance.get<PublicKeys>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/keys`,
    { params }
  )
  return response.data
}

async function getSingleKey(clientId: string, kid: string) {
  const response = await axiosInstance.get<PublicKey>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/keys/${kid}`
  )
  return response.data
}

async function getOperatorList(clientId: string) {
  const response = await axiosInstance.get<CompactUsers>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/users`
  )
  return response.data
}

async function getSingleOperator(userId: string) {
  const response = await axiosInstance.get<User>(`${BACKEND_FOR_FRONTEND_URL}/users/${userId}`)
  return response.data
}

async function getOperatorKeys(clientId: string, userId: string) {
  const response = await axiosInstance.get<PublicKeys>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/users/${userId}/keys`
  )
  return response.data.keys
}

async function create(payload: ClientSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/clientsConsumer`,
    payload
  )
  return response.data
}

async function createInteropM2M(payload: ClientSeed) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/clientsApi`,
    payload
  )
  return response.data
}

function deleteOne({ clientId }: { clientId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}`)
}

async function postKey({ clientId, payload }: { clientId: string; payload: KeysSeed }) {
  const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/keys`,
    payload
  )
  return response.data
}

async function downloadKey({ clientId, kid }: { clientId: string; kid: string }) {
  const response = await axiosInstance.get<EncodedClientKey>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/encoded/keys/${kid}`
  )
  return atob(response.data.key)
}

function deleteKey({ clientId, kid }: { clientId: string; kid: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/keys/${kid}`)
}

async function addOperator({ clientId, userId }: { clientId: string; userId: string }) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/users/${userId}`
  )
  return response.data
}

function removeOperator({ clientId, userId }: { clientId: string; userId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/users/${userId}`)
}

export const ClientServices = {
  getList,
  getSingle,
  getKeyList,
  getSingleKey,
  getOperatorList,
  getSingleOperator,
  getOperatorKeys,
  create,
  createInteropM2M,
  deleteOne,
  postKey,
  downloadKey,
  deleteKey,
  addOperator,
  removeOperator,
}

import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  AddUsersToClientPayload,
  Client,
  ClientSeed,
  CompactClients,
  CompactUsers,
  CreatedResource,
  EncodedClientKey,
  GetClientKeysParams,
  GetClientsParams,
  KeySeed,
  PublicKey,
  PublicKeys,
  SetAdminToClientPayload,
} from '../api.generatedTypes'
import { getAllFromPaginated } from '@/utils/common.utils'

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

async function getAllKeysList(params: Omit<GetClientKeysParams, 'limit' | 'offset'>) {
  return await getAllFromPaginated(async (offset, limit) => {
    const publicKeys = await getKeyList({ ...params, limit, offset })
    return { results: publicKeys.keys, pagination: publicKeys.pagination! }
  })
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

async function postKey({ clientId, payload }: { clientId: string; payload: KeySeed }) {
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

async function addOperators({
  clientId,
  ...payload
}: { clientId: string } & AddUsersToClientPayload) {
  const response = await axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/users`,
    payload
  )
  return response.data
}

function removeOperator({ clientId, userId }: { clientId: string; userId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/users/${userId}`)
}

function setClientAdmin({
  clientId,
  payload,
}: {
  clientId: string
  payload: SetAdminToClientPayload
}) {
  return axiosInstance.post<CreatedResource>(
    `${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/admin`,
    payload
  )
}

function removeClientAdmin({ clientId, adminId }: { clientId: string; adminId: string }) {
  return axiosInstance.delete(`${BACKEND_FOR_FRONTEND_URL}/clients/${clientId}/admin/${adminId}`)
}

export const ClientServices = {
  getList,
  getSingle,
  getKeyList,
  getAllKeysList,
  getSingleKey,
  getOperatorList,
  getOperatorKeys,
  create,
  createInteropM2M,
  deleteOne,
  postKey,
  downloadKey,
  deleteKey,
  addOperators,
  removeOperator,
  setClientAdmin,
  removeClientAdmin,
}

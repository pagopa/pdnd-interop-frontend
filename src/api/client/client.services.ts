import { AUTHORIZATION_PROCESS_URL, BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { Client } from '@/types/client.types'
import { PublicKey, PublicKeys } from '@/types/key.types'
import { SelfCareUser } from '@/types/party.types'
import {
  ClientCreatePayload,
  ClientGetListUrlParams,
  ClientGetOperatorsListUrlParams,
  ClientPostKeyPayload,
} from './client.api.types'

async function getList(params: ClientGetListUrlParams) {
  const response = await axiosInstance.get<{ clients: Array<Client> }>(
    `${AUTHORIZATION_PROCESS_URL}/clients`,
    { params }
  )
  return response.data.clients
}

async function getSingle(clientId: string) {
  const response = await axiosInstance.get<Client>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}`
  )
  return response.data
}

async function getKeyList(clientId: string) {
  const response = await axiosInstance.get<PublicKeys>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/keys`
  )
  return response.data
}

async function getSingleKey(clientId: string, kid: string) {
  const response = await axiosInstance.get<PublicKey>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/keys/${kid}`
  )
  return response.data
}

async function getOperatorList(clientId: string, params?: ClientGetOperatorsListUrlParams) {
  const response = await axiosInstance.get<Array<SelfCareUser>>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/operators`,
    { params }
  )
  return response.data
}

async function getSingleOperator(relationshipId: string) {
  const response = await axiosInstance.get<SelfCareUser>(
    `${BACKEND_FOR_FRONTEND_URL}/relationships/${relationshipId}`
  )
  return response.data
}

async function getOperatorKeys(clientId: string, operatorId: string) {
  const response = await axiosInstance.get<PublicKeys>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/operators/${operatorId}/keys`
  )
  return response.data.keys
}

async function create(payload: ClientCreatePayload) {
  const response = await axiosInstance.post<Client>(
    `${AUTHORIZATION_PROCESS_URL}/clientsConsumer`,
    payload
  )
  return response.data
}

async function createInteropM2M(payload: ClientCreatePayload) {
  const response = await axiosInstance.post<Client>(
    `${AUTHORIZATION_PROCESS_URL}/clientsApi`,
    payload
  )
  return response.data
}

function deleteOne({ clientId }: { clientId: string }) {
  return axiosInstance.delete(`${AUTHORIZATION_PROCESS_URL}/clients/${clientId}`)
}

async function postKey({
  clientId,
  payload,
}: {
  clientId: string
  payload: Array<ClientPostKeyPayload>
}) {
  const response = await axiosInstance.post<Array<PublicKey>>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/keys`,
    payload
  )
  return response.data
}

async function downloadKey({ clientId, kid }: { clientId: string; kid: string }) {
  const response = await axiosInstance.get<{ key: string }>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/encoded/keys/${kid}`
  )
  return atob(response.data.key)
}

function deleteKey({ clientId, kid }: { clientId: string; kid: string }) {
  return axiosInstance.delete(`${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/keys/${kid}`)
}

async function addOperator({
  clientId,
  relationshipId,
}: {
  clientId: string
  relationshipId: string
}) {
  const response = await axiosInstance.post<Client>(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/relationships/${relationshipId}`
  )
  return response.data
}

function removeOperator({
  clientId,
  relationshipId,
}: {
  clientId: string
  relationshipId: string
}) {
  return axiosInstance.delete(
    `${AUTHORIZATION_PROCESS_URL}/clients/${clientId}/relationships/${relationshipId}`
  )
}

const ClientServices = {
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

export default ClientServices

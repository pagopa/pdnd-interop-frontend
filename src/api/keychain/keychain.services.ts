import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import type {
  CompactProducerKeychains,
  CompactUsers,
  CreatedResource,
  EncodedClientKey,
  EServiceAdditionDetailsSeed,
  GetProducerKeychainsParams,
  GetProducerKeysParams,
  KeySeed,
  ProducerKeychain,
  ProducerKeychainSeed,
  PublicKey,
  PublicKeys,
} from '../api.generatedTypes'

async function getSingle(producerKeychainId: string) {
  const response = await axiosInstance.get<ProducerKeychain>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}`
  )
  return response.data
}

async function getKeychainsList(params: GetProducerKeychainsParams) {
  const response = await axiosInstance.get<CompactProducerKeychains>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains`,
    { params }
  )
  return response.data
}

async function getProducerKeychainKeysList(params: GetProducerKeysParams) {
  const response = await axiosInstance.get<PublicKeys>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${params.producerKeychainId}/keys`,
    { params: { userIds: params.userIds } }
  )
  return response.data
}

async function getProducerKeychainKey({
  producerKeychainId,
  keyId,
}: {
  producerKeychainId: string
  keyId: string
}) {
  const response = await axiosInstance.get<PublicKey>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/keys/${keyId}`
  )
  return response.data
}

async function getProducerKeychainUsersList(producerKeychainId: string) {
  const response = await axiosInstance.get<CompactUsers>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/users`
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

function removeKeychainFromEService({
  eserviceId,
  keychainId,
}: {
  eserviceId: string
  keychainId: string
}) {
  return axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${keychainId}/eservices/${eserviceId}`
  )
}

function addKeychainToEService({
  keychainId,
  eserviceId,
}: {
  keychainId: string
} & EServiceAdditionDetailsSeed) {
  return axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${keychainId}/eservices`,
    eserviceId
  )
}

async function addProducerKeychainUser({
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

async function downloadKey({
  producerKeychainId,
  keyId,
}: {
  producerKeychainId: string
  keyId: string
}) {
  const response = await axiosInstance.get<EncodedClientKey>(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/encoded/keys/${keyId}`
  )
  return atob(response.data.key)
}

async function deleteProducerKeychainKey({
  producerKeychainId,
  keyId,
}: {
  producerKeychainId: string
  keyId: string
}) {
  await axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/keys/${keyId}`
  )
}

async function createProducerKeychainKey({
  producerKeychainId,
  payload,
}: {
  producerKeychainId: string
  payload: KeySeed
}) {
  await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/keys`,
    payload
  )
}

async function removeUserFromKeychain({
  producerKeychainId,
  userId,
}: {
  producerKeychainId: string
  userId: string
}) {
  await axiosInstance.delete(
    `${BACKEND_FOR_FRONTEND_URL}/producerKeychains/${producerKeychainId}/users/${userId}`
  )
}

export const KeychainServices = {
  getSingle,
  getKeychainsList,
  getProducerKeychainUsersList,
  getProducerKeychainKeysList,
  getProducerKeychainKey,
  createKeychain,
  deleteKeychain,
  removeKeychainFromEService,
  addKeychainToEService,
  addProducerKeychainUser,
  downloadKey,
  deleteProducerKeychainKey,
  createProducerKeychainKey,
  removeUserFromKeychain,
}

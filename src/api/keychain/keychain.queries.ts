import { queryOptions } from '@tanstack/react-query'
import { KeychainServices } from './keychain.services'
import type { GetProducerKeychainsParams, GetProducerKeysParams } from '../api.generatedTypes'

function getKeychainsList(params: GetProducerKeychainsParams) {
  return queryOptions({
    queryKey: ['KeychainGetList', params],
    queryFn: () => KeychainServices.getKeychainsList(params),
  })
}

function getSingle(producerKeychainId: string) {
  return queryOptions({
    queryKey: ['KeychainGetSingle', producerKeychainId],
    queryFn: () => KeychainServices.getSingle(producerKeychainId),
  })
}

function getProducerKeychainUsersList(producerKeychainId: string) {
  return queryOptions({
    queryKey: ['KeychainGetUsersList', producerKeychainId],
    queryFn: () => KeychainServices.getProducerKeychainUsersList(producerKeychainId),
  })
}

function getProducerKeychainKeysList(params: GetProducerKeysParams) {
  return queryOptions({
    queryKey: ['KeychainGetKeysList', params],
    queryFn: () => KeychainServices.getProducerKeychainKeysList(params),
  })
}

function getProducerKeychainKey({
  producerKeychainId,
  keyId,
}: {
  producerKeychainId: string
  keyId: string
}) {
  return queryOptions({
    queryKey: ['KeychainGetKeysList', producerKeychainId, keyId],
    queryFn: () => KeychainServices.getProducerKeychainKey({ producerKeychainId, keyId }),
  })
}

export const KeychainQueries = {
  getKeychainsList,
  getSingle,
  getProducerKeychainUsersList,
  getProducerKeychainKeysList,
  getProducerKeychainKey,
}

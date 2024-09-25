import { queryOptions } from '@tanstack/react-query'
import { KeychainServices } from './keychain.services'
import type { GetProducerKeychainsParams } from '../api.generatedTypes'

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

export const KeychainQueries = {
  getKeychainsList,
  getSingle,
}

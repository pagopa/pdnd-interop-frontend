import { queryOptions } from '@tanstack/react-query'
import { ClientServices } from './client.services'
import type { GetClientKeysParams, GetClientsParams } from '../api.generatedTypes'
import { NotFoundError } from '@/utils/errors.utils'

function getList(params: GetClientsParams) {
  return queryOptions({
    queryKey: ['ClientGetList', params],
    queryFn: () => ClientServices.getList(params),
  })
}

function getSingle(clientId: string) {
  return queryOptions({
    queryKey: ['ClientGetSingle', clientId],
    queryFn: () => ClientServices.getSingle(clientId),
  })
}

function getKeyList(params: GetClientKeysParams) {
  return queryOptions({
    queryKey: ['ClientGetKeyList', params],
    queryFn: () => ClientServices.getKeyList(params),
    throwOnError: (error) => {
      // The error boundary is disabled for 404 errors because the `getKeyList` service
      // returns 404 if the client has no keys associated.
      return !(error instanceof NotFoundError)
    },
  })
}

function getSingleKey(clientId: string, kid: string) {
  return queryOptions({
    queryKey: ['ClientGetSingleKey', clientId, kid],
    queryFn: () => ClientServices.getSingleKey(clientId, kid),
  })
}

function getOperatorsList(clientId: string) {
  return queryOptions({
    queryKey: ['ClientGetOperatorsList', clientId],
    queryFn: () => ClientServices.getOperatorList(clientId),
  })
}

function getOperatorKeys(clientId: string, operatorId: string) {
  return queryOptions({
    queryKey: ['ClientGetClientOperatorKeys', clientId, operatorId],
    queryFn: () => ClientServices.getOperatorKeys(clientId, operatorId),
  })
}

export const ClientQueries = {
  getList,
  getSingle,
  getKeyList,
  getSingleKey,
  getOperatorsList,
  getOperatorKeys,
}

import type { ClientKind } from '@/types/client.types'
import type { UserProductRole } from '@/types/party.types'
import type { PaginationParams } from '../api.types'

export type ClientGetListQueryFilters = {
  q?: string
  consumerId?: string
  eserviceId?: string
  relationshipIds?: Array<string>
  kind: ClientKind
}

export type ClientGetListQueryParams = ClientGetListQueryFilters & PaginationParams

export type ClientCreatePayload = {
  name: string
  description?: string
}

export type ClientPostKeyPayload = {
  key: string
  use: 'SIG'
  alg: string
  name: string
}

export type ClientGetOperatorsListUrlParams = {
  productRoles: Array<UserProductRole>
}

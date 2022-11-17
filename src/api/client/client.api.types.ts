import { ClientKind } from '@/types/client.types'
import { UserProductRole } from '@/types/party.types'

export type ClientGetListUrlParams = {
  consumerId?: string
  eserviceId?: string
  kind?: ClientKind
}

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

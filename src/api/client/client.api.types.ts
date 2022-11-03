import { ClientKind } from '@/types/client.types'

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
  key: 'string'
  use: 'SIG'
  alg: 'string'
  name: 'string'
}

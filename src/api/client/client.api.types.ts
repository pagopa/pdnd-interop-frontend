import { ClientKind } from '@/types/client.types'

export type ClientGetAllUrlParams = {
  consumerId?: string
  eserviceId?: string
  kind?: ClientKind
}

export type ClientCreatePayload = {
  name: string
  description?: string
}

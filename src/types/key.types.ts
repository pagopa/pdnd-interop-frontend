import type { SelfCareUser } from './party.types'

export type PublicKeyItem = {
  kid: string
  use: 'SIG' | 'ENC'
  clientId?: string
}

export type PublicKey = {
  name: string
  createdAt: string
  key: PublicKeyItem
  operator: SelfCareUser
}

export type PublicKeys = {
  keys: Array<PublicKey>
}

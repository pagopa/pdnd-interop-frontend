export type PublicKeyItem = {
  kid: string
  use: 'sig' | 'enc'
  clientId?: string
}

export type PublicKey = {
  name: string
  createdAt: string
  key: PublicKeyItem
  operator: {
    id: string
    familyName: string
    name: string
    relationshipId: string
  }
}

export type PublicKeys = {
  keys: Array<PublicKey>
}

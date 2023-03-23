export type PublicKeyItem = {
  kid: string
  use: 'sig' | 'enc'
  clientId?: string
}

export type PublicKey = {
  keyId: string
  name: string
  operator: {
    relationshipId: string
    name: string
    familyName: string
  }
  createdAt: string
  isOrphan: true
}

export type PublicKeys = {
  keys: Array<PublicKey>
}

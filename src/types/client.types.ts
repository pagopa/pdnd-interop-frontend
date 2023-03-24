export type ClientPurpose = {
  purposeId: string
  title: string
  eservice: {
    id: string
    name: string
    producer: {
      id: string
      name: string
    }
  }
}

export type Client = {
  id: string
  name: string
  consumer: {
    id: string
    name: string
  }
  purposes: Array<ClientPurpose>
  description: string
  kind: ClientKind
}

export type ClientListingItem = {
  id: string
  name: string
  hasKeys: boolean
}

export type ClientKind = 'CONSUMER' | 'API'

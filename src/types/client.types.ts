import { SelfCareUser } from './party.types'

type ClientRelationshipState = 'ACTIVE' | 'INACTIVE'

type ClientPurposeAgreement = {
  id: string
  eservice: {
    id: string
    name: string
  }
  descriptor: {
    id: string
    version: string
  }
}

export type ClientPurpose = {
  purposeId: string
  states: {
    agreement: {
      consumerId: string
      eserviceId: string
      state: ClientRelationshipState
    }
    eservice: {
      audience: Array<string>
      eserviceId: string
      state: ClientRelationshipState
      voucherLifespan: number
    }
    purpose: {
      purposeId: string
      state: ClientRelationshipState
    }
    id: string
  }
  agreement: ClientPurposeAgreement
  title: string
}

export type Client = {
  id: string
  name: string
  description: string
  operators: Array<SelfCareUser>
  kind: ClientKind
  purposes: Array<ClientPurpose>
  consumer: {
    description: string
    institutionId: string
  }
}

export type ClientKind = 'CONSUMER' | 'API'

import type {
  AgreementState,
  EServiceAttribute,
  EServiceAttributes,
  EServiceDescriptorState,
  EServiceDoc,
  EServiceTechnology,
} from '@/api/api.generatedTypes'

type EServiceReadProducerType = {
  id: string
  name: string
}

/** @deprecated TO BE REMOVED */
export type EServiceReadType = {
  id: string
  producer: EServiceReadProducerType
  name: string
  description: string
  technology: EServiceTechnology
  attributes: EServiceAttributes
  descriptors: Array<EServiceDescriptorRead>
  state?: EServiceDescriptorState
  viewingDescriptor?: EServiceDescriptorRead // TEMP REFACTOR : this is added by the client
}

/** @deprecated TO BE REMOVED */
export type EServiceFlatten = {
  name: string
  description: string
  id: string
  producerId: string
  producerName: string
  descriptorId?: string
  state?: EServiceDescriptorState
  version?: string
  agreement?: {
    id: string
    state: AgreementState
  }
  certifiedAttributes: Array<EServiceAttribute>
}

/** @deprecated TO BE REMOVED */
export type EServiceDescriptorRead = {
  id: string
  state: EServiceDescriptorState
  docs: Array<EServiceDoc>
  interface?: EServiceDoc
  version: string
  voucherLifespan: number
  description: string
  audience: Array<string>
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: 'MANUAL' | 'AUTOMATIC'
}

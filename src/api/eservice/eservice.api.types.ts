import type { EServiceFlatten } from '@/types/eservice.types'
import type { AgreementState, EServiceDescriptorState } from '../api.generatedTypes'

/** @deprecated TO BE REMOVED */
export type EServiceGetListFlatUrlParams = {
  state?: EServiceDescriptorState
  callerId: string | undefined
  producerId?: string
  consumerId?: string
  agreementStates?: Array<AgreementState>
}

/** @deprecated TO BE REMOVED */
export type EServiceGetListFlatResponse = Array<EServiceFlatten>

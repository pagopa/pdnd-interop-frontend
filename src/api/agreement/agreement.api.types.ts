import type { AgreementState } from '@/types/agreement.types'
import type { PaginationParams } from '../api.types'

export type GetListAgreementQueryFilters = {
  producersIds?: Array<string>
  consumersIds?: Array<string>
  states?: Array<AgreementState>
  eservicesIds?: Array<string>
  showOnlyUpgradeable?: boolean
}

export type GetListAgreementQueryParams = GetListAgreementQueryFilters & PaginationParams

export type UploadAgreementDraftDocumentPayload = {
  name: string
  prettyName: string
  doc: File
}

export type GetAgreementProducersQueryFilters = {
  q?: string
}

export type GetAgreementProducersQueryParams = GetAgreementProducersQueryFilters & PaginationParams

export type GetAgreementConsumersQueryFilters = {
  q?: string
}

export type GetAgreementConsumersQueryParams = GetAgreementConsumersQueryFilters & PaginationParams

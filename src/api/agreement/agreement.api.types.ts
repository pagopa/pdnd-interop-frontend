import { AgreementState } from '@/types/agreement.types'
import { PaginationParams } from '../api.types'

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

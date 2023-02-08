import { AgreementState } from '@/types/agreement.types'

export type GetListAgreementQueryParams = {
  producerId?: string
  consumerId?: string
  states?: Array<AgreementState>
  eserviceId?: string
  descriptorId?: string
  latest?: boolean
}

export type UploadAgreementDraftDocumentPayload = {
  name: string
  prettyName: string
  doc: File
}

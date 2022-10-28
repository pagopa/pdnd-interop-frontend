import { AgreementState } from '@/types/agreement.types'

export type GetAllAgreementQueryParams = {
  producerId?: string
  consumerId?: string
  states?: Array<AgreementState>
  esericeId?: string
  descriptorId?: string
  latest?: boolean
}

export type UploadAgreementDraftDocumentPayload = {
  name: string
  prettyName: string
  doc: File
}

import type { Agreement, RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import type { DialogProps as MUIDialogProps } from '@mui/material'

export type DialogContent = {
  title: string
  description?: string
}

export type DialogDefaultProps = {
  maxWidth?: MUIDialogProps['maxWidth']
}

export type DialogProps =
  | DialogBasicProps
  | DialogAttributeDetailsProps
  | DialogSessionExpiredProps
  | DialogRejectAgreementProps
  | DialogAddClientToPurposeProps
  | DialogUpgradeAgreementVersionProps
  | DialogDeleteOperatorProps
  | DialogRemoveOperatorFromClientProps
  | DialogRevokeCertifiedAttributeProps

export type DialogAttributeDetailsProps = {
  type: 'showAttributeDetails'
  attribute: { id: string; name: string }
}

export type DialogSessionExpiredProps = {
  type: 'sessionExpired'
}

export type DialogBasicProps = DialogDefaultProps & {
  type: 'basic'
  title: string
  description?: string
  proceedLabel?: string
  onProceed: VoidFunction
  onCancel?: VoidFunction
  disabled?: boolean
}

export type DialogRejectAgreementProps = {
  type: 'rejectAgreement'
  agreementId: string
}

export type DialogAddClientToPurposeProps = {
  type: 'addClientToPurpose'
  purposeId: string
}

export type DialogUpgradeAgreementVersionProps = {
  type: 'upgradeAgreementVersion'
  agreement: Agreement
  hasMissingAttributes: boolean
}

export type DialogDeleteOperatorProps = {
  type: 'deleteOperator'
  selfcareId: string
  userId: string
}

export type DialogRemoveOperatorFromClientProps = {
  type: 'removeOperatorFromClient'
  clientId: string
  userId: string
}

export type DialogRevokeCertifiedAttributeProps = {
  type: 'revokeCertifiedAttribute'
  attribute: RequesterCertifiedAttribute
}

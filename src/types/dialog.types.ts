import type {
  Agreement,
  RequesterCertifiedAttribute,
  CompactPurposeEService,
} from '@/api/api.generatedTypes'
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
  | DialogUpgradeAgreementVersionProps
  | DialogDeleteOperatorProps
  | DialogRemoveOperatorFromClientProps
  | DialogRevokeCertifiedAttributeProps
  | DialogClonePurposeProps
  | DialogRejectPurposeVersionProps
  | DialogSetTenantMailProps

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

export type DialogClonePurposeProps = {
  type: 'clonePurpose'
  purposeId: string
  eservice: CompactPurposeEService
}

export type DialogRejectPurposeVersionProps = {
  type: 'rejectPurposeVersion'
  purposeId: string
  versionId: string
  isChangePlanRequest: boolean
}

export type DialogSetTenantMailProps = {
  type: 'setTenantMail'
}

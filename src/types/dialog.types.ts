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
  | DialogRemoveUserFromKeychainProps
  | DialogDeleteProducerKeychainKeyProps
  | DialogDelegationsProps
  | DialogAcceptProducerDelegationProps
  | DialogRejectProducerDelegationProps
  | DialogRevokeProducerDelegationProps
  | DialogRejectDelegatedVersionDraftProps

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

export type DialogRemoveUserFromKeychainProps = {
  type: 'removeUserFromKeychain'
  keychainId: string
  userId: string
}

export type DialogDeleteProducerKeychainKeyProps = {
  type: 'deleteProducerKeychainKey'
  keychainId: string
  keyId: string
}

export type DialogDelegationsProps = {
  type: 'delegations'
  onConfirm: () => void
}

export type DialogAcceptProducerDelegationProps = {
  type: 'acceptDelegation'
  delegationId: string
}

export type DialogRejectProducerDelegationProps = {
  type: 'rejectDelegation'
  delegationId: string
}

export type DialogRevokeProducerDelegationProps = {
  type: 'revokeProducerDelegation'
  delegationId: string
  eserviceName: string
}

export type DialogRejectDelegatedVersionDraftProps = {
  type: 'rejectDelegatedVersionDraft'
  eserviceId: string
  descriptorId: string
}

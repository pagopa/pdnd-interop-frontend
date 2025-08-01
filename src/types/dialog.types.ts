import type {
  Agreement,
  RequesterCertifiedAttribute,
  CompactPurposeEService,
  DelegationKind,
  TenantKind,
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
  | DialogAcceptDelegationProps
  | DialogRejectDelegationProps
  | DialogRevokeDelegationProps
  | DialogRejectDelegatedVersionDraftProps
  | DialogCreateAgreementDraftProps
  | DialogTenantKindEserviceTemplateProps

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
  checkbox?: string
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

export type DialogAcceptDelegationProps = {
  type: 'acceptDelegation'
  delegationId: string
  delegationKind: DelegationKind
}

export type DialogRejectDelegationProps = {
  type: 'rejectDelegation'
  delegationId: string
  delegationKind: DelegationKind
}

export type DialogRevokeDelegationProps = {
  type: 'revokeDelegation'
  delegationId: string
  eserviceName: string
  delegationKind: DelegationKind
}

export type DialogRejectDelegatedVersionDraftProps = {
  type: 'rejectDelegatedVersionDraft'
  eserviceId: string
  descriptorId: string
}

export type DialogCreateAgreementDraftProps = {
  type: 'createAgreementDraft'
  eservice: {
    id: string
    name: string
    producerId: string
  }
  descriptor: {
    id: string
    version: string
  }
  onSubmit: ({
    isOwnEService,
    delegationId,
  }: {
    isOwnEService: boolean
    delegationId?: string
  }) => void
}

export type DialogTenantKindEserviceTemplateProps = {
  type: 'tenantKind'
  onConfirm: (tenantKind: TenantKind) => void
}

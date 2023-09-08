import type { RelationshipInfo } from '@/api/api.generatedTypes'
import type { DialogProps as MUIDialogProps } from '@mui/material'
import type { AttributeKey } from './attribute.types'

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
  | DialogUpdatePurposeDailyCallsProps
  | DialogSetPurposeExpectedApprovalDateProps
  | DialogAddSecurityOperatorsProps
  | DialogAddSecurityOperatorKeyProps
  | DialogRejectAgreementProps
  | DialogAddClientToPurposeProps
  | DialogCreateNewAttributeProps

export type DialogAttributeDetailsProps = {
  type: 'showAttributeDetails'
  attribute: { id: string; name: string }
}

export type DialogSessionExpiredProps = {
  type: 'sessionExpired'
}

export type DialogUpdatePurposeDailyCallsProps = {
  type: 'updatePurposeDailyCalls'
  purposeId: string
  dailyCalls?: number
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

export type DialogSetPurposeExpectedApprovalDateProps = {
  type: 'setPurposeExpectedApprovalDate'
  purposeId: string
  versionId: string
  approvalDate?: string
}

export type DialogAddSecurityOperatorsProps = {
  type: 'addSecurityOperator'
  excludeOperatorsIdsList: Array<string>
  onSubmit: (relationshipIds: Array<RelationshipInfo>) => void
}

export type DialogAddSecurityOperatorKeyProps = {
  type: 'addSecurityOperatorKey'
  clientId: string
}

export type DialogRejectAgreementProps = {
  type: 'rejectAgreement'
  agreementId: string
}

export type DialogAddClientToPurposeProps = {
  type: 'addClientToPurpose'
  purposeId: string
}

export type DialogCreateNewAttributeProps = {
  type: 'createNewAttribute'
  attributeKey: AttributeKey
}

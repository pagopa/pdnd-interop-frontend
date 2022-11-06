import { DialogProps as MUIDialogProps } from '@mui/material'

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
  proceedCallback: () => void
  proceedLabel?: string
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
  clientId: string
}

export type DialogAddSecurityOperatorKeyProps = {
  type: 'addSecurityOperatorKey'
  clientId: string
}

export type DialogRejectAgreementProps = {
  type: 'rejectAgreement'
  agreementId: string
}

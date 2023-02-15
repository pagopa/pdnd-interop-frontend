import { DialogProps as MUIDialogProps } from '@mui/material'
import { AttributeKey } from './attribute.types'
import { SelfCareUser } from './party.types'

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
  | DialogUpdatePartyMailProps

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
  excludeOperatorsIdsList: Array<string>
  onSubmit: (relationshipIds: Array<SelfCareUser>) => void
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

export type DialogUpdatePartyMailProps = {
  type: 'updatePartyMail'
  defaultValues?: {
    contactEmail: string
    description: string
  }
}

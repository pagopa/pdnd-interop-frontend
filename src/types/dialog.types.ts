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
}

export type DialogBasicProps = DialogDefaultProps & {
  type: 'basic'
  title: string
  description?: string
  proceedCallback: () => void
  proceedLabel?: string
  disabled?: boolean
}

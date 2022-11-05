import React from 'react'
import { DialogBasic } from './DialogBasic'
import { DialogAttributeDetails } from './DialogAttributeDetails'
import { DialogSessionExpired } from './DialogSessionExpired'
import {
  DialogAddSecurityOperatorKeyProps,
  DialogAddSecurityOperatorsProps,
  DialogAttributeDetailsProps,
  DialogBasicProps,
  DialogProps,
  DialogSessionExpiredProps,
  DialogSetPurposeExpectedApprovalDateProps,
  DialogUpdatePurposeDailyCallsProps,
} from '@/types/dialog.types'
import { DialogUpdatePurposeDailyCalls } from './DialogUpdatePurposeDailyCalls'
import { DialogSetPurposeExpectedApprovalDate } from './DialogSetPurposeExpectedApprovalDate'
import { DialogAddSecurityOperators } from './DialogAddSecurityOperators'
import { DialogAddSecurityOperatorKey } from './DialogAddSecurityOperatorKey'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onShowAttributeDetails: (props: DialogAttributeDetailsProps) => T,
  onShowSessionExpired: (props: DialogSessionExpiredProps) => T,
  onUpdatePurposeDailyCalls: (props: DialogUpdatePurposeDailyCallsProps) => T,
  onSetPurposeExpectedApprovalDate: (props: DialogSetPurposeExpectedApprovalDateProps) => T,
  onAddSecurityOperator: (props: DialogAddSecurityOperatorsProps) => T,
  onAddSecurityOperatorKey: (props: DialogAddSecurityOperatorKeyProps) => T
) {
  return (props: DialogProps) => {
    switch (props.type) {
      case 'basic':
        return onBasic(props)
      case 'showAttributeDetails':
        return onShowAttributeDetails(props)
      case 'sessionExpired':
        return onShowSessionExpired(props)
      case 'updatePurposeDailyCalls':
        return onUpdatePurposeDailyCalls(props)
      case 'setPurposeExpectedApprovalDate':
        return onSetPurposeExpectedApprovalDate(props)
      case 'addSecurityOperator':
        return onAddSecurityOperator(props)
      case 'addSecurityOperatorKey':
        return onAddSecurityOperatorKey(props)
    }
  }
}

export const Dialog = match(
  (props) => <DialogBasic {...props} />,
  (props) => <DialogAttributeDetails {...props} />,
  (props) => <DialogSessionExpired {...props} />,
  (props) => <DialogUpdatePurposeDailyCalls {...props} />,
  (props) => <DialogSetPurposeExpectedApprovalDate {...props} />,
  (props) => <DialogAddSecurityOperators {...props} />,
  (props) => <DialogAddSecurityOperatorKey {...props} />
)

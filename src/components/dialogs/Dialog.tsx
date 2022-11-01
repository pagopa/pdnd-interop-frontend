import React from 'react'
import { DialogBasic } from './DialogBasic'
import { DialogAttributeDetails } from './DialogAttributeDetails'
import { DialogSessionExpired } from './DialogSessionExpired'
import {
  DialogAttributeDetailsProps,
  DialogBasicProps,
  DialogProps,
  DialogSessionExpiredProps,
  DialogSetPurposeExpectedApprovalDateProps,
  DialogUpdatePurposeDailyCallsProps,
} from '@/types/dialog.types'
import { DialogUpdatePurposeDailyCalls } from './DialogUpdatePurposeDailyCalls'
import { DialogSetPurposeExpectedApprovalDate } from './DialogSetPurposeExpectedApprovalDate'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onShowAttributeDetails: (props: DialogAttributeDetailsProps) => T,
  onShowSessionExpired: (props: DialogSessionExpiredProps) => T,
  onUpdatePurposeDailyCalls: (props: DialogUpdatePurposeDailyCallsProps) => T,
  onSetPurposeExpectedApprovalDate: (props: DialogSetPurposeExpectedApprovalDateProps) => T
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
    }
  }
}

export const Dialog = match(
  (props) => <DialogBasic {...props} />,
  (props) => <DialogAttributeDetails {...props} />,
  (props) => <DialogSessionExpired {...props} />,
  (props) => <DialogUpdatePurposeDailyCalls {...props} />,
  (props) => <DialogSetPurposeExpectedApprovalDate {...props} />
)

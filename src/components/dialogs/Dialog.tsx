import React from 'react'
import { DialogBasic } from './DialogBasic'
import { DialogAttributeDetails } from './DialogAttributeDetails'
import { DialogSessionExpired } from './DialogSessionExpired'
import type {
  DialogAddClientToPurposeProps,
  DialogAddSecurityOperatorKeyProps,
  DialogAddSecurityOperatorsProps,
  DialogAttributeDetailsProps,
  DialogBasicProps,
  DialogCreateNewAttributeProps,
  DialogProps,
  DialogRejectAgreementProps,
  DialogSessionExpiredProps,
  DialogSetPurposeExpectedApprovalDateProps,
  DialogUpdatePurposeDailyCallsProps,
} from '@/types/dialog.types'
import { DialogUpdatePurposeDailyCalls } from './DialogUpdatePurposeDailyCalls'
import { DialogSetPurposeExpectedApprovalDate } from './DialogSetPurposeExpectedApprovalDate'
import { DialogAddSecurityOperators } from './DialogAddSecurityOperators'
import { DialogAddSecurityOperatorKey } from './DialogAddSecurityOperatorKey'
import { DialogRejectAgreement } from './DialogRejectAgreement'
import { DialogAddClientToPurpose } from './DialogAddClientToPurpose'
import { DialogCreateNewAttribute } from './DialogCreateNewAttribute'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { DialogError } from './DialogError'
import { useDialogStore } from '@/stores'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onShowAttributeDetails: (props: DialogAttributeDetailsProps) => T,
  onShowSessionExpired: (props: DialogSessionExpiredProps) => T,
  onUpdatePurposeDailyCalls: (props: DialogUpdatePurposeDailyCallsProps) => T,
  onSetPurposeExpectedApprovalDate: (props: DialogSetPurposeExpectedApprovalDateProps) => T,
  onAddSecurityOperator: (props: DialogAddSecurityOperatorsProps) => T,
  onAddSecurityOperatorKey: (props: DialogAddSecurityOperatorKeyProps) => T,
  onRejectAgreement: (props: DialogRejectAgreementProps) => T,
  onAddClientToPurpose: (props: DialogAddClientToPurposeProps) => T,
  onCreateNewAttribute: (props: DialogCreateNewAttributeProps) => T
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
      case 'rejectAgreement':
        return onRejectAgreement(props)
      case 'addClientToPurpose':
        return onAddClientToPurpose(props)
      case 'createNewAttribute':
        return onCreateNewAttribute(props)
    }
  }
}

const _Dialog = match(
  (props) => <DialogBasic {...props} />,
  (props) => <DialogAttributeDetails {...props} />,
  (props) => <DialogSessionExpired {...props} />,
  (props) => <DialogUpdatePurposeDailyCalls {...props} />,
  (props) => <DialogSetPurposeExpectedApprovalDate {...props} />,
  (props) => <DialogAddSecurityOperators {...props} />,
  (props) => <DialogAddSecurityOperatorKey {...props} />,
  (props) => <DialogRejectAgreement {...props} />,
  (props) => <DialogAddClientToPurpose {...props} />,
  (props) => <DialogCreateNewAttribute {...props} />
)

export const Dialog: React.FC = () => {
  const dialog = useDialogStore((state) => state.dialog)
  if (!dialog) return null

  return (
    <ErrorBoundary FallbackComponent={DialogError}>
      <_Dialog {...dialog} />
    </ErrorBoundary>
  )
}

import React from 'react'
import { DialogBasic } from './DialogBasic'
import { DialogAttributeDetails } from './DialogAttributeDetails'
import { DialogSessionExpired } from './DialogSessionExpired'
import type {
  DialogAttributeDetailsProps,
  DialogBasicProps,
  DialogDeleteOperatorProps,
  DialogClonePurposeProps,
  DialogProps,
  DialogRejectAgreementProps,
  DialogRejectPurposeVersionProps,
  DialogRemoveOperatorFromClientProps,
  DialogRevokeCertifiedAttributeProps,
  DialogSessionExpiredProps,
  DialogUpgradeAgreementVersionProps,
  DialogSetTenantMailProps,
  DialogDelegationsProps,
  DialogAcceptProducerDelegationProps,
  DialogRejectProducerDelegationProps,
  DialogRevokeProducerDelegationProps,
} from '@/types/dialog.types'
import { DialogRejectAgreement } from './DialogRejectAgreement'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { DialogError } from './DialogError'
import { useDialogStore } from '@/stores'
import { DialogUpgradeAgreementVersion } from './DialogUpgradeAgreementVersion'
import { DialogRemoveOperatorFromClient } from './DialogRemoveOperatorFromClient'
import { DialogDeleteOperator } from './DialogDeleteOperator'
import { DialogRevokeCertifiedAttribute } from './DialogRevokeCertifiedAttribute'
import { DialogClonePurpose } from './DialogClonePurpose/DialogClonePurpose'
import { DialogRejectPurposeVersion } from './DialogRejectPurposeVersion'
import { DialogSetTenantMail } from './DialogSetTenantMail'
import { DialogDelegations } from './DialogDelegations'
import { DialogAcceptProducerDelegation } from './DialogAcceptProducerDelegation'
import { DialogRejectProducerDelegation } from './DialogRejectProducerDelegation'
import { DialogRevokeProducerDelegation } from './DialogRevokeProducerDelegation'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onShowAttributeDetails: (props: DialogAttributeDetailsProps) => T,
  onShowSessionExpired: (props: DialogSessionExpiredProps) => T,
  onRejectAgreement: (props: DialogRejectAgreementProps) => T,
  onUpgradeAgreementVersion: (props: DialogUpgradeAgreementVersionProps) => T,
  onDeleteOperator: (props: DialogDeleteOperatorProps) => T,
  onRemoveOperatorFromClient: (props: DialogRemoveOperatorFromClientProps) => T,
  onRevokeCertifiedAttribute: (props: DialogRevokeCertifiedAttributeProps) => T,
  onClonePurpose: (props: DialogClonePurposeProps) => T,
  onRejectPurposeVersion: (props: DialogRejectPurposeVersionProps) => T,
  onSetTenantMail: (props: DialogSetTenantMailProps) => T,
  onDelegations: (props: DialogDelegationsProps) => T,
  onAcceptDelegation: (props: DialogAcceptProducerDelegationProps) => T,
  onRejectDelegation: (props: DialogRejectProducerDelegationProps) => T,
  onRevokeDelegation: (props: DialogRevokeProducerDelegationProps) => T
) {
  return (props: DialogProps) => {
    switch (props.type) {
      case 'basic':
        return onBasic(props)
      case 'showAttributeDetails':
        return onShowAttributeDetails(props)
      case 'sessionExpired':
        return onShowSessionExpired(props)
      case 'rejectAgreement':
        return onRejectAgreement(props)
      case 'upgradeAgreementVersion':
        return onUpgradeAgreementVersion(props)
      case 'deleteOperator':
        return onDeleteOperator(props)
      case 'removeOperatorFromClient':
        return onRemoveOperatorFromClient(props)
      case 'revokeCertifiedAttribute':
        return onRevokeCertifiedAttribute(props)
      case 'clonePurpose':
        return onClonePurpose(props)
      case 'rejectPurposeVersion':
        return onRejectPurposeVersion(props)
      case 'setTenantMail':
        return onSetTenantMail(props)
      case 'delegations':
        return onDelegations(props)
      case 'acceptDelegation':
        return onAcceptDelegation(props)
      case 'rejectDelegation':
        return onRejectDelegation(props)
      case 'revokeDelegation':
        return onRevokeDelegation(props)
    }
  }
}

const _Dialog = match(
  (props) => <DialogBasic {...props} />,
  (props) => <DialogAttributeDetails {...props} />,
  (props) => <DialogSessionExpired {...props} />,
  (props) => <DialogRejectAgreement {...props} />,
  (props) => <DialogUpgradeAgreementVersion {...props} />,
  (props) => <DialogDeleteOperator {...props} />,
  (props) => <DialogRemoveOperatorFromClient {...props} />,
  (props) => <DialogRevokeCertifiedAttribute {...props} />,
  (props) => <DialogClonePurpose {...props} />,
  (props) => <DialogRejectPurposeVersion {...props} />,
  (props) => <DialogSetTenantMail {...props} />,
  (props) => <DialogDelegations {...props} />,
  (props) => <DialogAcceptProducerDelegation {...props} />,
  (props) => <DialogRejectProducerDelegation {...props} />,
  (props) => <DialogRevokeProducerDelegation {...props} />
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

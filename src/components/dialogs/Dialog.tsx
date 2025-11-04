import React from 'react'
import { DialogBasic } from './DialogBasic'
import { DialogAttributeDetails } from './DialogAttributeDetails'
import { DialogSessionExpired } from './DialogSessionExpired'
import { DialogDeleteAnnotation } from './DialogDeleteAnnotation'
import type {
  DialogAttributeDetailsProps,
  DialogBasicProps,
  DialogDeleteOperatorProps,
  DialogDeleteAnnotationProps,
  DialogClonePurposeProps,
  DialogProps,
  DialogRejectAgreementProps,
  DialogRejectPurposeVersionProps,
  DialogRemoveOperatorFromClientProps,
  DialogRevokeCertifiedAttributeProps,
  DialogSessionExpiredProps,
  DialogUpgradeAgreementVersionProps,
  DialogSetTenantMailProps,
  DialogRemoveUserFromKeychainProps,
  DialogDeleteProducerKeychainKeyProps,
  DialogAcceptDelegationProps,
  DialogRejectDelegationProps,
  DialogCreateAgreementDraftProps,
  DialogRejectDelegatedVersionDraftProps,
  DialogRevokeDelegationProps,
  DialogTenantKindEserviceTemplateProps,
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
import { DialogRemoveUserFromKeychain } from './DialogRemoveUserFromKeychain'
import { DialogDeleteProducerKeychainKey } from './DialogDeleteProducerKeychainKey'
import { DialogAcceptDelegation } from './DialogAcceptDelegation'
import { DialogRejectDelegation } from './DialogRejectDelegation'
import { DialogRevokeDelegation } from './DialogRevokeDelegation'
import { DialogRejectDelegatedVersionDraft } from './DialogRejectDelegatedVersionDraft'
import { DialogCreateAgreementDraft } from './DialogCreateAgreementDraft/DialogCreateAgreementDraft'
import { DialogTenantKindEserviceTemplate } from './DialogTenantKindEserviceTemplate'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onShowAttributeDetails: (props: DialogAttributeDetailsProps) => T,
  onShowSessionExpired: (props: DialogSessionExpiredProps) => T,
  onRejectAgreement: (props: DialogRejectAgreementProps) => T,
  onUpgradeAgreementVersion: (props: DialogUpgradeAgreementVersionProps) => T,
  onDeleteOperator: (props: DialogDeleteOperatorProps) => T,
  onDeleteAnnotation: (props: DialogDeleteAnnotationProps) => T,
  onRemoveOperatorFromClient: (props: DialogRemoveOperatorFromClientProps) => T,
  onRevokeCertifiedAttribute: (props: DialogRevokeCertifiedAttributeProps) => T,
  onClonePurpose: (props: DialogClonePurposeProps) => T,
  onRejectPurposeVersion: (props: DialogRejectPurposeVersionProps) => T,
  onSetTenantMail: (props: DialogSetTenantMailProps) => T,
  onRemoveUserFromKeychain: (props: DialogRemoveUserFromKeychainProps) => T,
  onDeleteProducerKeychainKey: (props: DialogDeleteProducerKeychainKeyProps) => T,
  onAcceptDelegation: (props: DialogAcceptDelegationProps) => T,
  onRejectDelegation: (props: DialogRejectDelegationProps) => T,
  onCreateAgreementDraft: (props: DialogCreateAgreementDraftProps) => T,
  onRevokeDelegation: (props: DialogRevokeDelegationProps) => T,
  onRejectDelegatedVersionDraft: (props: DialogRejectDelegatedVersionDraftProps) => T,
  onDialogTenantKindEserviceTemplate: (props: DialogTenantKindEserviceTemplateProps) => T
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
      case 'deleteAnnotation':
        return onDeleteAnnotation(props)
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
      case 'removeUserFromKeychain':
        return onRemoveUserFromKeychain(props)
      case 'deleteProducerKeychainKey':
        return onDeleteProducerKeychainKey(props)
      case 'acceptDelegation':
        return onAcceptDelegation(props)
      case 'rejectDelegation':
        return onRejectDelegation(props)
      case 'revokeDelegation':
        return onRevokeDelegation(props)
      case 'rejectDelegatedVersionDraft':
        return onRejectDelegatedVersionDraft(props)
      case 'createAgreementDraft':
        return onCreateAgreementDraft(props)
      case 'tenantKind':
        return onDialogTenantKindEserviceTemplate(props)
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
  (props) => <DialogDeleteAnnotation {...props} />,
  (props) => <DialogRemoveOperatorFromClient {...props} />,
  (props) => <DialogRevokeCertifiedAttribute {...props} />,
  (props) => <DialogClonePurpose {...props} />,
  (props) => <DialogRejectPurposeVersion {...props} />,
  (props) => <DialogSetTenantMail {...props} />,
  (props) => <DialogRemoveUserFromKeychain {...props} />,
  (props) => <DialogDeleteProducerKeychainKey {...props} />,
  (props) => <DialogAcceptDelegation {...props} />,
  (props) => <DialogRejectDelegation {...props} />,
  (props) => <DialogCreateAgreementDraft {...props} />,
  (props) => <DialogRevokeDelegation {...props} />,
  (props) => <DialogRejectDelegatedVersionDraft {...props} />,
  (props) => <DialogTenantKindEserviceTemplate {...props} />
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

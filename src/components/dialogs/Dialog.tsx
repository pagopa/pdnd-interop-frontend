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
  DialogSetTenantMailProps,
  DialogRemoveUserFromKeychainProps,
  DialogDeleteProducerKeychainKeyProps,
  DialogAcceptDelegationProps,
  DialogRejectDelegationProps,
  DialogRejectDelegatedVersionDraftProps,
  DialogRevokeDelegationProps,
  DialogTenantKindEserviceTemplateProps,
  DialogTenantKindPurposeTemplateProps,
  DialogRequestPurposeApprovalProps,
  DialogRequestRiskAnalysisCompilationProps,
  DialogEditRiskAnalysisAssignmentProps,
  DialogApproveRiskAnalysisProps,
  DialogRejectRiskAnalysisProps,
  DialogShowEserviceVersionsListProps,
  DialogArchiveEserviceProps,
  DialogCancelEserviceArchivingProps,
  DialogSuspendArchivingEserviceProps,
  DialogReactivateArchivingEserviceProps,
  DialogSuspendArchivingDescriptorProps,
  DialogReactivateArchivingDescriptorProps,
  DialogArchiveVersionProps,
  DialogCancelVersionArchivingProps,
  DialogBlockArchivingRequestProps,
  DialogDelegatorConfirmArchivingProps,
  DialogDelegatorRejectArchivingProps,
  DialogCreateAgreementProps,
  DialogEditAgreementProps,
  DialogInspectAgreementProps,
  DialogUpdateAgreementProps,
} from '@/types/dialog.types'
import { DialogRejectAgreement } from './DialogRejectAgreement'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { DialogError } from './DialogError'
import { useDialogStore } from '@/stores'
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
import { DialogTenantKindEserviceTemplate } from './DialogTenantKindEserviceTemplate'
import { DialogTenantKindPurposeTemplate } from './DialogTenantKindPurposeTemplate'
import { DialogRequestPurposeApproval } from './DialogRequestPurposeApproval'
import { DialogRequestRiskAnalysisCompilation } from './DialogRequestRiskAnalysisCompilation'
import { DialogEditRiskAnalysisAssignment } from './DialogEditRiskAnalysisAssignment'
import { DialogApproveRiskAnalysis } from './DialogApproveRiskAnalysis'
import { DialogRejectRiskAnalysis } from './DialogRejectRiskAnalysis'
import { DialogShowEserviceVersionsList } from './DialogShowEserviceVersionsList/DialogShowEserviceVersionsList'
import DialogArchiveEservice from './DialogArchiveEservice'
import DialogCancelEserviceArchiving from './DialogCancelEserviceArchiving'
import { DialogSuspendArchivingEservice } from './DialogSuspendArchivingEservice'
import { DialogReactivateArchivingEservice } from './DialogReactivateArchivingEservice'
import { DialogSuspendArchivingDescriptor } from './DialogSuspendArchivingDescriptor'
import { DialogReactivateArchivingDescriptor } from './DialogReactivateArchivingDescriptor'
import { DialogArchiveVersion } from './DialogArchiveVersion'
import { DialogCancelVersionArchiving } from './DialogCancelVersionArchiving'
import { DialogBlockArchivingRequest } from './DialogBlockArchivingRequest'
import DialogDelegatorConfirmArchiving from './DialogDelegatorConfirmArchiving'
import DialogDelegatorRejectArchiving from './DialogDelegatorRejectArchiving'
import { DialogCreateAgreement } from './DialogAgreements/DialogCreateAgreement'
import { DialogEditAgreement } from './DialogAgreements/DialogEditAgreement'
import { DialogInspectAgreement } from './DialogAgreements/DialogInspectAgreement'
import { DialogUpdateAgreement } from './DialogAgreements/DialogUpdateAgreement'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onShowAttributeDetails: (props: DialogAttributeDetailsProps) => T,
  onShowSessionExpired: (props: DialogSessionExpiredProps) => T,
  onRejectAgreement: (props: DialogRejectAgreementProps) => T,
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
  onRevokeDelegation: (props: DialogRevokeDelegationProps) => T,
  onRejectDelegatedVersionDraft: (props: DialogRejectDelegatedVersionDraftProps) => T,
  onDialogTenantKindEserviceTemplate: (props: DialogTenantKindEserviceTemplateProps) => T,
  onDialogTenantKindPurposeTemplate: (props: DialogTenantKindPurposeTemplateProps) => T,
  onRequestPurposeApproval: (props: DialogRequestPurposeApprovalProps) => T,
  onRequestRiskAnalysisCompilation: (props: DialogRequestRiskAnalysisCompilationProps) => T,
  onEditRiskAnalysisAssignment: (props: DialogEditRiskAnalysisAssignmentProps) => T,
  onApproveRiskAnalysis: (props: DialogApproveRiskAnalysisProps) => T,
  onRejectRiskAnalysis: (props: DialogRejectRiskAnalysisProps) => T,
  onShowEserviceVersionsList: (props: DialogShowEserviceVersionsListProps) => T,
  onArchiveEservice: (props: DialogArchiveEserviceProps) => T,
  onCancelEserviceArchiving: (props: DialogCancelEserviceArchivingProps) => T,
  onSuspendArchivingEservice: (props: DialogSuspendArchivingEserviceProps) => T,
  onReactivateArchivingEservice: (props: DialogReactivateArchivingEserviceProps) => T,
  onSuspendArchivingDescriptor: (props: DialogSuspendArchivingDescriptorProps) => T,
  onReactivateArchivingDescriptor: (props: DialogReactivateArchivingDescriptorProps) => T,
  onArchiveVersion: (props: DialogArchiveVersionProps) => T,
  onCancelVersionArchiving: (props: DialogCancelVersionArchivingProps) => T,
  onBlockArchivingRequest: (props: DialogBlockArchivingRequestProps) => T,
  onDelegatorConfirmArchiving: (props: DialogDelegatorConfirmArchivingProps) => T,
  onDelegatorRejectArchiving: (props: DialogDelegatorRejectArchivingProps) => T,
  onCreateAgreement: (props: DialogCreateAgreementProps) => T,
  onEditAgreement: (props: DialogEditAgreementProps) => T,
  onInspectAgreement: (props: DialogInspectAgreementProps) => T,
  onUpdateAgreement: (props: DialogUpdateAgreementProps) => T
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
      case 'tenantKindEServiceTemplate':
        return onDialogTenantKindEserviceTemplate(props)
      case 'tenantKindPurposeTemplate':
        return onDialogTenantKindPurposeTemplate(props)
      case 'requestPurposeApproval':
        return onRequestPurposeApproval(props)
      case 'requestRiskAnalysisCompilation':
        return onRequestRiskAnalysisCompilation(props)
      case 'editRiskAnalysisAssignment':
        return onEditRiskAnalysisAssignment(props)
      case 'approveRiskAnalysis':
        return onApproveRiskAnalysis(props)
      case 'rejectRiskAnalysis':
        return onRejectRiskAnalysis(props)
      case 'showEserviceVersionsList':
        return onShowEserviceVersionsList(props)
      case 'archiveEservice':
        return onArchiveEservice(props)
      case 'cancelEserviceArchiving':
        return onCancelEserviceArchiving(props)
      case 'suspendArchivingEservice':
        return onSuspendArchivingEservice(props)
      case 'reactivateArchivingEservice':
        return onReactivateArchivingEservice(props)
      case 'suspendArchivingDescriptor':
        return onSuspendArchivingDescriptor(props)
      case 'reactivateArchivingDescriptor':
        return onReactivateArchivingDescriptor(props)
      case 'archiveVersion':
        return onArchiveVersion(props)
      case 'cancelVersionArchiving':
        return onCancelVersionArchiving(props)
      case 'blockArchivingRequest':
        return onBlockArchivingRequest(props)
      case 'delegatorConfirmArchiving':
        return onDelegatorConfirmArchiving(props)
      case 'delegatorRejectArchiving':
        return onDelegatorRejectArchiving(props)
      case 'createAgreement':
        return onCreateAgreement(props)
      case 'editAgreement':
        return onEditAgreement(props)
      case 'inspectAgreement':
        return onInspectAgreement(props)
      case 'updateAgreement':
        return onUpdateAgreement(props)
    }
  }
}

const _Dialog = match(
  (props) => <DialogBasic {...props} />,
  (props) => <DialogAttributeDetails {...props} />,
  (props) => <DialogSessionExpired {...props} />,
  (props) => <DialogRejectAgreement {...props} />,
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
  (props) => <DialogRevokeDelegation {...props} />,
  (props) => <DialogRejectDelegatedVersionDraft {...props} />,
  (props) => <DialogTenantKindEserviceTemplate {...props} />,
  (props) => <DialogTenantKindPurposeTemplate {...props} />,
  (props) => <DialogRequestPurposeApproval {...props} />,
  (props) => <DialogRequestRiskAnalysisCompilation {...props} />,
  (props) => <DialogEditRiskAnalysisAssignment {...props} />,
  (props) => <DialogApproveRiskAnalysis {...props} />,
  (props) => <DialogRejectRiskAnalysis {...props} />,
  (props) => <DialogShowEserviceVersionsList {...props} />,
  (props) => <DialogArchiveEservice {...props} />,
  (props) => <DialogCancelEserviceArchiving {...props} />,
  (props) => <DialogSuspendArchivingEservice {...props} />,
  (props) => <DialogReactivateArchivingEservice {...props} />,
  (props) => <DialogSuspendArchivingDescriptor {...props} />,
  (props) => <DialogReactivateArchivingDescriptor {...props} />,
  (props) => <DialogArchiveVersion {...props} />,
  (props) => <DialogCancelVersionArchiving {...props} />,
  () => <DialogBlockArchivingRequest />,
  (props) => <DialogDelegatorConfirmArchiving {...props} />,
  (props) => <DialogDelegatorRejectArchiving {...props} />,
  (props) => <DialogCreateAgreement {...props} />,
  (props) => <DialogEditAgreement {...props} />,
  (props) => <DialogInspectAgreement {...props} />,
  (props) => <DialogUpdateAgreement {...props} />
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

import { DecoratedPurpose, PurposeListingItem } from '@/types/purpose.types'
import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/stores'
import { useTranslation } from 'react-i18next'
import { ActionItem } from '@/types/common.types'
import { useJwt } from './useJwt'
import { checkPurposeSuspendedByConsumer } from '@/utils/purpose.utils'

function useGetConsumerPurposesActions(purpose?: DecoratedPurpose | PurposeListingItem) {
  const { t } = useTranslation('purpose', { keyPrefix: 'tablePurpose.actions' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { jwt } = useJwt()

  const { mutate: archivePurpose } = PurposeMutations.useArchiveVersion()
  const { mutate: suspendPurpose } = PurposeMutations.useSuspendVersion()
  const { mutate: activatePurpose } = PurposeMutations.useActivateVersion()
  const { mutate: deletePurposeDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: deletePurposeVersion } = PurposeMutations.useDeleteVersion()
  const { openDialog } = useDialog()

  if (!purpose) return { actions: [] }

  function handleArchive() {
    if (!purpose) return
    const currentVersion = purpose.currentVersion
    if (currentVersion) {
      archivePurpose({ purposeId: purpose.id, versionId: currentVersion.id })
    }
  }

  const archiveAction = {
    label: tCommon('archive'),
    action: handleArchive,
  }

  function handleSuspend() {
    if (!purpose) return
    const currentVersion = purpose.currentVersion
    if (currentVersion) {
      suspendPurpose({ purposeId: purpose.id, versionId: currentVersion.id })
    }
  }

  const suspendAction = {
    label: tCommon('suspend'),
    action: handleSuspend,
  }

  function handleActivate() {
    if (!purpose) return
    const currentVersion = purpose.currentVersion
    if (currentVersion) {
      activatePurpose({ purposeId: purpose.id, versionId: currentVersion.id })
    }
  }

  const activateAction = {
    label: tCommon('activate'),
    action: handleActivate,
  }

  function handleDeleteDraft() {
    if (!purpose) return
    deletePurposeDraft({ purposeId: purpose.id })
  }

  const deleteAction = {
    label: tCommon('delete'),
    action: handleDeleteDraft,
  }

  function handleDeleteDailyCallsUpdate() {
    if (!purpose?.waitingForApprovalVersion) return
    deletePurposeVersion({ purposeId: purpose.id, versionId: purpose.waitingForApprovalVersion.id })
  }

  const deleteDailyCallsUpdateAction = {
    label: t('deleteDailyCallsUpdate'),
    action: handleDeleteDailyCallsUpdate,
  }

  function handleUpdateDailyCalls() {
    if (!purpose?.currentVersion) return
    openDialog({
      type: 'updatePurposeDailyCalls',
      purposeId: purpose.id,
      dailyCalls: purpose.currentVersion?.dailyCalls,
    })
  }

  const updateDailyCallsAction = {
    label: t('updateDailyCalls'),
    action: handleUpdateDailyCalls,
  }

  // TODO: commento
  if (!purpose.currentVersion && purpose.waitingForApprovalVersion) {
    return { actions: [deleteAction] }
  }

  if (purpose?.currentVersion?.state === 'ARCHIVED') {
    return { actions: [] }
  }

  if (purpose?.currentVersion?.state === 'DRAFT') {
    return { actions: [activateAction, deleteAction] }
  }

  // If the currentVestion is not ARCHIVED or in DRAFT...

  const actions: Array<ActionItem> = [archiveAction]

  if (purpose?.waitingForApprovalVersion) {
    actions.push(deleteDailyCallsUpdateAction)
  }

  if (!purpose.waitingForApprovalVersion) {
    actions.push(updateDailyCallsAction)
  }

  const isSuspended = purpose?.currentVersion && purpose?.currentVersion.state === 'SUSPENDED'
  const isActive = purpose?.currentVersion && purpose?.currentVersion.state === 'ACTIVE'

  const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(purpose, jwt?.organizationId)

  if (isActive || (isSuspended && !isSuspendedByConsumer)) {
    actions.push(suspendAction)
  }

  if (isSuspended && isSuspendedByConsumer) {
    actions.push(activateAction)
  }

  return { actions }
}

export default useGetConsumerPurposesActions

import { DecoratedPurpose, PurposeState } from '@/types/purpose.types'
import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/contexts'
import { useTranslation } from 'react-i18next'
import { ActionItem } from '@/types/common.types'

function useGetPurposesActions(purpose?: DecoratedPurpose) {
  const { t } = useTranslation('purpose', { keyPrefix: 'tablePurpose.actions' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
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
    if (!purpose) return
    const mostRecentVersion = purpose.mostRecentVersion
    if (mostRecentVersion) {
      deletePurposeVersion({ purposeId: purpose.id, versionId: mostRecentVersion.id })
    }
  }

  const deleteDailyCallsUpdateAction = {
    label: t('deleteDailyCallsUpdate'),
    action: handleDeleteDailyCallsUpdate,
  }

  function handleUpdateDailyCalls() {
    if (!purpose) return
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

  const availableActions: Record<PurposeState, Array<ActionItem>> = {
    DRAFT: purpose.mostRecentVersion ? [activateAction, deleteAction] : [deleteAction],
    ACTIVE: [suspendAction, updateDailyCallsAction],
    SUSPENDED: [activateAction, archiveAction, updateDailyCallsAction],
    WAITING_FOR_APPROVAL: [
      purpose.versions.length > 1 ? deleteDailyCallsUpdateAction : deleteAction,
    ],
    ARCHIVED: [],
  }

  const status = purpose.mostRecentVersion ? purpose.mostRecentVersion.state : 'DRAFT'
  const actions = availableActions[status]

  if (purpose.mostRecentVersion?.state === 'WAITING_FOR_APPROVAL') {
    if (purpose.mostRecentVersion.id !== purpose.currentVersion?.id) {
      actions.push(...availableActions[purpose.currentVersion?.state ?? 'DRAFT'])
    } else {
      actions.push(updateDailyCallsAction)
    }
  }

  return { actions }
}

export default useGetPurposesActions

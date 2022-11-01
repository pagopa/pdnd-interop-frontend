import { DecoratedPurpose, PurposeState } from '@/types/purpose.types'
import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/contexts'
import { useTranslation } from 'react-i18next'
import { ActionItem } from '@/types/common.types'

type UseGetPurposesActionsConfig = {
  inEService: boolean
}

function useGetPurposesActions(purpose: DecoratedPurpose, config?: UseGetPurposesActionsConfig) {
  const { t } = useTranslation('purpose', { keyPrefix: 'tablePurpose.actions' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { mutate: archivePurpose } = PurposeMutations.useArchiveVersion()
  const { mutate: suspendPurpose } = PurposeMutations.useSuspendVersion()
  const { mutate: activatePurpose } = PurposeMutations.useActivateVersion()
  const { mutate: deletePurposeDraft } = PurposeMutations.useDeleteDraft()
  const { mutate: deletePurposeVersion } = PurposeMutations.useDeleteVersion()
  const { openDialog } = useDialog()

  function handleArchive() {
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
    deletePurposeDraft({ purposeId: purpose.id })
  }

  const deleteAction = {
    label: tCommon('delete'),
    action: handleDeleteDraft,
  }

  function handleDeleteDailyCallsUpdate() {
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
    openDialog({ type: 'updatePurposeDailyCalls', purposeId: purpose.id })
  }

  const updateDailyCallsAction = {
    label: t('updateDailyCalls'),
    action: handleUpdateDailyCalls,
  }

  const hasVersion = Boolean(purpose.mostRecentVersion)

  const availableActions: Record<PurposeState, Array<ActionItem>> = {
    DRAFT: hasVersion ? [activateAction, deleteAction] : [deleteAction],
    ACTIVE: [suspendAction, updateDailyCallsAction],
    SUSPENDED: [activateAction, archiveAction],
    WAITING_FOR_APPROVAL: [
      purpose.versions.length > 1 ? deleteDailyCallsUpdateAction : deleteAction,
    ],
    ARCHIVED: [],
  }

  const status = hasVersion && purpose.mostRecentVersion ? purpose.mostRecentVersion.state : 'DRAFT'

  return { actions: availableActions[status] }
}

export default useGetPurposesActions

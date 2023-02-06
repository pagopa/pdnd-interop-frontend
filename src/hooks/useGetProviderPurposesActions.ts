import { DecoratedPurpose, PurposeListingItem } from '@/types/purpose.types'
import { PurposeMutations } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import { ActionItem } from '@/types/common.types'
import { useDialog } from '@/stores'

function useGetProviderPurposesActions(purpose?: DecoratedPurpose | PurposeListingItem) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { openDialog } = useDialog()
  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()
  const { mutate: suspendVersion } = PurposeMutations.useSuspendVersion()

  const waitingForApprovalVersion = purpose?.waitingForApprovalVersion
  const currentVersion = purpose?.currentVersion

  const actions: Array<ActionItem> = []

  if (!purpose || purpose?.currentVersion?.state === 'ARCHIVED') {
    return { actions }
  }

  if (waitingForApprovalVersion) {
    actions.push(
      {
        action: () =>
          activateVersion({ purposeId: purpose.id, versionId: waitingForApprovalVersion.id }),
        label: t('confirmUpdate'),
      },
      {
        action: () =>
          openDialog({
            type: 'setPurposeExpectedApprovalDate',
            purposeId: purpose.id,
            versionId: waitingForApprovalVersion.id,
            approvalDate: waitingForApprovalVersion.expectedApprovalDate,
          }),
        label: t('updateCompletionDate'),
      }
    )
  }

  const isSuspended = currentVersion && currentVersion.state === 'SUSPENDED'
  const isSuspendedByProvider = purpose.suspendedByProducer

  if (currentVersion && (!isSuspended || (isSuspended && !isSuspendedByProvider))) {
    actions.push({
      action: () => suspendVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('suspend'),
    })
  }

  if (isSuspended && isSuspendedByProvider) {
    actions.push({
      action: () => activateVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('activate'),
    })
  }

  return { actions }
}

export default useGetProviderPurposesActions

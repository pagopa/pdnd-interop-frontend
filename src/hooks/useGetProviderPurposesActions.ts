import { DecoratedPurpose, PurposeListingItem } from '@/types/purpose.types'
import { PurposeMutations } from '@/api/purpose'
import { useDialog } from '@/contexts'
import { useTranslation } from 'react-i18next'
import { ActionItem } from '@/types/common.types'

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
          }),
        label: t('updateCompletionDate'),
      }
    )
  }

  if (currentVersion && currentVersion.state === 'ACTIVE') {
    actions.push({
      action: () => suspendVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('suspend'),
    })
  }

  if (currentVersion && currentVersion.state === 'SUSPENDED') {
    actions.push({
      action: () => activateVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('activate'),
    })
  }

  return { actions }
}

export default useGetProviderPurposesActions

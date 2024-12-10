import { PurposeMutations } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { useDialog } from '@/stores'
import { useGetDelegationUserRole } from './useGetDelegationUserRole'

function useGetProviderPurposesActions(purpose?: Purpose) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { isAdmin, jwt } = AuthHooks.useJwt()

  const { isDelegator } = useGetDelegationUserRole({
    eserviceId: purpose?.eservice.id,
    organizationId: jwt?.organizationId,
  })

  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()
  const { mutate: suspendVersion } = PurposeMutations.useSuspendVersion()

  const { openDialog } = useDialog()

  const currentVersion = purpose?.currentVersion
  const waitingForApprovalVersion = purpose?.waitingForApprovalVersion

  const actions: Array<ActionItemButton> = []

  if (
    !purpose ||
    purpose?.currentVersion?.state === 'ARCHIVED' ||
    !isAdmin ||
    !!purpose.rejectedVersion ||
    isDelegator
  ) {
    return { actions }
  }

  const isSuspended = currentVersion && currentVersion.state === 'SUSPENDED'
  const isSuspendedByProvider = purpose.suspendedByProducer
  const isNewPurpose = !currentVersion && !!waitingForApprovalVersion

  if (currentVersion && (!isSuspended || (isSuspended && !isSuspendedByProvider))) {
    actions.push({
      action: () => suspendVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('suspend'),
      color: 'error',
      icon: PauseCircleOutlineIcon,
    })
  }

  if (isSuspended && isSuspendedByProvider) {
    actions.push({
      action: () => activateVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('activate'),
      color: 'primary',
      icon: PlayCircleOutlineIcon,
    })
  }

  if (isNewPurpose) {
    actions.push(
      {
        action: () =>
          openDialog({
            type: 'rejectPurposeVersion',
            purposeId: purpose.id,
            versionId: waitingForApprovalVersion.id,
            isChangePlanRequest: false,
          }),
        label: t('reject'),
        color: 'error',
        icon: CloseIcon,
      },
      {
        action: () =>
          activateVersion({ purposeId: purpose.id, versionId: waitingForApprovalVersion.id }),
        label: t('activate'),
        color: 'primary',
        icon: PlayCircleOutlineIcon,
      }
    )
  }

  return { actions }
}

export default useGetProviderPurposesActions

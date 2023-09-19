import { PurposeMutations } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

function useGetProviderPurposesActions(purpose?: Purpose) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { isAdmin } = AuthHooks.useJwt()

  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()
  const { mutate: suspendVersion } = PurposeMutations.useSuspendVersion()

  const currentVersion = purpose?.currentVersion

  const actions: Array<ActionItemButton> = []

  if (!purpose || purpose?.currentVersion?.state === 'ARCHIVED' || !isAdmin) {
    return { actions }
  }

  const isSuspended = currentVersion && currentVersion.state === 'SUSPENDED'
  const isSuspendedByProvider = purpose.suspendedByProducer

  if (currentVersion && (!isSuspended || (isSuspended && !isSuspendedByProvider))) {
    actions.push({
      action: () => suspendVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('suspend'),
      color: 'error',
      icon: PauseCircleOutlineIcon,
      variant: 'naked',
    })
  }

  if (isSuspended && isSuspendedByProvider) {
    actions.push({
      action: () => activateVersion({ purposeId: purpose.id, versionId: currentVersion.id }),
      label: t('activate'),
      color: 'primary',
      icon: PlayCircleOutlineIcon,
      variant: 'naked',
    })
  }

  return { actions }
}

export default useGetProviderPurposesActions

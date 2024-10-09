import { AuthHooks } from '@/api/auth'
import { useDialog } from '@/stores'
import { useTranslation } from 'react-i18next'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import type { ActionItemButton } from '@/types/common.types'

export function useGetProducerKeychainUserActions({
  keychainId,
  userId,
}: {
  keychainId: string
  userId: string
}) {
  const { t } = useTranslation('keychain', { keyPrefix: 'user' })
  const { openDialog } = useDialog()

  const { jwt, isAdmin } = AuthHooks.useJwt()

  const handleOpenDeleteUserDialog = () => {
    if (!jwt?.selfcareId) return

    openDialog({
      type: 'deleteOperator',
      selfcareId: jwt.selfcareId,
      userId,
    })
  }

  const handleOpenRemoveUserFromKeychainDialog = () => {
    openDialog({
      type: 'removeUserFromKeychain',
      keychainId,
      userId,
    })
  }

  const actions: Array<ActionItemButton> = [
    {
      action: handleOpenRemoveUserFromKeychainDialog,
      label: t('actions.removeFromKeychain.label'),
      color: 'error',
      icon: RemoveCircleOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.removeFromKeychain.tooltip') : undefined,
    },
    {
      action: handleOpenDeleteUserDialog,
      label: t('actions.delete.label'),
      color: 'error',
      icon: DeleteOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.delete.tooltip') : undefined,
    },
  ]

  return { actions }
}

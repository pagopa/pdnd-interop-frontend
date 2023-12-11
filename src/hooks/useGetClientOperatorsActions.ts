import { AuthHooks } from '@/api/auth'
import { useDialog } from '@/stores'
import { useTranslation } from 'react-i18next'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import type { ActionItemButton } from '@/types/common.types'

/**
 * This hook returns the actions regardless if the user is admin or not.
 * This is because the OperatorDetails page shows the actions even if the user is not an admin.
 * The actions buttons in this case are disabled.
 */
export function useGetClientOperatorsActions(userId: string, clientId: string) {
  const { t } = useTranslation('user')
  const { openDialog } = useDialog()

  const { isAdmin, jwt } = AuthHooks.useJwt()

  const handleOpenDeleteDialog = () => {
    if (!jwt?.selfcareId) return
    if (!isAdmin) throw new Error('User is not admin and cannot delete operator')

    openDialog({
      type: 'deleteOperator',
      selfcareId: jwt.selfcareId,
      userId,
    })
  }

  const handleOpenRemoveOperatorFromClientDialog = () => {
    if (!isAdmin) throw new Error('User is not admin and cannot remove operator from client')

    openDialog({
      type: 'removeOperatorFromClient',
      clientId: clientId,
      userId,
    })
  }

  const actions: Array<ActionItemButton> = [
    {
      action: handleOpenRemoveOperatorFromClientDialog,
      label: t('actions.removeFromClient.label'),
      color: 'error',
      icon: RemoveCircleOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.removeFromClient.tooltip') : undefined,
    },
    {
      action: handleOpenDeleteDialog,
      label: t('actions.delete.label'),
      color: 'error',
      icon: DeleteOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.delete.tooltip') : undefined,
    },
  ]

  return { actions }
}

import type { CompactDelegation, Delegation, DelegationKind } from '@/api/api.generatedTypes'
import { useDialog } from '@/stores'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import GradingIcon from '@mui/icons-material/Grading'
import CloseIcon from '@mui/icons-material/Close'
import { AuthHooks } from '@/api/auth'

export function useGetDelegationActions(delegation: Delegation | CompactDelegation | undefined) {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { openDialog } = useDialog()
  const { jwt } = AuthHooks.useJwt()

  const delegationKind = 'DELEGATED_PRODUCER' as DelegationKind

  const actions: Array<ActionItemButton> = []

  if (!delegation) return { actions: actions }

  const handleAccept = () => {
    openDialog({ type: 'acceptDelegation', delegationId: delegation.id })
  }

  const acceptAction: ActionItemButton = {
    action: handleAccept,
    label: tCommon('accept'),
    color: 'primary',
    icon: GradingIcon,
  }

  const handleReject = () => {
    openDialog({ type: 'rejectDelegation', delegationId: delegation.id })
  }

  const rejectAction: ActionItemButton = {
    action: handleReject,
    label: tCommon('reject'),
    color: 'error',
    icon: CloseIcon,
  }

  if (
    delegationKind === 'DELEGATED_PRODUCER' &&
    delegation.state === 'WAITING_FOR_APPROVAL' &&
    delegation.delegate!.id === jwt?.organizationId // TODO rimuovere !
  ) {
    actions.push(...[acceptAction, rejectAction])
  }

  return {
    actions: actions,
  }
}

import type { CompactDelegation, Delegation } from '@/api/api.generatedTypes'
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

  const eserviceName =
    'eserviceName' in delegation ? delegation.eserviceName : delegation.eservice.name
  const handleRevoke = () => {
    openDialog({
      type: 'revokeProducerDelegation',
      delegationId: delegation.id,
      eserviceName: eserviceName,
    })
  }

  const revokeAction: ActionItemButton = {
    action: handleRevoke,
    label: tCommon('revoke'),
    color: 'error',
    icon: CloseIcon,
  }

  if (
    delegation.kind === 'DELEGATED_PRODUCER' &&
    delegation.state === 'WAITING_FOR_APPROVAL' &&
    delegation.delegate.id === jwt?.organizationId
  ) {
    actions.push(...[acceptAction, rejectAction])
  }

  if (
    delegation.kind === 'DELEGATED_PRODUCER' &&
    delegation.state === 'ACTIVE' &&
    delegation.delegator.id === jwt?.organizationId
  ) {
    actions.push(revokeAction)
  }

  return {
    actions: actions,
  }
}

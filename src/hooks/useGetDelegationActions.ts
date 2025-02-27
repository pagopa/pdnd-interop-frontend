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
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const actions: Array<ActionItemButton> = []

  if (!delegation) return { actions: actions }

  const isCurrentTenantDelgate = delegation.delegate.id === jwt?.organizationId
  const isCurrentTenantDelgator = delegation.delegator.id === jwt?.organizationId

  const handleAccept = () => {
    openDialog({
      type: 'acceptDelegation',
      delegationId: delegation.id,
      delegationKind: delegation.kind,
    })
  }

  const acceptAction: ActionItemButton = {
    action: handleAccept,
    label: tCommon('accept'),
    color: 'primary',
    icon: GradingIcon,
  }

  const handleReject = () => {
    openDialog({
      type: 'rejectDelegation',
      delegationId: delegation.id,
      delegationKind: delegation.kind,
    })
  }

  const rejectAction: ActionItemButton = {
    action: handleReject,
    label: tCommon('reject'),
    color: 'error',
    icon: CloseIcon,
  }

  const handleRevoke = () => {
    openDialog({
      type: 'revokeDelegation',
      delegationId: delegation.id,
      eserviceName: delegation.eservice?.name ?? '-',
      delegationKind: delegation.kind,
    })
  }

  const revokeAction: ActionItemButton = {
    action: handleRevoke,
    label: tCommon('revoke'),
    color: 'error',
    icon: CloseIcon,
  }

  if (delegation.state === 'WAITING_FOR_APPROVAL' && isCurrentTenantDelgate && isAdmin) {
    actions.push(...[acceptAction, rejectAction])
  }

  if (delegation.state === 'ACTIVE' && isCurrentTenantDelgator) {
    actions.push(revokeAction)
  }

  return {
    actions: actions,
  }
}

import { PurposeMutations } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { useDialog } from '@/stores'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'

function useGetProviderPurposesActions(purpose?: Purpose) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { isAdmin, jwt } = AuthHooks.useJwt()

  const isDelegator = purpose?.delegation?.delegator.id === jwt?.organizationId

  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()
  const { mutate: suspendVersion } = PurposeMutations.useSuspendVersion()

  const { data: producerDelegation = [] } = useQuery({
    ...DelegationQueries.getList({
      limit: 1,
      offset: 0,
      eserviceIds: [purpose?.eservice.id as string],
      kind: 'DELEGATED_PRODUCER',
      states: ['ACTIVE'],
      delegateIds: [jwt?.organizationId as string],
    }),
    enabled: Boolean(jwt?.organizationId),
    select: ({ results }) => results ?? [],
  })

  const isThereProducerDelegation = Boolean(producerDelegation[0])

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
      action: () =>
        suspendVersion({
          purposeId: purpose.id,
          versionId: currentVersion.id,
          ...(isThereProducerDelegation && { delegationId: producerDelegation[0].id }),
        }),
      label: t('suspend'),
      color: 'error',
      icon: PauseCircleOutlineIcon,
    })
  }

  if (isSuspended && isSuspendedByProvider) {
    actions.push({
      action: () =>
        activateVersion({
          purposeId: purpose.id,
          versionId: currentVersion.id,
          ...(isThereProducerDelegation && { delegationId: producerDelegation[0].id }),
        }),
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
          activateVersion({
            purposeId: purpose.id,
            versionId: waitingForApprovalVersion.id,
            ...(isThereProducerDelegation && { delegationId: producerDelegation[0].id }),
          }),
        label: t('activate'),
        color: 'primary',
        icon: PlayCircleOutlineIcon,
      }
    )
  }

  return { actions }
}

export default useGetProviderPurposesActions

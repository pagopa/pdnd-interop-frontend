import type { EServiceDescriptorState, EServiceMode } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PublishIcon from '@mui/icons-material/Publish'
import { useDialog } from '@/stores'
import { useGetDelegationUserRole } from './useGetDelegationUserRole'
import { match, P } from 'ts-pattern'

export function useGetProviderEServiceActions(
  eserviceId: string,
  descriptorState: EServiceDescriptorState | undefined,
  draftDescriptorState: EServiceDescriptorState | undefined,
  activeDescriptorId: string | undefined,
  draftDescriptorId: string | undefined,
  mode: EServiceMode | undefined
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tDialogApproveDelegatedVersionDraft } = useTranslation('shared-components', {
    keyPrefix: 'dialogApproveDelegatedVersionDraft',
  })
  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const { isDelegator, isDelegate, producerDelegations, delegationState } =
    useGetDelegationUserRole({
      eserviceId,
      organizationId: jwt?.organizationId,
    })

  const delegation = producerDelegations?.find(
    (delegation) => delegation.eservice?.id === eserviceId
  )

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft({
    isByDelegation: isDelegate && delegationState === 'ACTIVE',
  })
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: deleteVersionDraft } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion()
  const { mutate: clone } = EServiceMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = EServiceMutations.useCreateVersionDraft()
  const { mutate: approveDelegatedVersionDraft } =
    EServiceMutations.useApproveDelegatedVersionDraft()

  const state = descriptorState ?? draftDescriptorState ?? 'DRAFT'
  const hasVersionDraft = !!draftDescriptorId

  const isDraftWaitingForApproval = draftDescriptorState === 'WAITING_FOR_APPROVAL'

  // Only admin and operatorAPI can see actions
  if (!isAdmin && !isOperatorAPI) return { actions: [] }

  const deleteDraftAction: ActionItemButton = {
    action: deleteDraft.bind(null, { eserviceId }),
    label: t('delete'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handlePublishDraft = () => {
    if (draftDescriptorId)
      publishDraft({
        eserviceId,
        descriptorId: draftDescriptorId,
        delegatorName: delegation?.delegator.name,
        eserviceName: delegation?.eservice?.name,
      })
  }

  const publishDraftAction: ActionItemButton = {
    action: handlePublishDraft,
    label: t('publishDraft'),
    icon: CheckCircleOutlineIcon,
  }

  const handleDeleteVersionDraft = () => {
    if (draftDescriptorId) deleteVersionDraft({ eserviceId, descriptorId: draftDescriptorId })
  }

  const deleteVersionDraftAction: ActionItemButton = {
    action: handleDeleteVersionDraft,
    label: t('deleteDraft'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handleSuspend = () => {
    if (activeDescriptorId) suspend({ eserviceId, descriptorId: activeDescriptorId })
  }

  const suspendAction: ActionItemButton = {
    action: handleSuspend,
    label: t('suspend'),
    icon: PauseCircleOutlineIcon,
    color: 'error',
  }

  const handleReactivate = () => {
    if (activeDescriptorId) reactivate({ eserviceId, descriptorId: activeDescriptorId })
  }

  const reactivateAction: ActionItemButton = {
    action: handleReactivate,
    label: t('activate'),
    icon: PlayCircleOutlineIcon,
  }

  const handleClone = () => {
    if (activeDescriptorId)
      clone(
        {
          eserviceId,
          descriptorId: activeDescriptorId,
        },
        {
          onSuccess({ id, descriptorId }) {
            navigate('PROVIDE_ESERVICE_EDIT', {
              params: { eserviceId: id, descriptorId },
            })
          },
        }
      )
  }

  const cloneAction: ActionItemButton = {
    action: handleClone,
    label: t('clone'),
    icon: ContentCopyIcon,
  }

  const handleCreateNewDraft = () => {
    createNewDraft(
      { eserviceId },
      {
        onSuccess({ id }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId, descriptorId: id },
            state: { stepIndexDestination: mode === 'RECEIVE' ? 2 : 1 },
          })
        },
      }
    )
  }

  const createNewDraftAction: ActionItemButton = {
    action: handleCreateNewDraft,
    label: t('createNewDraft'),
    icon: FiberNewIcon,
  }

  const handleEditDraft = () => {
    if (draftDescriptorId) {
      navigate('PROVIDE_ESERVICE_SUMMARY', {
        params: { eserviceId, descriptorId: draftDescriptorId },
      })
    }
  }

  const editDraftAction: ActionItemButton = {
    action: handleEditDraft,
    label: t('manageDraft'),
    icon: PendingActionsIcon,
  }

  const handleRejectDelegatedVersionDraft = () => {
    if (draftDescriptorId) {
      openDialog({
        type: 'rejectDelegatedVersionDraft',
        eserviceId,
        descriptorId: draftDescriptorId,
      })
    }
  }

  const rejectDelegatedVersionDraftAction: ActionItemButton = {
    action: handleRejectDelegatedVersionDraft,
    label: t('reject'),
    icon: DeleteOutlineIcon,
  }

  const handleApproveDelegatedVersionDraft = () => {
    if (draftDescriptorId) {
      const handleProceed = () => {
        approveDelegatedVersionDraft({ eserviceId, descriptorId: draftDescriptorId })
        closeDialog()
      }

      openDialog({
        type: 'basic',
        title: tDialogApproveDelegatedVersionDraft('title'),
        description: tDialogApproveDelegatedVersionDraft('description', {
          eserviceName: delegation?.eservice?.name,
          delegateName: delegation?.delegate.name,
        }),
        proceedLabel: tDialogApproveDelegatedVersionDraft('actions.approveAndPublish'),
        onProceed: handleProceed,
      })
    }
  }

  const approveDelegatedVersionDraftAction: ActionItemButton = {
    action: handleApproveDelegatedVersionDraft,
    label: t('approve'),
    icon: PublishIcon,
  }

  const deleteAction = !activeDescriptorId ? deleteDraftAction : deleteVersionDraftAction

  const draftActions = match({
    isDelegator,
    delegationState,
    hasVersionDraft,
  })
    .with(
      {
        isDelegator: true,
        delegationState: 'ACTIVE',
      },
      () => []
    )
    .with(
      { isDelegator: false, hasVersionDraft: false },
      { isDelegator: true, delegationState: P.not('ACTIVE'), hasVersionDraft: false },
      () => [deleteAction]
    )
    .otherwise(() => [publishDraftAction, deleteAction])

  const publishedAdminActions = match({
    isDelegator,
    delegationState,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with(
      {
        isDelegator: true,
        delegationState: 'ACTIVE',
        hasVersionDraft: false,
      },
      () => []
    )
    .with(
      {
        isDelegator: true,
        delegationState: 'ACTIVE',
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
    )
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: true },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [cloneAction, deleteAction, suspendAction]
    )
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: false },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [cloneAction, editDraftAction, deleteAction, suspendAction]
    )
    .otherwise(() => [cloneAction, createNewDraftAction, suspendAction])

  const publishedOperatorApiActions = match({
    isDelegator,
    delegationState,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with(
      {
        isDelegator: true,
        delegationState: 'ACTIVE',
        hasVersionDraft: false,
      },
      () => []
    )
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: true },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [cloneAction, deleteAction]
    )
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: false },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [cloneAction, editDraftAction, deleteAction]
    )
    .otherwise(() => [cloneAction, createNewDraftAction])

  const suspendedAdminActions = match({
    isDelegator,
    delegationState,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with({ isDelegator: true, delegationState: 'ACTIVE' }, () => [])
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: false },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [reactivateAction, cloneAction, editDraftAction, deleteAction]
    )
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: true },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [reactivateAction, cloneAction, deleteAction]
    )
    .otherwise(() => [reactivateAction, cloneAction, createNewDraftAction])

  const suspendedOperatorApiActions = match({
    isDelegator,
    delegationState,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with({ isDelegator: true, delegationState: 'ACTIVE' }, () => [])
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: false },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [cloneAction, editDraftAction, deleteAction]
    )
    .with(
      { isDelegator: false, hasVersionDraft: true, isDraftWaitingForApproval: true },
      {
        isDelegator: true,
        delegationState: P.not('ACTIVE'),
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [cloneAction, deleteAction]
    )
    .otherwise(() => [cloneAction, createNewDraftAction])

  const adminActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedAdminActions,
    ARCHIVED: [],
    DEPRECATED: isDelegator && delegationState === 'ACTIVE' ? [] : [suspendAction],
    DRAFT: draftActions,
    SUSPENDED: suspendedAdminActions,
    WAITING_FOR_APPROVAL:
      isDelegator && delegationState === 'ACTIVE'
        ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
        : [],
  }

  const operatorAPIActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedOperatorApiActions,
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: draftActions,
    SUSPENDED: suspendedOperatorApiActions,
    WAITING_FOR_APPROVAL: [],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

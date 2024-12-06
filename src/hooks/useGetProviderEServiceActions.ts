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
import { match } from 'ts-pattern'

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

  const { isDelegator, isDelegate, producerDelegations } = useGetDelegationUserRole({
    eserviceId,
    organizationId: jwt?.organizationId,
  })

  const delegation = producerDelegations?.find(
    (delegation) => delegation.eservice?.id === eserviceId
  )

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft({
    isByDelegation: isDelegate,
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

  const publishedActions = match({
    isAdmin,
    isDelegator,
    isDelegate,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with({ isAdmin: true, isDelegator: false, isDelegate: false, hasVersionDraft: false }, () => [
      cloneAction,
      suspendAction,
      createNewDraftAction,
    ])
    .with({ isAdmin: true, isDelegator: false, isDelegate: false, hasVersionDraft: true }, () => [
      cloneAction,
      editDraftAction,
      deleteAction,
      suspendAction,
    ])
    .with({ isAdmin: true, isDelegator: true, isDelegate: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
    )
    .with({ isAdmin: true, isDelegator: false, isDelegate: true, hasVersionDraft: false }, () => [
      suspendAction,
      createNewDraftAction,
    ])
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [suspendAction, editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [suspendAction]
    )
    .with({ isAdmin: false, isDelegator: false, isDelegate: false, hasVersionDraft: false }, () => [
      cloneAction,
      createNewDraftAction,
    ])
    .with({ isAdmin: false, isDelegator: false, isDelegate: false, hasVersionDraft: true }, () => [
      cloneAction,
      editDraftAction,
      deleteAction,
    ])
    .with(
      { isAdmin: false, isDelegator: true, isDelegate: false, hasVersionDraft: false },
      () => []
    )
    .with(
      {
        isAdmin: false,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: false,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
    )
    .with({ isAdmin: false, isDelegator: false, isDelegate: true, hasVersionDraft: false }, () => [
      createNewDraftAction,
    ])
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => []
    )
    .otherwise(() => [])

  const draftActions = match({ isDelegator, isDelegate })
    .with({ isDelegator: false, isDelegate: false }, () => [publishDraftAction, deleteAction])
    .with({ isDelegator: true, isDelegate: false }, () => [])
    .with({ isDelegator: false, isDelegate: true }, () => [publishDraftAction])
    .otherwise(() => [])

  const suspendedActions = match({
    isAdmin,
    isDelegator,
    isDelegate,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with({ isAdmin: true, isDelegator: false, isDelegate: false, hasVersionDraft: false }, () => [
      reactivateAction,
      cloneAction,
      createNewDraftAction,
    ])
    .with({ isAdmin: true, isDelegator: false, isDelegate: false, hasVersionDraft: true }, () => [
      reactivateAction,
      cloneAction,
      editDraftAction,
      deleteAction,
    ])
    .with({ isAdmin: true, isDelegator: true, isDelegate: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
    )
    .with({ isAdmin: true, isDelegator: false, isDelegate: true, hasVersionDraft: false }, () => [
      reactivateAction,
      createNewDraftAction,
    ])
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [reactivateAction, editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [reactivateAction]
    )
    .with({ isAdmin: false, isDelegator: false, isDelegate: false, hasVersionDraft: false }, () => [
      cloneAction,
      createNewDraftAction,
    ])
    .with({ isAdmin: false, isDelegator: false, isDelegate: false, hasVersionDraft: true }, () => [
      cloneAction,
      editDraftAction,
      deleteAction,
    ])
    .with(
      { isAdmin: false, isDelegator: true, isDelegate: false, hasVersionDraft: false },
      () => []
    )
    .with(
      {
        isAdmin: false,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: false,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
    )
    .with({ isAdmin: false, isDelegator: false, isDelegate: true, hasVersionDraft: false }, () => [
      createNewDraftAction,
    ])
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => []
    )
    .otherwise(() => [])

  const adminActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    ARCHIVED: [],
    DEPRECATED: isDelegator ? [] : [suspendAction],
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    WAITING_FOR_APPROVAL: isDelegator
      ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
      : [],
  }

  const operatorAPIActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    WAITING_FOR_APPROVAL: isDelegator
      ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
      : [],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

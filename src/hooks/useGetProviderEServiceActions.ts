import type {
  DelegationWithCompactTenants,
  EServiceDescriptorState,
  EServiceMode,
  EServiceTemplateRef,
} from '@/api/api.generatedTypes'
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
import { match } from 'ts-pattern'
import { waitFor } from '@/utils/common.utils'

export function useGetProviderEServiceActions(
  eserviceId: string,
  descriptorState: EServiceDescriptorState | undefined,
  draftDescriptorState: EServiceDescriptorState | undefined,
  activeDescriptorId: string | undefined,
  draftDescriptorId: string | undefined,
  mode: EServiceMode | undefined,
  eserviceName: string | undefined,
  isNewTemplateVersionAvailable: boolean,
  isTemplateInstance: boolean,
  delegation?: DelegationWithCompactTenants
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tDialogApproveDelegatedVersionDraft } = useTranslation('shared-components', {
    keyPrefix: 'dialogApproveDelegatedVersionDraft',
  })
  const { t: tConfirmationDialog } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteDraft.confirmDialog',
  })
  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const isDelegator = delegation?.delegator.id === jwt?.organizationId
  const isDelegate = delegation?.delegate.id === jwt?.organizationId

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
  const { mutate: upgradeEService } = EServiceMutations.useUpgradeEService()
  const { mutate: deleteDraftAndUpgradeEService } =
    EServiceMutations.useDeleteDraftAndUpgradeEService()

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
        eserviceName: eserviceName,
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
    color: 'error',
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
          eserviceName: eserviceName,
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

  const handleUpgradeEService = async () => {
    if (hasVersionDraft) {
      deleteDraftAndUpgradeEService(
        { eserviceId, descriptorId: draftDescriptorId },
        {
          onSuccess({ id: descriptorId }) {
            navigate('PROVIDE_ESERVICE_EDIT', {
              params: { eserviceId: eserviceId, descriptorId: descriptorId },
              state: { stepIndexDestination: mode === 'RECEIVE' ? 2 : 1 },
            })
          },
        }
      )
    }
    upgradeEService(
      { eserviceId },
      {
        onSuccess({ id: descriptorId }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId: eserviceId, descriptorId: descriptorId },
            state: { stepIndexDestination: mode === 'RECEIVE' ? 2 : 1 },
          })
        },
      }
    )
  }

  const upgradeEServiceAction: ActionItemButton = {
    action: handleUpgradeEService,
    label: t('updateIstance'),
    icon: FiberNewIcon,
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
      createNewDraftAction,
      suspendAction,
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
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: true, isDelegator: false, isDelegate: true, hasVersionDraft: false }, () => [
      createNewDraftAction,
      suspendAction,
    ])
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction, deleteAction, suspendAction]
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
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
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
      () => [editDraftAction]
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
      () => [editDraftAction]
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

  const fromTemplatePublishActions = match({
    isAdmin,
    isDelegator,
    isDelegate,
    hasVersionDraft,
    isDraftWaitingForApproval,
    isNewTemplateVersionAvailable,
  })
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction, suspendAction, createNewDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => [suspendAction, createNewDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: true,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction, editDraftAction, deleteAction, suspendAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: true,
        isNewTemplateVersionAvailable: false,
      },
      () => [editDraftAction, deleteAction, suspendAction]
    )
    .with({ isAdmin: true, isDelegator: true, isDelegate: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction, suspendAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => [suspendAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction, editDraftAction, deleteAction, suspendAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
        isNewTemplateVersionAvailable: false,
      },
      () => [editDraftAction, deleteAction, suspendAction]
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
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [createNewDraftAction, upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => []
    )
    .with({ isAdmin: false, isDelegator: false, isDelegate: false, hasVersionDraft: true }, () => [
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
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: true,
        isDelegate: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => []
    )
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

  // Suspension
  const fromTemplateSuspendActions = match({
    isAdmin,
    isDelegator,
    isDelegate,
    hasVersionDraft,
    isDraftWaitingForApproval,
    isNewTemplateVersionAvailable,
  })
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [reactivateAction, upgradeEServiceAction, createNewDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => [reactivateAction, createNewDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: true,
        isNewTemplateVersionAvailable: true,
      },
      () => [reactivateAction, editDraftAction, upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: true,
        isNewTemplateVersionAvailable: false,
      },
      () => [reactivateAction, editDraftAction]
    ) /* Delegations */
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
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [reactivateAction, upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => [reactivateAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [reactivateAction, upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: true,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
        isNewTemplateVersionAvailable: false,
      },
      () => [reactivateAction, deleteAction]
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
    ) // Not an admin
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: true,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction, editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: false,
        hasVersionDraft: true,
        isNewTemplateVersionAvailable: false,
      },
      () => [editDraftAction, deleteAction]
    )
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
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: true,
      },
      () => [upgradeEServiceAction]
    )
    .with(
      {
        isAdmin: false,
        isDelegator: false,
        isDelegate: true,
        hasVersionDraft: false,
        isNewTemplateVersionAvailable: false,
      },
      () => []
    )
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

  const EServiceFromTemplateAdminActions: Record<
    EServiceDescriptorState,
    Array<ActionItemButton>
  > = {
    PUBLISHED: fromTemplatePublishActions,
    ARCHIVED: [],
    DEPRECATED: isDelegator ? [] : [suspendAction],
    DRAFT: draftActions,
    SUSPENDED: fromTemplateSuspendActions,
    WAITING_FOR_APPROVAL: isDelegator
      ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
      : [],
  }

  const EServiceFromTemplateOperatorAPIActions: Record<
    EServiceDescriptorState,
    Array<ActionItemButton>
  > = {
    PUBLISHED: fromTemplatePublishActions,
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: draftActions,
    SUSPENDED: fromTemplateSuspendActions,
    WAITING_FOR_APPROVAL: isDelegator
      ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
      : [],
  }

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

  const availableClassicEServiceAction = isAdmin ? adminActions[state] : operatorAPIActions[state]
  const availableFromTemplateEserviceAction = isAdmin
    ? EServiceFromTemplateAdminActions[state]
    : EServiceFromTemplateOperatorAPIActions[state]

  const availableAction = isTemplateInstance
    ? availableFromTemplateEserviceAction
    : availableClassicEServiceAction

  return { actions: availableAction }
}

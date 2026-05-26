import type {
  ArchivingSchedule,
  DelegationWithCompactTenants,
  EServiceDescriptorState,
  EServiceMode,
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
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PublishIcon from '@mui/icons-material/Publish'
import ArchiveIcon from '@mui/icons-material/Archive'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion'
import { useDialog } from '@/stores'
import { match, P } from 'ts-pattern'

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
  delegation?: DelegationWithCompactTenants,
  hasPersonalData?: boolean,
  where?: 'tableRow' | 'detailsPage',
  archivingSchedule?: ArchivingSchedule,
  latestDescriptorId?: string,
  onViewAllVersions?: () => void,
  isActiveDescriptor?: boolean,
  isEServiceBeingArchived?: boolean
): {
  primaryAction: ActionItemButton | undefined
  secondaryAction: ActionItemButton | undefined
  menuActions: Array<ActionItemButton>
  headerInfoActions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tEserviceActions } = useTranslation('eservice', { keyPrefix: 'read.actions' })
  const { t: tDialogApproveDelegatedVersionDraft } = useTranslation('shared-components', {
    keyPrefix: 'dialogApproveDelegatedVersionDraft',
  })
  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const isDelegator = delegation?.delegator.id === jwt?.organizationId
  const isDelegate = delegation?.delegate.id === jwt?.organizationId

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
  if (!isAdmin && !isOperatorAPI)
    return {
      primaryAction: undefined,
      secondaryAction: undefined,
      menuActions: [],
      headerInfoActions: [],
    }

  const deleteDraftAction: ActionItemButton = {
    action: deleteDraft.bind(null, { eserviceId }),
    label: t('delete'),
    icon: DeleteOutlineIcon,
    color: 'error',
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
    label: tEserviceActions('suspendVersion'),
    icon: PauseCircleOutlineIcon,
  }

  const handleReactivate = () => {
    if (activeDescriptorId) reactivate({ eserviceId, descriptorId: activeDescriptorId })
  }

  const reactivateAction: ActionItemButton = {
    action: handleReactivate,
    label: tEserviceActions('reactivateVersion'),
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
    label: tEserviceActions('cloneEservice'),
    icon: ContentCopyIcon,
  }

  const handleCreateNewDraft = () => {
    createNewDraft(
      { eserviceId },
      {
        onSuccess({ id }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId, descriptorId: id },
          })
        },
      }
    )
  }

  const createNewDraftAction: ActionItemButton = {
    action: handleCreateNewDraft,
    label: tEserviceActions('createNewVersion'),
    icon: FiberNewIcon,
  }

  const noopArchivingAction = () => {
    /* TODO wired by PIN-9943 / PIN-9945 */
  }

  const archiveDescriptorAction: ActionItemButton = {
    action: noopArchivingAction,
    label: tEserviceActions('archiveVersion'),
    icon: ArchiveIcon,
  }

  const cancelArchivingDescriptorAction: ActionItemButton = {
    action: noopArchivingAction,
    label: tEserviceActions('cancelArchivingVersion'),
    icon: CancelOutlinedIcon,
  }

  const archiveEserviceAction: ActionItemButton = {
    action: noopArchivingAction,
    label: tEserviceActions('archiveEservice'),
    icon: ArchiveIcon,
  }

  const cancelArchivingEserviceAction: ActionItemButton = {
    action: noopArchivingAction,
    label: tEserviceActions('cancelArchivingEservice'),
    icon: CancelOutlinedIcon,
    variant: 'contained',
  }

  const handleViewLatestVersion = () => {
    if (latestDescriptorId) {
      navigate('PROVIDE_ESERVICE_MANAGE', {
        params: { eserviceId, descriptorId: latestDescriptorId },
      })
    }
  }

  const viewLatestVersionAction: ActionItemButton = {
    action: handleViewLatestVersion,
    label: tEserviceActions('viewLatestVersion'),
    icon: ReplayCircleFilledIcon,
  }

  const viewAllVersionsAction: ActionItemButton = {
    action: () => onViewAllVersions?.(),
    label: tEserviceActions('viewAllVersions'),
    icon: AutoAwesomeMotionIcon,
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
    } else {
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
  }

  const upgradeEServiceAction: ActionItemButton = {
    action: handleUpgradeEService,
    label: t('updateInstance'),
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
    .with({ isDelegator: false, isDelegate: false }, () => [deleteAction])
    /** Delegation */
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
    WAITING_FOR_APPROVAL:
      isDelegator && where !== 'tableRow'
        ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
        : isDelegator && where === 'tableRow' && !hasPersonalData
          ? [rejectDelegatedVersionDraftAction]
          : [],
    ARCHIVING: [],
    ARCHIVING_SUSPENDED: [],
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
    WAITING_FOR_APPROVAL:
      isDelegator && where !== 'tableRow'
        ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
        : isDelegator && where === 'tableRow' && !hasPersonalData
          ? [rejectDelegatedVersionDraftAction]
          : [],
    ARCHIVING: [],
    ARCHIVING_SUSPENDED: [],
  }

  const adminActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    ARCHIVED: [],
    DEPRECATED: isDelegator ? [] : [suspendAction],
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    WAITING_FOR_APPROVAL:
      isDelegator && where !== 'tableRow'
        ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
        : isDelegator && where === 'tableRow' && !hasPersonalData
          ? [rejectDelegatedVersionDraftAction]
          : [],
    ARCHIVING: isDelegator ? [] : [suspendAction, cloneAction],
    ARCHIVING_SUSPENDED: isDelegator ? [] : [reactivateAction, cloneAction],
  }

  const operatorAPIActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    WAITING_FOR_APPROVAL:
      isDelegator && where !== 'tableRow'
        ? [approveDelegatedVersionDraftAction, rejectDelegatedVersionDraftAction]
        : isDelegator && where === 'tableRow' && !hasPersonalData
          ? [rejectDelegatedVersionDraftAction]
          : [],
    ARCHIVING: [],
    ARCHIVING_SUSPENDED: [],
  }

  const availableClassicEServiceAction = isAdmin ? adminActions[state] : operatorAPIActions[state]
  const availableFromTemplateEserviceAction = isAdmin
    ? EServiceFromTemplateAdminActions[state]
    : EServiceFromTemplateOperatorAPIActions[state]

  const availableAction = isTemplateInstance
    ? availableFromTemplateEserviceAction
    : availableClassicEServiceAction

  const isHappyPathDetailsPage =
    where === 'detailsPage' &&
    (isAdmin || isOperatorAPI) &&
    !isDelegator &&
    !isDelegate &&
    !hasVersionDraft &&
    !isTemplateInstance

  if (!isHappyPathDetailsPage) {
    return {
      primaryAction: undefined,
      secondaryAction: undefined,
      menuActions:
        where === 'detailsPage' ? [...availableAction, viewAllVersionsAction] : availableAction,
      headerInfoActions: [],
    }
  }

  const archivingScope = archivingSchedule?.scope

  type Slots = {
    primary: ActionItemButton | undefined
    header: Array<ActionItemButton>
    menu: Array<ActionItemButton>
  }

  const emptySlots = (): Slots => ({ primary: undefined, header: [], menu: [] })

  const menuClassic = [cloneAction, archiveEserviceAction, viewAllVersionsAction]
  const menuWithNewVersion = isEServiceBeingArchived
    ? [cloneAction, viewAllVersionsAction]
    : [createNewDraftAction, cloneAction, archiveEserviceAction, viewAllVersionsAction]
  const menuEserviceArchiving = [cloneAction, viewAllVersionsAction]
  const menuArchived = [cloneAction]

  const slots: Slots = match({ state, archivingScope, isActiveDescriptor })
    .with({ state: 'PUBLISHED' }, () => ({
      primary: undefined,
      header: [suspendAction, createNewDraftAction],
      menu: menuClassic,
    }))
    .with({ state: 'DEPRECATED' }, () => ({
      primary: undefined,
      header: [suspendAction, archiveDescriptorAction],
      menu: menuWithNewVersion,
    }))
    .with({ state: 'SUSPENDED', isActiveDescriptor: true }, () => ({
      primary: undefined,
      header: [reactivateAction, createNewDraftAction],
      menu: menuClassic,
    }))
    .with({ state: 'SUSPENDED' }, () => ({
      primary: undefined,
      header: [reactivateAction, archiveDescriptorAction],
      menu: menuWithNewVersion,
    }))
    .with({ state: 'ARCHIVED' }, () => ({
      primary: undefined,
      header: latestDescriptorId ? [viewLatestVersionAction] : [],
      menu: menuArchived,
    }))
    .with({ state: 'ARCHIVING', archivingScope: 'ESERVICE' }, () => ({
      primary: cancelArchivingEserviceAction,
      header: [suspendAction],
      menu: menuEserviceArchiving,
    }))
    .with(
      { state: 'ARCHIVING', archivingScope: 'DESCRIPTOR', isActiveDescriptor: true },
      emptySlots
    )
    .with({ state: 'ARCHIVING' }, () => ({
      primary: undefined,
      header: [suspendAction, cancelArchivingDescriptorAction],
      menu: menuWithNewVersion,
    }))
    .with({ state: 'ARCHIVING_SUSPENDED', archivingScope: 'ESERVICE' }, () => ({
      primary: cancelArchivingEserviceAction,
      header: [reactivateAction],
      menu: menuEserviceArchiving,
    }))
    .with(
      { state: 'ARCHIVING_SUSPENDED', archivingScope: 'DESCRIPTOR', isActiveDescriptor: true },
      emptySlots
    )
    .with({ state: 'ARCHIVING_SUSPENDED' }, () => ({
      primary: undefined,
      header: [reactivateAction, cancelArchivingDescriptorAction],
      menu: menuWithNewVersion,
    }))
    .with({ state: P.union('DRAFT', 'WAITING_FOR_APPROVAL') }, emptySlots)
    .exhaustive()

  return {
    primaryAction: slots.primary,
    secondaryAction: undefined,
    menuActions: slots.menu,
    headerInfoActions: slots.header,
  }
}

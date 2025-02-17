import type { EServiceDescriptorState, EServiceMode } from '@/api/api.generatedTypes'
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
import { TemplateMutations } from '@/api/template'

export function useGetProviderEServiceTemplateActions(
  eServiceTemplateId: string,
  eServiceTemplateVersionId: string,
  descriptorState: EServiceDescriptorState | undefined,
  mode: EServiceMode | undefined, //TODO
  draftDescriptorState?: EServiceDescriptorState | undefined, //TODO TOGLIERE ?
  activeDescriptorId?: string | undefined,
  draftDescriptorId?: string | undefined
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const { mutate: publishDraft } = TemplateMutations.usePublishVersionDraft()
  const { mutate: deleteVersionDraft } = TemplateMutations.useDeleteVersionDraft()
  const { mutate: suspend } = TemplateMutations.useSuspendVersion()
  const { mutate: reactivate } = TemplateMutations.useReactivateVersion()
  const { mutate: clone } = TemplateMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = TemplateMutations.useCreateDraft() //TODO NON C'è NELL'SRS

  const state = descriptorState ?? 'DRAFT' //draftDescriptorState ?? 'DRAFT'
  const hasVersionDraft = state === 'DRAFT' //!!draftDescriptorId

  const isDraftWaitingForApproval = draftDescriptorState === 'WAITING_FOR_APPROVAL'

  // Only admin and operatorAPI can see actions
  if (!isAdmin && !isOperatorAPI) return { actions: [] }

  const deleteDraftAction: ActionItemButton = {
    action: deleteVersionDraft.bind(null, { eServiceTemplateId, eServiceTemplateVersionId }),
    label: t('delete'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handlePublishDraft = () => {
    //if (draftDescriptorId)
    if (state === 'DRAFT')
      publishDraft({
        eServiceTemplateId,
        eServiceTemplateVersionId,
      })
  }

  const publishDraftAction: ActionItemButton = {
    action: handlePublishDraft,
    label: t('publishDraft'),
    icon: CheckCircleOutlineIcon,
  }

  const handleDeleteVersionDraft = () => {
    //if (draftDescriptorId)
    if (state === 'DRAFT') deleteVersionDraft({ eServiceTemplateId, eServiceTemplateVersionId })
  }

  const deleteVersionDraftAction: ActionItemButton = {
    action: handleDeleteVersionDraft,
    label: t('deleteDraft'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handleSuspend = () => {
    //if (activeDescriptorId)
    if (state === 'PUBLISHED') suspend({ eServiceTemplateId, eServiceTemplateVersionId })
  }

  const suspendAction: ActionItemButton = {
    action: handleSuspend,
    label: t('suspend'),
    icon: PauseCircleOutlineIcon,
    color: 'error',
  }

  const handleReactivate = () => {
    //if (activeDescriptorId)
    if (state === 'SUSPENDED') reactivate({ eServiceTemplateId, eServiceTemplateVersionId })
  }

  const reactivateAction: ActionItemButton = {
    action: handleReactivate,
    label: t('activate'),
    icon: PlayCircleOutlineIcon,
  }

  const handleClone = () => {
    //if (activeDescriptorId)
    if (state === 'PUBLISHED')
      clone(
        {
          eServiceTemplateId,
          eServiceTemplateVersionId,
        },
        {
          onSuccess({ id, eserviceTemplateVersionId }) {
            navigate('NOT_FOUND', {
              //TODO
              // params: { eServiceTemplateId: id, eserviceTemplateVersionId },
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
      { eServiceTemplateId },
      {
        onSuccess({ id }) {
          navigate('NOT_FOUND', {
            //TODO
            //PROVIDE_ESERVICE_TEMPLATE_EDIT
            // params: { eServiceTemplateId, eServiceTemplateVersionId: id },
            //state: { stepIndexDestination: mode === 'RECEIVE' ? 2 : 1 },
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
      navigate('NOT_FOUND', {
        //TODO PROVIDE_ESERVICE_TEMPLATE_SUMMARY
        //params: { eServiceTemplateId, eServiceTemplateVersionId: draftDescriptorId },
      })
    }
  }

  const editDraftAction: ActionItemButton = {
    action: handleEditDraft,
    label: t('manageDraft'),
    icon: PendingActionsIcon,
  }

  const deleteAction = !activeDescriptorId ? deleteDraftAction : deleteVersionDraftAction

  const publishedActions = match({
    isAdmin,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with({ isAdmin: true, hasVersionDraft: false }, () => [
      cloneAction,
      createNewDraftAction,
      suspendAction,
    ])
    .with({ isAdmin: true, hasVersionDraft: true }, () => [
      cloneAction,
      editDraftAction,
      deleteAction,
      suspendAction,
    ])
    .with({ isAdmin: true, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: true, hasVersionDraft: false }, () => [createNewDraftAction, suspendAction])
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction, deleteAction, suspendAction]
    )
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [suspendAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [cloneAction, createNewDraftAction])
    .with({ isAdmin: false, hasVersionDraft: true }, () => [
      cloneAction,
      editDraftAction,
      deleteAction,
    ])
    .with({ isAdmin: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => []
    )
    .otherwise(() => [])

  const suspendedActions = match({
    isAdmin,
    hasVersionDraft,
    isDraftWaitingForApproval,
  })
    .with({ isAdmin: true, hasVersionDraft: false }, () => [
      reactivateAction,
      cloneAction,
      createNewDraftAction,
    ])
    .with({ isAdmin: true, hasVersionDraft: true }, () => [
      reactivateAction,
      cloneAction,
      editDraftAction,
      deleteAction,
    ])
    .with({ isAdmin: true, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: true, hasVersionDraft: false }, () => [reactivateAction, createNewDraftAction])
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [reactivateAction, editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [reactivateAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [cloneAction, createNewDraftAction])
    .with({ isAdmin: false, hasVersionDraft: true }, () => [
      cloneAction,
      editDraftAction,
      deleteAction,
    ])
    .with({ isAdmin: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => []
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: false,
      },
      () => [editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
        isDraftWaitingForApproval: true,
      },
      () => []
    )
    .otherwise(() => [])

  const draftActions = [publishDraftAction, deleteAction]

  const adminActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    WAITING_FOR_APPROVAL: [],
    DEPRECATED: [],
    ARCHIVED: [],
  }

  const operatorAPIActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    WAITING_FOR_APPROVAL: [],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

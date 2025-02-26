import type {
  EServiceDescriptorState,
  EServiceMode,
  EServiceTemplateVersionState,
} from '@/api/api.generatedTypes'
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
  mode: EServiceMode | undefined, //TODO
  activeVersionState?: EServiceTemplateVersionState | undefined,
  draftVersionState?: EServiceTemplateVersionState | undefined
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { isAdmin, isOperatorAPI, jwt } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const { mutate: publishDraft } = TemplateMutations.usePublishVersionDraft()
  const { mutate: deleteVersionDraft } = TemplateMutations.useDeleteVersionDraft()
  const { mutate: suspend } = TemplateMutations.useSuspendVersion()
  const { mutate: reactivate } = TemplateMutations.useReactivateVersion()
  const { mutate: createNewDraft } = TemplateMutations.useCreateDraft()

  const state = activeVersionState ?? 'DRAFT'
  const hasVersionDraft = state === 'DRAFT' || draftVersionState === 'DRAFT'

  // Only admin and operatorAPI can see actions
  if (!isAdmin && !isOperatorAPI) return { actions: [] }

  const handlePublishDraft = () => {
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
    if (state === 'DRAFT') deleteVersionDraft({ eServiceTemplateId, eServiceTemplateVersionId })
  }

  const deleteVersionDraftAction: ActionItemButton = {
    action: handleDeleteVersionDraft,
    label: t('deleteDraft'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handleSuspend = () => {
    if (state === 'PUBLISHED') suspend({ eServiceTemplateId, eServiceTemplateVersionId })
  }

  const suspendAction: ActionItemButton = {
    action: handleSuspend,
    label: t('suspend'),
    icon: PauseCircleOutlineIcon,
    color: 'error',
  }

  const handleReactivate = () => {
    if (state === 'SUSPENDED') reactivate({ eServiceTemplateId, eServiceTemplateVersionId })
  }

  const reactivateAction: ActionItemButton = {
    action: handleReactivate,
    label: t('activate'),
    icon: PlayCircleOutlineIcon,
  }

  const handleCreateNewDraft = () => {
    if (state === 'PUBLISHED' && (!draftVersionState || draftVersionState === 'DRAFT'))
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
    if (state === 'DRAFT' || draftVersionState === 'DRAFT') {
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

  const deleteAction = deleteVersionDraftAction

  const publishedActions = match({
    isAdmin,
    hasVersionDraft,
  })
    .with({ isAdmin: true, hasVersionDraft: false }, () => [createNewDraftAction, suspendAction])
    .with({ isAdmin: true, hasVersionDraft: true }, () => [
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
      },
      () => [suspendAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with({ isAdmin: false, hasVersionDraft: true }, () => [editDraftAction, deleteAction])
    .with({ isAdmin: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => [editDraftAction]
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => [editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => []
    )
    .otherwise(() => [])

  const suspendedActions = match({
    isAdmin,
    hasVersionDraft,
  })
    .with({ isAdmin: true, hasVersionDraft: false }, () => [reactivateAction, createNewDraftAction])
    .with({ isAdmin: true, hasVersionDraft: true }, () => [
      reactivateAction,
      editDraftAction,
      deleteAction,
    ])
    .with({ isAdmin: true, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
      },
      () => []
    )
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: true, hasVersionDraft: false }, () => [reactivateAction, createNewDraftAction])
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
      },
      () => [reactivateAction, editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: true,
        hasVersionDraft: true,
      },
      () => [reactivateAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with({ isAdmin: false, hasVersionDraft: true }, () => [editDraftAction, deleteAction])
    .with({ isAdmin: false, hasVersionDraft: false }, () => [])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => []
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => [editDraftAction]
    )
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => [editDraftAction, deleteAction]
    )
    .with(
      {
        isAdmin: false,
        hasVersionDraft: true,
      },
      () => []
    )
    .otherwise(() => [])

  const draftActions = [publishDraftAction, deleteAction]

  const adminActions: Record<EServiceTemplateVersionState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    DEPRECATED: [],
  }

  const operatorAPIActions: Record<EServiceTemplateVersionState, Array<ActionItemButton>> = {
    PUBLISHED: publishedActions,
    DEPRECATED: [],
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

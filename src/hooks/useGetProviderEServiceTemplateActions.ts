import type { EServiceMode, EServiceTemplateVersionState } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { match } from 'ts-pattern'
import { TemplateMutations } from '@/api/template'

export function useGetProviderEServiceTemplateActions(
  eServiceTemplateId: string,
  activeVersionId: string | undefined,
  draftVersionId: string | undefined,
  activeVersionState: EServiceTemplateVersionState | undefined,
  draftVersionState: EServiceTemplateVersionState | undefined,
  mode: EServiceMode | undefined //TODO
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const navigate = useNavigate()

  const { mutate: publishDraft } = TemplateMutations.usePublishVersionDraft()
  const { mutate: deleteVersionDraft } = TemplateMutations.useDeleteVersionDraft()
  const { mutate: suspend } = TemplateMutations.useSuspendVersion()
  const { mutate: reactivate } = TemplateMutations.useReactivateVersion()
  const { mutate: createNewVersionDraft } = TemplateMutations.useCreateNewVersionDraft()

  const state = activeVersionState ?? draftVersionState ?? 'DRAFT'
  const hasVersionDraft = !!draftVersionId

  // Only admin and operatorAPI can see actions
  if (!isAdmin && !isOperatorAPI) return { actions: [] }

  const handlePublishDraft = () => {
    if (draftVersionId)
      publishDraft({
        eServiceTemplateId,
        eServiceTemplateVersionId: draftVersionId,
      })
  }

  const publishDraftAction: ActionItemButton = {
    action: handlePublishDraft,
    label: t('publishDraft'),
    icon: CheckCircleOutlineIcon,
  }

  const handleDeleteVersionDraft = () => {
    if (draftVersionId)
      deleteVersionDraft({ eServiceTemplateId, eServiceTemplateVersionId: draftVersionId })
  }

  const deleteVersionDraftAction: ActionItemButton = {
    action: handleDeleteVersionDraft,
    label: t('deleteDraft'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handleSuspend = () => {
    if (activeVersionId) suspend({ eServiceTemplateId, eServiceTemplateVersionId: activeVersionId })
  }

  const suspendAction: ActionItemButton = {
    action: handleSuspend,
    label: t('suspend'),
    icon: PauseCircleOutlineIcon,
    color: 'error',
  }

  const handleReactivate = () => {
    if (activeVersionId)
      reactivate({ eServiceTemplateId, eServiceTemplateVersionId: activeVersionId })
  }

  const reactivateAction: ActionItemButton = {
    action: handleReactivate,
    label: t('activate'),
    icon: PlayCircleOutlineIcon,
  }

  const handleCreateNewDraft = () => {
    createNewVersionDraft(eServiceTemplateId, {
      onSuccess({ id: templateVersionId }) {
        navigate('PROVIDE_ESERVICE_TEMPLATE_EDIT', {
          params: { eServiceTemplateId, eServiceTemplateVersionId: templateVersionId },
          state: { stepIndexDestination: mode === 'RECEIVE' ? 2 : 1 },
        })
      },
    })
  }

  const createNewDraftAction: ActionItemButton = {
    action: handleCreateNewDraft,
    label: t('createNewDraftFromEserviceTemplate'),
    icon: FiberNewIcon,
  }

  const handleEditDraft = () => {
    if (draftVersionId) {
      navigate('PROVIDE_ESERVICE_TEMPLATE_SUMMARY', {
        params: { eServiceTemplateId, eServiceTemplateVersionId: draftVersionId },
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
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with({ isAdmin: false, hasVersionDraft: true }, () => [editDraftAction, deleteAction])
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
    .with({ isAdmin: false, hasVersionDraft: false }, () => [createNewDraftAction])
    .with({ isAdmin: false, hasVersionDraft: true }, () => [editDraftAction, deleteAction])
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
    DRAFT: draftActions,
    SUSPENDED: suspendedActions,
    DEPRECATED: [],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

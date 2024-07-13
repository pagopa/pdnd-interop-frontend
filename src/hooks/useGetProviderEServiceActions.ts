import type { EServiceDescriptorState, EServiceMode } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { useNavigate } from '@tanstack/react-router'
import { minutesToSeconds } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { useAuthenticatedUser } from './useAuthenticatedUser'

export function useGetProviderEServiceActions(
  eserviceId: string | undefined,
  descriptorState: EServiceDescriptorState | undefined,
  activeDescriptorId: string | undefined,
  draftDescriptorId: string | undefined,
  mode: EServiceMode | undefined
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin, isOperatorAPI } = useAuthenticatedUser()
  const navigate = useNavigate()

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: deleteVersionDraft } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion()
  const { mutate: clone } = EServiceMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = EServiceMutations.useCreateVersionDraft()

  const state = descriptorState ?? 'DRAFT'
  const hasVersionDraft = !!draftDescriptorId

  // Only admin and operatorAPI can see actions
  if (!eserviceId || (!isAdmin && !isOperatorAPI)) return { actions: [] }

  const deleteDraftAction: ActionItemButton = {
    action: deleteDraft.bind(null, { eserviceId }),
    label: t('delete'),
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  const handlePublishDraft = () => {
    if (draftDescriptorId) publishDraft({ eserviceId, descriptorId: draftDescriptorId })
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
            navigate({
              to: '/erogazione/e-service/$eserviceId/$descriptorId/modifica',
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
      {
        eserviceId,
        voucherLifespan: minutesToSeconds(1),
        audience: [],
        description: 'Descrizione nuova versione...',
        dailyCallsPerConsumer: 1,
        dailyCallsTotal: 1,
        agreementApprovalPolicy: 'AUTOMATIC',
        attributes: {
          certified: [],
          declared: [],
          verified: [],
        },
      },
      {
        onSuccess({ id }) {
          navigate({
            to: '/erogazione/e-service/$eserviceId/$descriptorId/modifica',
            params: { eserviceId, descriptorId: id },
            //TODO
            // state: { stepIndexDestination: mode === 'RECEIVE' ? 2 : 1 },
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
      navigate({
        to: '/erogazione/e-service/$eserviceId/$descriptorId/modifica/riepilogo',
        params: { eserviceId, descriptorId: draftDescriptorId },
      })
    }
  }

  const editDraftAction: ActionItemButton = {
    action: handleEditDraft,
    label: t('manageDraft'),
    icon: PendingActionsIcon,
  }

  const deleteAction = !activeDescriptorId ? deleteDraftAction : deleteVersionDraftAction

  const adminActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: [
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteAction]),
      suspendAction,
    ],
    ARCHIVED: [],
    DEPRECATED: [suspendAction],
    DRAFT: !hasVersionDraft ? [deleteAction] : [publishDraftAction, deleteAction],
    SUSPENDED: [
      reactivateAction,
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteAction]),
    ],
  }

  const operatorAPIActions: Record<EServiceDescriptorState, Array<ActionItemButton>> = {
    PUBLISHED: [
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteAction]),
    ],
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: !hasVersionDraft ? [deleteAction] : [publishDraftAction, deleteAction],
    SUSPENDED: [
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteAction]),
    ],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

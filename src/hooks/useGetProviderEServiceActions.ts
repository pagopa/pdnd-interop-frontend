import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { useNavigate } from '@/router'
import { minutesToSeconds } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'
import type { ActionItem } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'

export function useGetProviderEServiceActions(
  eserviceId?: string,
  descriptorState?: EServiceDescriptorState,
  activeDescriptorId?: string,
  draftDescriptorId?: string
) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
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

  const deleteDraftAction = {
    action: deleteDraft.bind(null, { eserviceId }),
    label: t('delete'),
  }

  if (!activeDescriptorId && !draftDescriptorId) {
    return {
      actions: [deleteDraftAction],
    }
  }

  const handlePublishDraft = () => {
    if (draftDescriptorId) publishDraft({ eserviceId, descriptorId: draftDescriptorId })
  }

  const publishDraftAction = {
    action: handlePublishDraft,
    label: t('publish'),
  }

  const handleDeleteVersionDraft = () => {
    if (draftDescriptorId) deleteVersionDraft({ eserviceId, descriptorId: draftDescriptorId })
  }

  const deleteVersionDraftAction = {
    action: handleDeleteVersionDraft,
    label: t('deleteDraft'),
  }

  const handleSuspend = () => {
    if (activeDescriptorId) suspend({ eserviceId, descriptorId: activeDescriptorId })
  }

  const suspendAction = {
    action: handleSuspend,
    label: t('suspend'),
  }

  const handleReactivate = () => {
    if (activeDescriptorId) reactivate({ eserviceId, descriptorId: activeDescriptorId })
  }

  const reactivateAction = {
    action: handleReactivate,
    label: t('activate'),
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

  const cloneAction = {
    action: handleClone,
    label: t('clone'),
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
        agreementApprovalPolicy: 'MANUAL',
        attributes: {
          certified: [],
          declared: [],
          verified: [],
        },
      },
      {
        onSuccess({ id }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId, descriptorId: id },
            state: { stepIndexDestination: 1 },
          })
        },
      }
    )
  }

  const createNewDraftAction = {
    action: handleCreateNewDraft,
    label: t('createNewDraft'),
  }

  const handleEditDraft = () => {
    if (draftDescriptorId)
      navigate('PROVIDE_ESERVICE_EDIT', {
        params: { eserviceId, descriptorId: draftDescriptorId },
        state: { stepIndexDestination: 1 },
      })
  }

  const editDraftAction = {
    action: handleEditDraft,
    label: t('editDraft'),
  }

  const adminActions: Record<EServiceDescriptorState, Array<ActionItem>> = {
    PUBLISHED: [
      suspendAction,
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteVersionDraftAction]),
    ],
    ARCHIVED: [],
    DEPRECATED: [suspendAction],
    DRAFT: [publishDraftAction, deleteVersionDraftAction],
    SUSPENDED: [
      reactivateAction,
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteVersionDraftAction]),
    ],
  }

  const operatorAPIActions: Record<EServiceDescriptorState, Array<ActionItem>> = {
    PUBLISHED: [
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteVersionDraftAction]),
    ],
    ARCHIVED: [],
    DEPRECATED: [],
    DRAFT: [publishDraftAction, deleteVersionDraftAction],
    SUSPENDED: [
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction, deleteVersionDraftAction]),
    ],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

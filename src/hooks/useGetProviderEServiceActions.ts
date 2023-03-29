import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { useNavigateRouter } from '@/router'
import { minutesToSeconds } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'
import { useJwt } from './useJwt'

export function useGetProviderEServiceActions(
  eserviceId?: string,
  descriptorState?: EServiceDescriptorState,
  activeDescriptorId?: string,
  draftDescriptorId?: string
) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = useJwt()
  const { navigate } = useNavigateRouter()

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: deleteVersionDraft } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion()
  const { mutate: clone } = EServiceMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = EServiceMutations.useCreateVersionDraft()

  const state = descriptorState ?? 'DRAFT'
  const hasVersionDraft = !!draftDescriptorId

  if (!eserviceId || !isAdmin) return { actions: [] }

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

  const availableAction = {
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
  }[state]

  return { actions: availableAction }
}

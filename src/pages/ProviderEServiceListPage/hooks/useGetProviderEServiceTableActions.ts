import { EServiceMutations } from '@/api/eservice'
import { useNavigateRouter } from '@/router'
import { EServiceProvider } from '@/types/eservice.types'
import { minutesToSeconds } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'

function useGetProviderEServiceTableActions(eservice: EServiceProvider) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { navigate } = useNavigateRouter()

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteDraft()
  const { mutate: deleteVersionDraft } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion()
  const { mutate: clone } = EServiceMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = EServiceMutations.useCreateVersionDraft()

  const eserviceId = eservice.id
  const state = eservice.activeDescriptor?.state ?? 'DRAFT'
  const hasVersionDraft = !!eservice.draftDescriptor

  const deleteDraftAction = {
    action: deleteDraft.bind(null, { eserviceId }),
    label: t('delete'),
  }

  if (!eservice.activeDescriptor && !eservice.draftDescriptor) {
    return {
      actions: [deleteDraftAction],
    }
  }

  function handlePublishDraft() {
    const descriptorId = eservice?.draftDescriptor?.id
    if (!descriptorId) return
    publishDraft({ eserviceId, descriptorId })
  }

  const publishDraftAction = {
    action: handlePublishDraft,
    label: t('publish'),
  }

  function handleDeleteVersionDraft() {
    const descriptorId = eservice?.draftDescriptor?.id
    if (!descriptorId) return
    deleteVersionDraft({ eserviceId, descriptorId })
  }

  const deleteVersionDraftAction = {
    action: handleDeleteVersionDraft,
    label: t('delete'),
  }

  function handleSuspend() {
    const descriptorId = eservice?.activeDescriptor?.id
    if (!descriptorId) return
    suspend({ eserviceId, descriptorId })
  }

  const suspendAction = {
    action: handleSuspend,
    label: t('suspend'),
  }

  function handleReactivate() {
    const descriptorId = eservice?.activeDescriptor?.id
    if (!descriptorId) return
    reactivate({ eserviceId, descriptorId })
  }

  const reactivateAction = {
    action: handleReactivate,
    label: t('activate'),
  }

  function handleClone() {
    const descriptorId = eservice?.activeDescriptor?.id
    if (!descriptorId) return
    reactivate({ eserviceId, descriptorId })
    clone(
      {
        eserviceId,
        descriptorId,
      },
      {
        onSuccess({ id, descriptors }) {
          const descriptorId = descriptors[0]?.id
          if (!descriptorId) throw new Error('No descriptor returned from clone mutation.')
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

  const createNewDraftAction = {
    action: createNewDraft.bind(
      null,
      {
        eserviceId,
        voucherLifespan: minutesToSeconds(1),
        audience: [],
        description: '',
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
    ),
    label: t('createNewDraft'),
  }

  function handleEditDraft() {
    const descriptorId = eservice.draftDescriptor?.id
    if (!descriptorId) return
    navigate('PROVIDE_ESERVICE_EDIT', {
      params: { eserviceId, descriptorId },
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
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction]),
    ],
    ARCHIVED: [],
    DEPRECATED: [suspendAction],
    DRAFT: [publishDraftAction, deleteVersionDraftAction],
    SUSPENDED: [
      reactivateAction,
      cloneAction,
      ...(!hasVersionDraft ? [createNewDraftAction] : [editDraftAction]),
    ],
  }[state]

  return { actions: availableAction }
}

export default useGetProviderEServiceTableActions

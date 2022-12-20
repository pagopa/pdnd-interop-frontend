import { EServiceMutations } from '@/api/eservice'
import { useNavigateRouter } from '@/router'
import { ActionItem } from '@/types/common.types'
import { EServiceDescriptorProvider, EServiceState } from '@/types/eservice.types'
import { minutesToSeconds } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'

function useGetEServiceProviderActions(descriptor?: EServiceDescriptorProvider) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { navigate } = useNavigateRouter()

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft()
  const { mutate: deleteVersionDraft } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion()
  const { mutate: clone } = EServiceMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = EServiceMutations.useCreateVersionDraft()

  if (!descriptor) return { actions: [] }

  const descriptorId = descriptor.id
  const eserviceId = descriptor.eservice.id
  const state = descriptor.state

  const publishDraftAction = {
    action: publishDraft.bind(null, { eserviceId, descriptorId }),
    label: t('publish'),
  }

  const deleteVersionDraftAction = {
    action: deleteVersionDraft.bind(null, { eserviceId, descriptorId }),
    label: t('delete'),
  }
  const suspendAction = {
    action: suspend.bind(null, { eserviceId, descriptorId }),
    label: t('suspend'),
  }
  const reactivateAction = {
    action: reactivate.bind(null, { eserviceId, descriptorId }),
    label: t('activate'),
  }

  function handleClone() {
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

  function handleCreateNewDraft() {
    createNewDraft(
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
    )
  }

  const createNewDraftAction = {
    action: handleCreateNewDraft,
    label: t('createNewDraft'),
  }

  const availableAction: Record<EServiceState, Array<ActionItem>> = {
    PUBLISHED: [suspendAction, cloneAction, createNewDraftAction],
    ARCHIVED: [],
    DEPRECATED: [suspendAction],
    DRAFT: [publishDraftAction, deleteVersionDraftAction],
    SUSPENDED: [reactivateAction, cloneAction, createNewDraftAction],
  }

  return { actions: availableAction[state ?? 'DRAFT'] }
}

export default useGetEServiceProviderActions

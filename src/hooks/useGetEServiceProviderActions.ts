import { EServiceMutations } from '@/api/eservice'
import { ActionItem } from '@/types/common.types'
import { EServiceState } from '@/types/eservice.types'
import { minutesToSeconds } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'

function useGetEServiceProviderActions({
  eserviceId,
  descriptorId,
  state,
}: {
  eserviceId: string
  descriptorId: string | undefined
  state: EServiceState | undefined
}) {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { mutate: publishDraft } = EServiceMutations.usePublishVersionDraft()
  const { mutate: deleteDraft } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion()
  const { mutate: clone } = EServiceMutations.useCloneFromVersion()
  const { mutate: createNewDraft } = EServiceMutations.useCreateVersionDraft()

  if (!descriptorId) return { actions: [] }

  const eserviceState = state ?? 'DRAFT'

  const publishDraftAction = {
    action: publishDraft.bind(null, { eserviceId, descriptorId }),
    label: t('publish'),
  }
  const deleteDraftAction = {
    action: deleteDraft.bind(null, { eserviceId, descriptorId }),
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
  const cloneAction = {
    action: clone.bind(null, { eserviceId, descriptorId }),
    label: t('clone'),
  }
  const createNewDraftAction = {
    action: createNewDraft.bind(null, {
      eserviceId,
      voucherLifespan: minutesToSeconds(1),
      audience: [],
      description: '',
      dailyCallsPerConsumer: 1,
      dailyCallsTotal: 1,
      agreementApprovalPolicy: 'MANUAL',
    }),
    label: t('createNewDraft'),
  }

  const availableAction: Record<EServiceState, Array<ActionItem>> = {
    PUBLISHED: [suspendAction, cloneAction, createNewDraftAction],
    ARCHIVED: [],
    DEPRECATED: [suspendAction],
    DRAFT: [publishDraftAction, deleteDraftAction],
    SUSPENDED: [reactivateAction, cloneAction, createNewDraftAction],
  }

  return { actions: availableAction[eserviceState] }
}

export default useGetEServiceProviderActions

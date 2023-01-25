import { AgreementState, AgreementSummary } from '@/types/agreement.types'
import { AgreementMutations } from '@/api/agreement'
import { ActionItem } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { useCurrentRoute, useNavigateRouter } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'
import { useDialog } from '@/stores'

type AgreementActions = Record<AgreementState, Array<ActionItem>>

function useGetAgreementsActions(agreement: AgreementSummary | undefined): {
  actions: Array<ActionItem>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { mode } = useCurrentRoute()
  const { openDialog } = useDialog()
  const { navigate } = useNavigateRouter()

  const { mutate: activateAgreement } = AgreementMutations.useActivate()
  const { mutate: suspendAgreement } = AgreementMutations.useSuspend()
  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()
  const { mutate: deleteAgreement } = AgreementMutations.useDeleteDraft()

  if (!agreement || mode === null) return { actions: [] }

  const canBeUpgraded = canAgreementBeUpgraded(agreement, mode)

  const handleActivate = () => {
    activateAgreement({ agreementId: agreement.id })
  }

  const handleSuspend = () => {
    suspendAgreement({ agreementId: agreement.id })
  }

  const handleUpgrade = () => {
    upgradeAgreement({ agreementId: agreement.id })
  }

  const handleDelete = () => {
    deleteAgreement(
      { agreementId: agreement.id },
      {
        onSuccess() {
          const routeKey =
            mode === 'provider' ? 'PROVIDE_AGREEMENT_LIST' : 'SUBSCRIBE_AGREEMENT_LIST'
          navigate(routeKey)
        },
      }
    )
  }

  const handleReject = () => {
    openDialog({ type: 'rejectAgreement', agreementId: agreement.id })
  }

  const consumerOnlyActions: AgreementActions = {
    ACTIVE: [
      { action: handleSuspend, label: t('suspend') },
      ...(canBeUpgraded ? [{ action: handleUpgrade, label: t('upgrade') }] : []),
    ],
    SUSPENDED: agreement.suspendedByConsumer
      ? [{ action: handleActivate, label: t('activate') }]
      : [{ action: handleSuspend, label: t('suspend') }],
    PENDING: [],
    ARCHIVED: [],
    DRAFT: [{ action: handleDelete, label: t('delete') }],
    REJECTED: [],
    MISSING_CERTIFIED_ATTRIBUTES: [{ action: handleDelete, label: t('delete') }],
  }

  const providerOnlyActions: AgreementActions = {
    ACTIVE: [{ action: handleSuspend, label: t('suspend') }],
    SUSPENDED: agreement.suspendedByProducer
      ? [{ action: handleActivate, label: t('activate') }]
      : [{ action: handleSuspend, label: t('suspend') }],
    PENDING: [
      { action: handleActivate, label: t('activate') },
      { action: handleReject, label: t('reject') },
    ],
    ARCHIVED: [],
    DRAFT: [],
    REJECTED: [],
    MISSING_CERTIFIED_ATTRIBUTES: [],
  }

  const actions: AgreementActions = {
    provider: providerOnlyActions,
    consumer: consumerOnlyActions,
  }[mode]

  return { actions: actions[agreement.state] }
}

export default useGetAgreementsActions

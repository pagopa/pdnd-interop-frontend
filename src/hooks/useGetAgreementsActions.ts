import { AgreementState, AgreementSummary } from '@/types/agreement.types'
import { AgreementMutations } from '@/api/agreement'
import { ActionItem } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { useCurrentRoute } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'

type AgreementActions = Record<AgreementState, Array<ActionItem>>

function useGetAgreementsActions(agreement: AgreementSummary | undefined): {
  actions: Array<ActionItem>
} {
  const { mode } = useCurrentRoute()
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

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
    deleteAgreement({ agreementId: agreement.id })
  }

  const subscriberOnlyActionsActive: Array<ActionItem> = [
    { action: handleSuspend, label: t('suspend') },
  ]
  if (canBeUpgraded) {
    subscriberOnlyActionsActive.push({
      action: handleUpgrade,
      label: t('upgrade'),
    })
  }

  const subscriberOnlyActions: AgreementActions = {
    ACTIVE: subscriberOnlyActionsActive,
    SUSPENDED: [{ action: handleActivate, label: t('activate') }],
    PENDING: [],
    ARCHIVED: [],
    DRAFT: [{ action: handleDelete, label: t('delete') }],
    REJECTED: [],
    MISSING_CERTIFIED_ATTRIBUTES: [{ action: handleDelete, label: t('delete') }],
  }

  const providerOnlyActions: AgreementActions = {
    ACTIVE: [{ action: handleSuspend, label: t('suspend') }],
    SUSPENDED: [{ action: handleActivate, label: t('activate') }],
    PENDING: [{ action: handleActivate, label: t('activate') }],
    ARCHIVED: [],
    DRAFT: [],
    REJECTED: [],
    MISSING_CERTIFIED_ATTRIBUTES: [],
  }

  const actions: AgreementActions = {
    provider: providerOnlyActions,
    consumer: subscriberOnlyActions,
  }[mode]

  return { actions: actions[agreement.state] }
}

export default useGetAgreementsActions

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
  const { mutate: cloneAgreement } = AgreementMutations.useClone()

  if (!agreement || mode === null) return { actions: [] }

  const canBeUpgraded = canAgreementBeUpgraded(agreement, mode)

  const handleActivate = () => {
    activateAgreement({ agreementId: agreement.id })
  }
  const activateAction = { action: handleActivate, label: t('activate') }

  const handleSuspend = () => {
    suspendAgreement({ agreementId: agreement.id })
  }
  const suspendAction = { action: handleSuspend, label: t('suspend') }

  const handleUpgrade = () => {
    upgradeAgreement({ agreementId: agreement.id })
  }
  const upgradeAction = { action: handleUpgrade, label: t('upgrade') }

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
  const deleteAction = { action: handleDelete, label: t('delete') }

  const handleReject = () => {
    openDialog({ type: 'rejectAgreement', agreementId: agreement.id })
  }
  const rejectAction = { action: handleReject, label: t('reject') }

  const handleClone = () => {
    cloneAgreement(
      { agreementId: agreement.id },
      {
        onSuccess({ id }) {
          navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
        },
      }
    )
  }
  const cloneAction = {
    action: handleClone,
    label: t('clone'),
  }

  const consumerOnlyActions: AgreementActions = {
    ACTIVE: [suspendAction, ...(canBeUpgraded ? [upgradeAction] : [])],
    SUSPENDED: agreement.suspendedByConsumer ? [activateAction] : [suspendAction],
    PENDING: [],
    ARCHIVED: [],
    DRAFT: [deleteAction],
    REJECTED: [cloneAction],
    MISSING_CERTIFIED_ATTRIBUTES: [deleteAction],
  }

  const providerOnlyActions: AgreementActions = {
    ACTIVE: [suspendAction],
    SUSPENDED: agreement.suspendedByProducer ? [activateAction] : [suspendAction],
    PENDING: [activateAction, rejectAction],
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

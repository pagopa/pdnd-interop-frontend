import { AgreementMutations } from '@/api/agreement'
import type { ActionItem, ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { useCurrentRoute, useNavigate } from '@/router'
import { useDialog } from '@/stores'
import { useJwt } from './useJwt'
import type { Agreement, AgreementListEntry, AgreementState } from '@/api/api.generatedTypes'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArchiveIcon from '@mui/icons-material/Archive'

type AgreementActions = Record<AgreementState, Array<ActionItem>>

function useGetAgreementsActions(agreement?: Agreement | AgreementListEntry): {
  actions: Array<ActionItemButton>
} {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  const { mode, routeKey } = useCurrentRoute()
  const { isAdmin } = useJwt()
  const { openDialog } = useDialog()
  const navigate = useNavigate()

  const { mutate: activateAgreement } = AgreementMutations.useActivate()
  const { mutate: suspendAgreement } = AgreementMutations.useSuspend()
  const { mutate: deleteAgreement } = AgreementMutations.useDeleteDraft()
  const { mutate: cloneAgreement } = AgreementMutations.useClone()
  const { mutate: archiveAgreement } = AgreementMutations.useArchive()

  if (!agreement || mode === null || !isAdmin) return { actions: [] }

  const handleActivate = () => {
    activateAgreement({ agreementId: agreement.id })
  }
  const activateAction: ActionItemButton = {
    action: handleActivate,
    label: t('activate'),
    icon: PlayCircleOutlineIcon,
  }

  const handleSuspend = () => {
    suspendAgreement({ agreementId: agreement.id })
  }

  const suspendAction: ActionItemButton = {
    action: handleSuspend,
    label: t('suspend'),
    color: 'error',
    icon: PauseCircleOutlineIcon,
  }

  const handleArchive = () => {
    archiveAgreement({ agreementId: agreement.id })
  }

  const archiveAction: ActionItemButton = {
    action: handleArchive,
    label: t('archive'),
    icon: ArchiveIcon,
  }

  const handleDelete = () => {
    deleteAgreement(
      { agreementId: agreement.id },
      {
        onSuccess() {
          if (routeKey === 'SUBSCRIBE_AGREEMENT_LIST') return
          navigate('SUBSCRIBE_AGREEMENT_LIST')
        },
      }
    )
  }
  const deleteAction: ActionItemButton = {
    action: handleDelete,
    label: t('delete'),
    color: 'error',
    icon: DeleteOutlineIcon,
  }

  const handleReject = () => {
    openDialog({ type: 'rejectAgreement', agreementId: agreement.id })
  }

  const rejectAction: ActionItemButton = {
    action: handleReject,
    label: t('reject'),
    icon: CloseIcon,
    color: 'error',
  }

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
  const cloneAction: ActionItemButton = {
    action: handleClone,
    label: t('clone'),
    icon: ContentCopyIcon,
  }

  const consumerOnlyActions: AgreementActions = {
    ACTIVE: [archiveAction, suspendAction],
    SUSPENDED: [archiveAction, agreement.suspendedByConsumer ? activateAction : suspendAction],
    PENDING: [],
    ARCHIVED: [],
    DRAFT: [deleteAction],
    REJECTED: [cloneAction],
    MISSING_CERTIFIED_ATTRIBUTES: [deleteAction],
  }

  const providerOnlyActions: AgreementActions = {
    ACTIVE: [suspendAction],
    SUSPENDED: agreement.suspendedByProducer ? [activateAction] : [suspendAction],
    PENDING: [rejectAction, activateAction],
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

import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { checkPurposeSuspendedByConsumer } from '@/utils/purpose.utils'
import { useNavigate } from '@/router'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

function useGetConsumerPurposesActions(purpose?: Purpose) {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const navigate = useNavigate()
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const { mutate: archivePurpose } = PurposeMutations.useArchiveVersion()
  const { mutate: suspendPurpose } = PurposeMutations.useSuspendVersion()
  const { mutate: clonePurpose } = PurposeMutations.useClone()
  const { mutate: activatePurpose } = PurposeMutations.useActivateVersion()
  const { mutate: deletePurposeDraft } = PurposeMutations.useDeleteDraft()

  const { data: riskAnalysis } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })

  if (!purpose || !isAdmin) return { actions: [] }

  function handleArchive() {
    if (!purpose) return
    const currentVersion = purpose.currentVersion
    if (currentVersion) {
      archivePurpose({ purposeId: purpose.id, versionId: currentVersion.id })
    }
  }

  const archiveAction: ActionItemButton = {
    label: tCommon('archive'),
    action: handleArchive,
    icon: ArchiveIcon,
  }

  function handleSuspend() {
    if (!purpose) return
    const currentVersion = purpose.currentVersion
    if (currentVersion) {
      suspendPurpose({ purposeId: purpose.id, versionId: currentVersion.id })
    }
  }

  const suspendAction: ActionItemButton = {
    label: tCommon('suspend'),
    action: handleSuspend,
    icon: PauseCircleOutlineIcon,
    color: 'error',
  }

  function handleActivate() {
    if (!purpose) return
    const currentVersion = purpose.currentVersion
    if (currentVersion) {
      activatePurpose({ purposeId: purpose.id, versionId: currentVersion.id })
    }
  }

  const activateAction: ActionItemButton = {
    label: tCommon('activate'),
    action: handleActivate,
    icon: PlayCircleOutlineIcon,
  }

  function handleClone() {
    if (!purpose) return
    clonePurpose(
      { purposeId: purpose.id, eserviceId: purpose.eservice.id },
      {
        onSuccess({ purposeId }) {
          navigate('SUBSCRIBE_PURPOSE_EDIT', { params: { purposeId } })
        },
      }
    )
  }

  const cloneAction: ActionItemButton = {
    label: tCommon('clone'),
    action: handleClone,
    icon: ContentCopyIcon,
  }

  function handleDeleteDraft() {
    if (!purpose) return
    deletePurposeDraft({ purposeId: purpose.id })
  }

  const deleteAction: ActionItemButton = {
    label: tCommon('delete'),
    action: handleDeleteDraft,
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  if (!purpose.currentVersion && purpose.waitingForApprovalVersion) {
    return { actions: [deleteAction] }
  }

  if (purpose?.currentVersion?.state === 'ARCHIVED') {
    return { actions: [cloneAction] }
  }

  if (purpose?.currentVersion?.state === 'DRAFT') {
    const actions = [deleteAction]
    if (purpose.riskAnalysisForm?.version === riskAnalysis?.version) {
      actions.push(activateAction)
    }
    return { actions }
  }

  // If the currentVestion is not ARCHIVED or in DRAFT...

  const actions: Array<ActionItemButton> = [archiveAction, cloneAction]

  const isSuspended = purpose?.currentVersion && purpose?.currentVersion.state === 'SUSPENDED'
  const isActive = purpose?.currentVersion && purpose?.currentVersion.state === 'ACTIVE'

  const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(purpose, jwt?.organizationId)

  if (isActive || (isSuspended && !isSuspendedByConsumer)) {
    actions.push(suspendAction)
  }

  if (isSuspended && isSuspendedByConsumer) {
    actions.push(activateAction)
  }

  return { actions }
}

export default useGetConsumerPurposesActions

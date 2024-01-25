import { PurposeMutations } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { checkPurposeSuspendedByConsumer } from '@/utils/purpose.utils'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useDialog } from '@/stores'

function useGetConsumerPurposesActions(purpose?: Purpose) {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const { openDialog } = useDialog()

  const { mutate: archivePurpose } = PurposeMutations.useArchiveVersion()
  const { mutate: suspendPurpose } = PurposeMutations.useSuspendVersion()
  const { mutate: activatePurpose } = PurposeMutations.useActivateVersion()
  const { mutate: deletePurposeDraft } = PurposeMutations.useDeleteDraft()

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
    openDialog({ type: 'clonePurpose', purposeId: purpose.id, eservice: purpose.eservice })
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

  if (purpose?.currentVersion?.state === 'ARCHIVED' && purpose.eservice.mode === 'DELIVER') {
    return { actions: [cloneAction] }
  }

  if (purpose?.currentVersion?.state === 'DRAFT') {
    return { actions: [activateAction, deleteAction] }
  }

  // If the currentVestion is not ARCHIVED or in DRAFT...

  const actions: Array<ActionItemButton> = [archiveAction]

  if (purpose.eservice.mode === 'DELIVER') {
    actions.push(cloneAction)
  }

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

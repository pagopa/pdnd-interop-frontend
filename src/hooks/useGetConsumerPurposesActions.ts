import { PurposeMutations } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { checkIsRulesetExpired, checkPurposeSuspendedByConsumer } from '@/utils/purpose.utils'
import type { Purpose } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useDialog } from '@/stores'
import { useCheckRiskAnalysisVersionMismatch } from './useCheckRiskAnalysisVersionMismatch'
import { useCurrentRoute, useNavigate } from '@/router'
import { match } from 'ts-pattern'

// Source of truth about purpose here: https://pagopa.atlassian.net/wiki/spaces/PDNDI/pages/626360386/Purpose+Version+Lifecycle

function useGetConsumerPurposesActions(purpose?: Purpose) {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('purpose', { keyPrefix: 'consumerView' })
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()
  const { routeKey } = useCurrentRoute()

  const { openDialog } = useDialog()

  const { mutate: archivePurpose } = PurposeMutations.useArchiveVersion()
  const { mutate: suspendPurpose } = PurposeMutations.useSuspendVersion()
  const { mutate: activatePurpose } = PurposeMutations.useActivateVersion()
  const { mutate: deletePurposeDraft } = PurposeMutations.useDeleteDraft()

  const isThereConsumerDelegation = Boolean(purpose?.delegation)
  const isDelegationMine =
    isThereConsumerDelegation && purpose?.delegation?.delegate.id === jwt?.organizationId

  const hasRiskAnalysisVersionMismatch = useCheckRiskAnalysisVersionMismatch(purpose)
  const isNotPublishable =
    purpose?.currentVersion?.state === 'DRAFT' &&
    ((purpose?.eservice.mode === 'DELIVER' && hasRiskAnalysisVersionMismatch) ||
      purpose?.agreement.state === 'ARCHIVED' ||
      purpose?.eservice.descriptor.state === 'ARCHIVED')

  const expirationDate = purpose?.rulesetExpiration
  const isRulesetExpired = checkIsRulesetExpired(expirationDate)

  if (
    !purpose ||
    !isAdmin ||
    (purpose.delegation && purpose.delegation.delegator.id === jwt?.organizationId)
  )
    return { actions: [] }

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
      suspendPurpose({
        purposeId: purpose.id,
        versionId: currentVersion.id,
        ...(isDelegationMine && { delegationId: purpose.delegation?.id }),
      })
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
      activatePurpose({
        purposeId: purpose.id,
        versionId: currentVersion.id,
        ...(isDelegationMine && { delegationId: purpose.delegation?.id }),
      })
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
    disabled: isRulesetExpired,
    tooltip: isRulesetExpired ? t('cloneDisabledDueToExpiredRuleset') : undefined,
  }

  function handleDeleteDraft() {
    if (!purpose) return
    deletePurposeDraft(
      { purposeId: purpose.id },
      {
        onSuccess: () => {
          if (routeKey !== 'SUBSCRIBE_PURPOSE_LIST') navigate('SUBSCRIBE_PURPOSE_LIST')
        },
      }
    )
  }

  const deleteAction: ActionItemButton = {
    label: tCommon('delete'),
    action: handleDeleteDraft,
    icon: DeleteOutlineIcon,
    color: 'error',
  }

  function addConsumerPurposesActions({
    includeCloneAction,
  }: {
    includeCloneAction: boolean
  }): ActionItemButton[] {
    const actions: ActionItemButton[] = [archiveAction]

    if (includeCloneAction) {
      actions.push(cloneAction)
    }

    if (isActive || (isSuspended && !isSuspendedByConsumer)) {
      actions.push(suspendAction)
    }

    if (isSuspended && isSuspendedByConsumer) {
      actions.push(activateAction)
    }

    return actions
  }

  const isDeliverMode = purpose.eservice.mode === 'DELIVER'
  const isSuspended = purpose?.currentVersion?.state === 'SUSPENDED'
  const isActive = purpose?.currentVersion?.state === 'ACTIVE'
  const isDraft = purpose?.currentVersion?.state === 'DRAFT'
  const isArchived = purpose?.currentVersion?.state === 'ARCHIVED'
  const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(purpose, jwt?.organizationId)

  const hasCurrentVersion = Boolean(purpose?.currentVersion)
  const hasWaitingForApprovalVersion = Boolean(purpose?.waitingForApprovalVersion)
  const hasRejectedVersion = Boolean(purpose?.rejectedVersion)

  const actions = match({
    isDeliverMode,
    isDraft,
    isArchived,
    isActive,
    isSuspended,
    isSuspendedByConsumer,
    isNotPublishable,
    isRulesetExpired,
    hasCurrentVersion,
    hasWaitingForApprovalVersion,
    hasRejectedVersion,
    routeKey,
  })
    // purpose with no currentVersion but with waitingForApprovalVersion
    .with(
      {
        hasCurrentVersion: false,
        hasWaitingForApprovalVersion: true,
      },
      ({ isSuspendedByConsumer }) => (isSuspendedByConsumer ? [] : [deleteAction])
    )
    // DELIVER mode + purpose rejected OR archived state
    .with(
      {
        isDeliverMode: true,
        hasCurrentVersion: false,
        hasRejectedVersion: true,
      },
      () => [cloneAction]
    )
    .with(
      {
        isArchived: true,
      },
      () => []
    )
    // purpose in DRAFT state
    .with(
      {
        isDraft: true,
        isNotPublishable: true,
      },
      () => [deleteAction]
    )
    .with(
      {
        isDraft: true,
        isNotPublishable: false,
      },
      () => [activateAction, deleteAction]
    )
    .with(
      {
        isDeliverMode: true,
        hasCurrentVersion: true,
      },
      () => {
        return addConsumerPurposesActions({
          includeCloneAction: !(routeKey === 'SUBSCRIBE_PURPOSE_LIST' && isRulesetExpired),
        })
      }
    )
    .otherwise(() => {
      return addConsumerPurposesActions({ includeCloneAction: false })
    })

  return { actions }
}

export default useGetConsumerPurposesActions

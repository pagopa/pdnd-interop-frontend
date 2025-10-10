import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useLocation, useNavigate } from '@/router'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { PurposeTemplate, TenantKind } from '@/api/api.generatedTypes'

function useGetConsumerPurposeTemplateTemplatesActions(
  tenantKind: TenantKind,
  purposeTemplate?: PurposeTemplate
) {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read' })
  const { isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()
  const { routeKey } = useLocation()

  const { mutate: archivePurposeTemplate } = PurposeTemplateMutations.useArchivePurposeTemplate()
  const { mutate: suspendPurposeTemplate } = PurposeTemplateMutations.useSuspendPurposeTemplate()
  const { mutate: reactivatePurposeTemplate } =
    PurposeTemplateMutations.useReactivatePurposeTemplate()
  const { mutate: deletePurposeTemplateDraft } = PurposeTemplateMutations.useDeleteDraft()
  const { mutate: publishPurposeTemplateDraft } = PurposeTemplateMutations.usePublishDraft()

  if (!purposeTemplate || !isAdmin) return { actions: [] }

  function handleArchive() {
    if (!purposeTemplate) return
    archivePurposeTemplate({
      id: purposeTemplate.id,
    })
  }

  const archiveAction: ActionItemButton = {
    label: tCommon('archive'),
    action: handleArchive,
    icon: ArchiveIcon,
  }

  function handleSuspend() {
    if (!purposeTemplate) return
    suspendPurposeTemplate({
      id: purposeTemplate.id,
    })
  }

  const suspendAction: ActionItemButton = {
    label: tCommon('suspend'),
    action: handleSuspend,
    icon: PauseCircleOutlineIcon,
    color: 'error',
  }

  function handleActivate() {
    if (!purposeTemplate) return
    reactivatePurposeTemplate({
      id: purposeTemplate.id,
    })
  }

  const activateAction: ActionItemButton = {
    label: tCommon('activate'),
    action: handleActivate,
    icon: PlayCircleOutlineIcon,
  }

  function handleDeleteDraft() {
    if (!purposeTemplate) return
    deletePurposeTemplateDraft(
      { id: purposeTemplate.id },
      {
        onSuccess: () => {
          if (routeKey !== 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST')
            navigate('SUBSCRIBE_PURPOSE_TEMPLATE_LIST')
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

  function handlePublishDraft() {
    if (!purposeTemplate) return
    publishPurposeTemplateDraft({ id: purposeTemplate.id })
  }

  const publishAction: ActionItemButton = {
    label: tCommon('publishDraft'),
    action: handlePublishDraft,
  }

  const usePurposeTemplateAction: ActionItemButton = {
    label: t('actions.createNewPurposeInstance'),
    action: handleUsePurposeTemplateAction,
    variant: 'contained',
    disabled: tenantKind !== purposeTemplate.targetTenantKind,
    tooltip: t('actions.tooltip'),
  }

  function handleUsePurposeTemplateAction() {
    if (!purposeTemplate) return
    console.log('create purpose draft') //TODO: API CALL
  }

  if (purposeTemplate?.state === 'DRAFT') {
    return { actions: [deleteAction, publishAction] }
  }

  const actions: Array<ActionItemButton> = []

  const isSuspended = purposeTemplate?.state === 'SUSPENDED'
  const isActive = purposeTemplate?.state === 'ACTIVE'
  const isArchived = purposeTemplate?.state === 'ARCHIVED'

  if (isActive) {
    actions.push(usePurposeTemplateAction)
    actions.push(suspendAction)
  }

  if (isSuspended) {
    actions.push(activateAction)
  }

  if (!isArchived) {
    actions.push(archiveAction)
  }

  return { actions }
}

export default useGetConsumerPurposeTemplateTemplatesActions

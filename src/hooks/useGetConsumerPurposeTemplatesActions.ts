import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { useCurrentRoute, useNavigate } from '@/router'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { CreatorPurposeTemplate, TenantKind } from '@/api/api.generatedTypes'
import { tenantKindForPurposeTemplate } from '@/utils/tenant.utils'

function useGetConsumerPurposeTemplateTemplatesActions(
  tenantKind: TenantKind,
  purposeTemplate?: CreatorPurposeTemplate
) {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read' })
  const { isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()
  const { routeKey } = useCurrentRoute()

  const { mutate: archivePurposeTemplate } = PurposeTemplateMutations.useArchivePurposeTemplate()
  const { mutate: suspendPurposeTemplate } = PurposeTemplateMutations.useSuspendPurposeTemplate()
  const { mutate: reactivatePurposeTemplate } =
    PurposeTemplateMutations.useReactivatePurposeTemplate()
  const { mutate: deletePurposeTemplateDraft } = PurposeTemplateMutations.useDeleteDraft()
  const { mutate: publishPurposeTemplateDraft } = PurposeTemplateMutations.usePublishDraft()

  const tenantKindNormalized = tenantKindForPurposeTemplate(tenantKind) // normalize tenant kind for purpose templates: map all non-PA kinds to PRIVATE because RA for scp/gsp/private are the same

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
    disabled: tenantKindNormalized !== purposeTemplate.targetTenantKind,
    tooltip:
      tenantKindNormalized !== purposeTemplate.targetTenantKind ? t('actions.tooltip') : undefined,
  }

  function handleUsePurposeTemplateAction() {
    if (!purposeTemplate) return
    navigate('SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE', {
      params: { purposeTemplateId: purposeTemplate.id },
    })
  }

  if (purposeTemplate?.state === 'DRAFT') {
    return { actions: [deleteAction, publishAction] }
  }

  const actions: Array<ActionItemButton> = []

  const isSuspended = purposeTemplate?.state === 'SUSPENDED'
  const isActive = purposeTemplate?.state === 'PUBLISHED'
  const isArchived = purposeTemplate?.state === 'ARCHIVED'

  if (isActive) {
    actions.push(usePurposeTemplateAction)
    if (routeKey !== 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS') {
      actions.push(suspendAction)
    }
  }

  if (isSuspended && routeKey !== 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS') {
    actions.push(activateAction)
  }

  if (!isArchived && routeKey !== 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS') {
    actions.push(archiveAction)
  }

  return { actions }
}

export default useGetConsumerPurposeTemplateTemplatesActions

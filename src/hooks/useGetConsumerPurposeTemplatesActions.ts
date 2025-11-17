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
import { match, P } from 'ts-pattern'

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

  const state = purposeTemplate?.state
  const isList = routeKey === 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST'
  const isCatalogDetails = routeKey === 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS'

  const actions = match({ state, isList, isCatalogDetails })
    .with({ state: 'DRAFT' }, () => [deleteAction, publishAction])

    .with({ state: 'PUBLISHED', isCatalogDetails: false }, ({ isList }) => {
      const arr: ActionItemButton[] = []

      const canUse = !isList || tenantKindNormalized === purposeTemplate.targetTenantKind
      if (canUse) arr.push(usePurposeTemplateAction)

      arr.push(suspendAction)

      arr.push(archiveAction)

      return arr
    })

    .with({ state: 'PUBLISHED', isCatalogDetails: true }, () => [usePurposeTemplateAction])

    .with({ state: 'SUSPENDED', isCatalogDetails: false }, () => [activateAction, archiveAction])

    .with({ isCatalogDetails: false, state: P.not('ARCHIVED') }, () => [archiveAction])

    .otherwise(() => [])
  return { actions }
}

export default useGetConsumerPurposeTemplateTemplatesActions

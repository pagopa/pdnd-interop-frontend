import type { EServiceTemplateVersionState } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import { useDialog } from '@/stores'
import { match } from 'ts-pattern'
import { TemplateMutations } from '@/api/template'
import FiberNewIcon from '@mui/icons-material/FiberNew'

export function useGetConsumerEServiceTemplateActions(
  eServiceTemplateId: string,
  eServiceTemplateVersionId: string,
  activeVersionState?: EServiceTemplateVersionState | undefined
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('template', { keyPrefix: 'actions' })

  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { openDialog, closeDialog } = useDialog()

  const { mutate: createEServiceFromTemplate } =
    TemplateMutations.useCreateInstanceFromEServiceTemplate()

  const state = activeVersionState ?? 'DRAFT'

  // Only admin and operatorAPI can see actions
  if (!isAdmin && !isOperatorAPI) return { actions: [] }

  const handleCreateEServiceFromTemplate = () => {
    if (state === 'PUBLISHED')
      createEServiceFromTemplate(
        { eServiceTemplateId },
        {
          onSuccess({ id }) {
            navigate('PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE', {
              params: { eServiceTemplateId: id },
            })
          },
        }
      )
    // Add navigation field
  }

  const newEServiceFromTemplateAction: ActionItemButton = {
    action: handleCreateEServiceFromTemplate,
    label: t('createNewEServiceInstance'),
    icon: FiberNewIcon,
  }

  const publishedConsumerActions = match({
    isAdmin,
  })
    .with({ isAdmin: true }, () => [newEServiceFromTemplateAction])
    .otherwise(() => [])

  const adminActions: Record<EServiceTemplateVersionState, Array<ActionItemButton>> = {
    PUBLISHED: publishedConsumerActions,
    DRAFT: [],
    SUSPENDED: [],
    DEPRECATED: [],
  }

  const operatorAPIActions: Record<EServiceTemplateVersionState, Array<ActionItemButton>> = {
    PUBLISHED: [],
    DRAFT: [],
    SUSPENDED: [],
    DEPRECATED: [],
  }

  const availableAction = isAdmin ? adminActions[state] : operatorAPIActions[state]

  return { actions: availableAction }
}

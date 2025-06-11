import type { EServiceTemplateVersionState } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import type { ActionItemButton } from '@/types/common.types'
import { AuthHooks } from '@/api/auth'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import { EServiceQueries } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'

export function useGetConsumerEServiceTemplateActions(
  eServiceTemplateId: string,
  canBeInstantiated: boolean,
  activeVersionState?: EServiceTemplateVersionState | undefined
): { actions: Array<ActionItemButton> } {
  const { t } = useTranslation('template', { keyPrefix: 'actions' })

  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const navigate = useNavigate()

  const state = activeVersionState ?? 'DRAFT'

  // Only admin and operatorAPI can see actions
  if (!isAdmin && !isOperatorAPI) return { actions: [] }

  const handleCreateEServiceFromTemplate = () => {
    navigate('PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE', {
      params: { eServiceTemplateId: eServiceTemplateId },
    })
  }

  const tooltipLabel = t('createNewEServiceInstanceDisabled')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  const newEServiceFromTemplateAction: ActionItemButton = {
    action: handleCreateEServiceFromTemplate,
    label: t('createNewEServiceInstance'),
    icon: FiberNewIcon,
    disabled: !canBeInstantiated,
  }

  const publishedConsumerActions = [newEServiceFromTemplateAction]

  const adminActions: Record<EServiceTemplateVersionState, Array<ActionItemButton>> = {
    PUBLISHED: isAdmin ? publishedConsumerActions : [],
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

import CloseIcon from '@mui/icons-material/Close'
import { Stack } from '@mui/material'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import type { useParams } from '@/router'
import { Link, type RouteKey } from '@/router'
import { useDialog } from '@/stores'
import { Breadcrumbs } from '../Breadcrumbs'

type RouteParams<TRouteKey extends RouteKey> = ReturnType<typeof useParams<TRouteKey>>

export type PageExitAction = {
  [K in RouteKey]: {
    to: K
    params?: RouteParams<K>
    urlParams?: Record<string, string>
  }
}[RouteKey]

export type PageNavigationProps =
  | {
      mode?: 'breadcrumbs'
      showBackButton?: boolean
      exitAction?: never
      hasUnsavedChanges?: never
      stepKey?: never
    }
  | {
      mode: 'back'
      showBackButton?: never
      exitAction?: never
      hasUnsavedChanges?: never
      stepKey?: never
    }
  | {
      mode: 'wizard'
      exitAction: PageExitAction
      showBackButton?: never
      hasUnsavedChanges?: boolean
      stepKey?: string | number
    }

export const PageNavigation: React.FC<PageNavigationProps> = (props) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'pageNavigation',
  })
  const navigate = useNavigate()
  const { openDialog } = useDialog()

  if (props.mode === 'wizard') {
    const { exitAction, hasUnsavedChanges = false } = props
    const handleExit = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!hasUnsavedChanges) return
      if (!(event.target instanceof Element)) return

      const exitLink = event.target.closest('a')
      if (!exitLink) return

      event.preventDefault()

      const routeNavigate = navigate as (
        routeKey: RouteKey,
        options?: {
          params?: Record<string, string>
          urlParams?: Record<string, string>
        }
      ) => void

      const navigateOptions = exitAction.urlParams ? { urlParams: exitAction.urlParams } : undefined
      const routeConfig = exitAction.params
        ? { ...navigateOptions, params: exitAction.params }
        : navigateOptions

      openDialog({
        type: 'basic',
        title: t('exitDialog.title'),
        description: t('exitDialog.description'),
        cancelLabel: t('exitDialog.cancelButton'),
        proceedLabel: t('exitDialog.confirmButton'),
        onProceed: () => routeNavigate(exitAction.to, routeConfig),
      })
    }

    return (
      <Stack alignItems="flex-start" sx={{ mb: 1 }} onClickCapture={handleExit}>
        <Link
          to={exitAction.to}
          params={exitAction.params}
          options={exitAction.urlParams ? { urlParams: exitAction.urlParams } : undefined}
          as="button"
          size="small"
          startIcon={<CloseIcon />}
          variant="naked"
        >
          {t('exitButton')}
        </Link>
      </Stack>
    )
  }

  return (
    <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ mb: 1 }}>
      <Breadcrumbs />
    </Stack>
  )
}

import CloseIcon from '@mui/icons-material/Close'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link, type NavigationTarget } from '@/router'
import { useDialog } from '@/stores'
import { Breadcrumbs } from '../Breadcrumbs'

export type PageExitAction = NavigationTarget

export type PageNavigationProps =
  | {
      mode?: 'breadcrumbs'
      exitAction?: never
      hasUnsavedChanges?: never
      stepKey?: never
    }
  | {
      mode: 'wizard'
      exitAction: PageExitAction
      hasUnsavedChanges?: boolean
      stepKey?: string | number
    }

export const PageNavigation: React.FC<PageNavigationProps> = (props) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'pageNavigation',
  })
  const { openDialog } = useDialog()

  if (props.mode === 'wizard') {
    const { exitAction, hasUnsavedChanges = false } = props
    const handleExit = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!hasUnsavedChanges) return
      if (!(event.target instanceof Element)) return

      const exitLink = event.target.closest('a')
      if (!exitLink) return

      event.preventDefault()

      openDialog({
        type: 'navigation',
        title: t('exitDialog.title'),
        description: t('exitDialog.description'),
        cancelLabel: t('exitDialog.cancelButton'),
        proceedLabel: t('exitDialog.confirmButton'),
        destination: exitAction,
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
          color="inherit"
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

import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { DialogSessionExpiredProps } from '@/types/dialog.types'
import { useNavigateRouter } from '@/router'

export const DialogSessionExpired: React.FC<DialogSessionExpiredProps> = () => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogSessionExpired' })
  const { navigate } = useNavigateRouter()

  const logout = React.useCallback(() => {
    navigate('LOGOUT')
  }, [navigate])

  React.useEffect(() => {
    const timer = setTimeout(logout, 2500)
    return () => clearTimeout(timer)
  }, [logout])

  return (
    <Dialog open aria-labelledby={ariaLabelId} aria-describedby={ariaDescriptionId} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent id={ariaDescriptionId}>{t('content.description')}</DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={logout}>
          {t('actions.confirmLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

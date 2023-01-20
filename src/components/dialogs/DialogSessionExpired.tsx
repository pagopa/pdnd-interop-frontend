import React from 'react'
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DialogSessionExpiredProps } from '@/types/dialog.types'
import { useNavigateRouter } from '@/router'
import { DialogContainer } from './DialogContainer'

export const DialogSessionExpired: React.FC<DialogSessionExpiredProps> = () => {
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
    <DialogContainer open aria-describedby={t('ariaDescribedBy')} fullWidth>
      <DialogTitle>{t('title')}</DialogTitle>

      <DialogContent>{t('content.description')}</DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={logout}>
          {t('actions.confirmLabel')}
        </Button>
      </DialogActions>
    </DialogContainer>
  )
}

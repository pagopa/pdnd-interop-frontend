import React, { FunctionComponent, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogSessionExpiredProps } from '../../../types'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useRoute } from '../../hooks/useRoute'
import { sleep } from '../../lib/wait-utils'

export const StyledDialogSessionExpired: FunctionComponent<DialogSessionExpiredProps> = () => {
  const history = useHistory()
  const { routes } = useRoute()
  const { t } = useTranslation('shared-components', { keyPrefix: 'styledDialogSessionExpired' })

  const logout = () => {
    history.push(routes.LOGOUT.PATH)
  }

  useEffect(() => {
    async function asyncRedirect() {
      await sleep(3500)
      logout()
    }

    asyncRedirect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open aria-describedby={t('ariaDescribedBy')} fullWidth>
      <DialogTitle>{t('title')}</DialogTitle>

      <DialogContent>{t('content.description')}</DialogContent>

      <DialogActions>
        <StyledButton variant="contained" onClick={logout}>
          {t('actions.confirmLabel')}
        </StyledButton>
      </DialogActions>
    </Dialog>
  )
}

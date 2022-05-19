import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { ReportGmailerrorred as ReportGmailerrorredIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export const PageReloadMessage = () => {
  const { t } = useTranslation('shared-components')
  const history = useHistory()
  const reload = () => {
    history.go(0)
  }

  return (
    <Box
      sx={{ my: 4, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      bgcolor="background.paper"
      color="text.secondary"
    >
      <ReportGmailerrorredIcon sx={{ mr: 1 }} fontSize="small" color="inherit" />
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
        {t('pageReloadMessage.message')}.{' '}
        <ButtonNaked sx={{ fontSize: 'inherit', ml: 0.5, color: 'primary.main' }} onClick={reload}>
          {t('pageReloadMessage.cta')}
        </ButtonNaked>
      </Typography>
    </Box>
  )
}

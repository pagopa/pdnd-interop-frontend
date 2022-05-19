import React from 'react'
import { Alert } from '@mui/material'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useTranslation } from 'react-i18next'

export function Notifications() {
  const { t } = useTranslation('common', { keyPrefix: 'notifications' })

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('title') }}</StyledIntro>
      <Alert severity="info">{t('tempAlert')}</Alert>
    </React.Fragment>
  )
}

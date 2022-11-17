import { PageContainer } from '@/components/layout/containers'
import { Alert } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'notifications' })

  return (
    <PageContainer title={t('title')}>
      <Alert severity="info">{t('tempAlert')}</Alert>
    </PageContainer>
  )
}

export default NotificationsPage

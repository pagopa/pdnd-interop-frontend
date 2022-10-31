import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import ClientTable from '@/components/shared/ClientTable'

const ConsumerClientListPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerClientList' })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ClientTable clientKind="CONSUMER" />
    </PageContainer>
  )
}

export default ConsumerClientListPage

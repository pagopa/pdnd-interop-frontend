import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import ClientTable from '@/components/shared/ClientTable'

const ConsumerClientM2MListPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerClientM2MList' })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ClientTable clientKind="API" />
    </PageContainer>
  )
}

export default ConsumerClientM2MListPage

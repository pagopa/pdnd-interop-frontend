import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { PurposeCreateEServiceForm } from './components/PurposeCreateEServiceForm'

const ConsumerPurposeCreatePage: React.FC = () => {
  const { t } = useTranslation('purpose')

  return (
    <PageContainer title={t('create.emptyTitle')}>
      <PurposeCreateEServiceForm />
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage

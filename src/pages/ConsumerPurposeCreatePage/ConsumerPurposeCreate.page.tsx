import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { PurposeCreateForm } from './components/PurposeCreateForm'

const ConsumerPurposeCreatePage: React.FC = () => {
  const { t } = useTranslation('purpose')

  return (
    <PageContainer
      title={t('create.emptyTitle')}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
    >
      <PurposeCreateForm />
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage

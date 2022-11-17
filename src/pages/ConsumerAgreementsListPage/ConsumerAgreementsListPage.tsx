import { PageContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConsumerAgreementsTable,
  ConsumerAgreementsTableSkeleton,
} from './components/ConsumerAgreementsTable'

const ConsumerAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerAgreementsList' })
  return (
    <PageContainer title={t('title')} description={t('description')}>
      <React.Suspense fallback={<ConsumerAgreementsTableSkeleton />}>
        <ConsumerAgreementsTable />
      </React.Suspense>
    </PageContainer>
  )
}

export default ConsumerAgreementsListPage

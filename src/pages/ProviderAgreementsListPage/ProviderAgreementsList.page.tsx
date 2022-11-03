import { PageContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderAgreementsTable, ProviderAgreementsTableSkeleton } from './components'

const ProviderAgreementsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerAgreementsList' })
  return (
    <PageContainer title={t('title')} description={t('description')}>
      <React.Suspense fallback={<ProviderAgreementsTableSkeleton />}>
        <ProviderAgreementsTable />
      </React.Suspense>
    </PageContainer>
  )
}

export default ProviderAgreementsListPage

import { PageContainer } from '@/components/layout/containers'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceCatalogGrid, EServiceCatalogGridSkeleton } from './components'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'list' })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Suspense fallback={<EServiceCatalogGridSkeleton />}>
        <EServiceCatalogGrid />
      </Suspense>
    </PageContainer>
  )
}

export default ConsumerEServiceCatalogPage

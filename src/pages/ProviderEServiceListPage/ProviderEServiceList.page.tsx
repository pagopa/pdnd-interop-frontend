import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTable, EServiceTableSkeleton } from './components'
import { PageContainer, TopSideActionsContainer } from '@/components/layout/containers'
import { RouterLink } from '@/router'

const ProviderEServiceListPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common')

  const topSideButton = (
    <TopSideActionsContainer>
      <RouterLink as="button" variant="contained" size="small" to="PROVIDE_ESERVICE_CREATE">
        {tCommon('createNewBtn')}
      </RouterLink>
    </TopSideActionsContainer>
  )

  return (
    <PageContainer title={t('title')} description={t('description')} topSideActions={topSideButton}>
      <Suspense fallback={<EServiceTableSkeleton />}>
        <EServiceTable />
      </Suspense>
    </PageContainer>
  )
}

export default ProviderEServiceListPage

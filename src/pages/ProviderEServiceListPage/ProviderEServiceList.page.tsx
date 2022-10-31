import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTable, EServiceTableSkeleton } from './components'
import { PageContainer } from '@/components/layout/containers'
import { useNavigateRouter } from '@/router'
import { TopSideActions } from '@/components/layout/containers/PageContainer'

const ProviderEServiceListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()

  const topSideActions: TopSideActions = {
    buttons: [
      {
        action: () => navigate('PROVIDE_ESERVICE_CREATE'),
        label: tCommon('createNewBtn'),
        variant: 'contained',
      },
    ],
  }

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={topSideActions}
    >
      <Suspense fallback={<EServiceTableSkeleton />}>
        <EServiceTable />
      </Suspense>
    </PageContainer>
  )
}

export default ProviderEServiceListPage

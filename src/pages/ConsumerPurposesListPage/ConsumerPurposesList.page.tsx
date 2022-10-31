import { PageContainer } from '@/components/layout/containers'
import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { useNavigateRouter } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposesTable, ConsumerPurposesTableSkeleton } from './components'

const ConsumerPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposesList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()

  const topSideActions: TopSideActions = {
    buttons: [
      {
        action: () => navigate('SUBSCRIBE_PURPOSE_CREATE'),
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
      <React.Suspense fallback={<ConsumerPurposesTableSkeleton />}>
        <ConsumerPurposesTable />
      </React.Suspense>
    </PageContainer>
  )
}

export default ConsumerPurposesListPage

import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerPurposesTable, ConsumerPurposesTableSkeleton } from './components'

const ConsumerPurposesListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposesList' })
  const { t: tPurpose } = useTranslation('purpose', { keyPrefix: 'list' })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = useJwt()
  const { navigate } = useNavigateRouter()

  const { data: activeEServices } = EServiceQueries.useGetListFlat(
    {
      callerId: jwt?.organizationId,
      consumerId: jwt?.organizationId,
      agreementStates: ['ACTIVE'],
      state: 'PUBLISHED',
    },
    { suspense: false }
  )

  const hasNotActiveEService = activeEServices?.length === 0 ?? true

  const topSideActions: TopSideActions = {
    infoTooltip:
      !activeEServices && hasNotActiveEService ? tPurpose('cantCreatePurposeTooltip') : undefined,
    buttons: [
      {
        action: () => navigate('SUBSCRIBE_PURPOSE_CREATE'),
        label: tCommon('createNewBtn'),
        variant: 'contained',
        disabled: hasNotActiveEService,
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

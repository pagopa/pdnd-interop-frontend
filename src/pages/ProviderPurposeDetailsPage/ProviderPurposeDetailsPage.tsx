import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { useRouteParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import React from 'react'
import { PurposeDetails, PurposeDetailsSkeleton } from './components/PurposeDetails'

const ProviderPurposeDetailsPage: React.FC = () => {
  const { purposeId } = useRouteParams<'PROVIDE_PURPOSE_DETAILS'>()

  const { data: purpose, isLoading } = PurposeQueries.useGetSingle(purposeId, { suspense: false })

  const { actions } = useGetProviderPurposesActions(purpose)
  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer
      title={purpose?.title}
      description={purpose?.description}
      isLoading={isLoading}
      topSideActions={topSideActions}
    >
      <React.Suspense fallback={<PurposeDetailsSkeleton />}>
        <PurposeDetails purposeId={purposeId} />
      </React.Suspense>
    </PageContainer>
  )
}

export default ProviderPurposeDetailsPage

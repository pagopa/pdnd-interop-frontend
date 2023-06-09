import { PurposeQueries } from '@/api/purpose'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import {
  PurposeDetails,
  PurposeDetailsSkeleton,
} from '@/components/shared/PurposeDetails/PurposeDetails'
import useGetProviderPurposesActions from '@/hooks/useGetProviderPurposesActions'
import { Link, useParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderPurposeDetailsLoadEstimateUpdateSection } from './components/ProviderPurposeDetailsLoadEstimateUpdateSection'

const ProviderPurposeDetailsPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { purposeId } = useParams<'PROVIDE_PURPOSE_DETAILS'>()

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
        <PurposeDetails purpose={purpose} />
        <ProviderPurposeDetailsLoadEstimateUpdateSection purpose={purpose} />
      </React.Suspense>
      <PageBottomActionsContainer>
        <Link variant="outlined" to="PROVIDE_PURPOSE_LIST" as="button">
          {t('backToPurposeListBtn')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ProviderPurposeDetailsPage

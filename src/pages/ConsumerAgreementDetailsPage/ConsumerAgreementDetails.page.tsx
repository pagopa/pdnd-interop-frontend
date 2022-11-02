import { AgreementQueries } from '@/api/agreement'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { RouterLink, useRouteParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ConsumerAgreementDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ConsumerAgreementDetailsPageContentSkeleton />}>
      <ConsumerAgreementDetailsPageContent />
    </React.Suspense>
  )
}

const ConsumerAgreementDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('agreement')

  const { agreementId } = useRouteParams<'SUBSCRIBE_AGREEMENT_READ'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)
  const { actions } = useGetAgreementsActions(agreement)

  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer title={t('read.title')} topSideActions={topSideActions}>
      <AgreementDetails agreementId={agreementId} />
      <PageBottomActionsContainer>
        <RouterLink as="button" variant="outlined" to={'SUBSCRIBE_AGREEMENT_LIST'}>
          {t('backToRequestsBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const ConsumerAgreementDetailsPageContentSkeleton: React.FC = () => {
  const { t } = useTranslation('agreement')

  return (
    <PageContainer title={t('read.title')}>
      <AgreementDetailsSkeleton />
      <PageBottomActionsContainer>
        <RouterLink as="button" variant="outlined" to={'SUBSCRIBE_AGREEMENT_LIST'}>
          {t('backToRequestsBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerAgreementDetailsPage

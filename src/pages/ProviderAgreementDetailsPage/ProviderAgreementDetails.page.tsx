import { AgreementQueries } from '@/api/agreement'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { RouterLink, useRouteParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ProviderAgreementDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ProviderAgreementDetailsPageContentSkeleton />}>
      <ProviderAgreementDetailsPageContent />
    </React.Suspense>
  )
}

const ProviderAgreementDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('agreement')

  const { agreementId } = useRouteParams<'SUBSCRIBE_AGREEMENT_READ'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)
  const { actions } = useGetAgreementsActions(agreement)

  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer title={t('read.title')} topSideActions={topSideActions}>
      <AgreementDetails agreementId={agreementId} />
      <PageBottomActionsContainer>
        <RouterLink as="button" variant="outlined" to={'PROVIDE_AGREEMENT_LIST'}>
          {t('backToRequestsBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const ProviderAgreementDetailsPageContentSkeleton: React.FC = () => {
  const { t } = useTranslation('agreement')

  return (
    <PageContainer title={t('read.title')}>
      <AgreementDetailsSkeleton />
      <PageBottomActionsContainer>
        <RouterLink as="button" variant="outlined" to={'PROVIDE_AGREEMENT_LIST'}>
          {t('backToRequestsBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ProviderAgreementDetailsPage

import { AgreementQueries } from '@/api/agreement'
import { PurposeQueries } from '@/api/purpose'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { RouterLink, useRouteParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import { Alert } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

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
  const { data: agreementPurposes } = PurposeQueries.useGetList(
    {
      eserviceId: agreement?.eservice.id,
    },
    { enabled: !!agreement?.eservice && agreement.state === 'ACTIVE', suspense: false }
  )
  const { actions } = useGetAgreementsActions(agreement)

  const topSideActions = formatTopSideActions(actions)

  const showNoPurposeAlert = agreementPurposes && agreementPurposes.length === 0

  return (
    <PageContainer title={t('read.title')} topSideActions={topSideActions}>
      {showNoPurposeAlert && (
        <Alert severity="info">
          <Trans components={{ 1: <RouterLink to="SUBSCRIBE_PURPOSE_CREATE" /> }}>
            {t('read.noPurposeAlert')}
          </Trans>
        </Alert>
      )}
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

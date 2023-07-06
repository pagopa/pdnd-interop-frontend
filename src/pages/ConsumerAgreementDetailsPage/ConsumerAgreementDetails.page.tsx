import { AgreementQueries } from '@/api/agreement'
import { PurposeQueries } from '@/api/purpose'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useJwt } from '@/hooks/useJwt'
import { Link, useParams } from '@/router'
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
  const { isAdmin } = useJwt()

  const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_READ'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)
  const { data: agreementPurposes } = PurposeQueries.useGetConsumersList(
    { eservicesIds: [agreement?.eservice?.id as string], limit: 50, offset: 0 },
    { enabled: !!agreement?.eservice && agreement.state === 'ACTIVE', suspense: false }
  )
  const { actions } = useGetAgreementsActions(agreement)

  const showNoPurposeAlert = isAdmin && agreementPurposes && agreementPurposes.results.length === 0

  return (
    <PageContainer title={t('read.title')} newTopSideActions={actions}>
      {showNoPurposeAlert && agreement?.eservice && (
        <Alert severity="info">
          <Trans
            components={{
              1: (
                <Link
                  to="SUBSCRIBE_PURPOSE_CREATE"
                  options={{ urlParams: { 'e-service': agreement.eservice.id } }}
                />
              ),
            }}
          >
            {t('read.noPurposeAlert')}
          </Trans>
        </Alert>
      )}
      <AgreementDetails agreementId={agreementId} />
      <PageBottomActionsContainer>
        <Link as="button" variant="outlined" to={'SUBSCRIBE_AGREEMENT_LIST'}>
          {t('backToRequestsBtn')}
        </Link>
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
        <Link as="button" variant="outlined" to={'SUBSCRIBE_AGREEMENT_LIST'}>
          {t('backToRequestsBtn')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerAgreementDetailsPage

import { AgreementQueries } from '@/api/agreement'
import { PageContainer } from '@/components/layout/containers'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useParams } from '@/router'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  ProviderAgreementDetailsGeneralInfoSection,
  ProviderAgreementDetailsGeneralInfoSectionSkeleton,
} from './components/ProviderAgreementDetailsGeneralInfoSection/ProviderAgreementDetailsGeneralInfoSection'
import { Alert, Grid, Stack, Typography } from '@mui/material'
import {
  ProviderAgreementDetailsAttributesSectionsList,
  ProviderAgreementDetailsAttributesSectionsListSkeleton,
} from './components/ProviderAgreementDetailsAttributesSectionsList/ProviderAgreementDetailsAttributesSectionsList'
import { ProviderAgreementDetailsContextProvider } from './components/ProviderAgreementDetailsContext'
import { useSuspenseQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'

const ProviderAgreementDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ProviderAgreementDetailsPageContentSkeleton />}>
      <ProviderAgreementDetailsPageContent />
    </React.Suspense>
  )
}

const ProviderAgreementDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('agreement')

  const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_READ'>()
  const { data: agreement } = useSuspenseQuery(AgreementQueries.getSingle(agreementId))
  const { actions } = useGetAgreementsActions(agreement)

  const suspendedBy = match(agreement)
    .with({ suspendedByProducer: true }, () => 'byProducer' as const)
    .with({ suspendedByConsumer: true }, () => 'byConsumer' as const)
    .with({ suspendedByPlatform: true }, () => 'byPlatform' as const)
    .otherwise(() => undefined)

  return (
    <PageContainer
      title={t('providerRead.title')}
      topSideActions={actions}
      backToAction={{ label: t('backToRequestsBtn'), to: 'PROVIDE_AGREEMENT_LIST' }}
      statusChip={{
        for: 'agreement',
        agreement,
      }}
    >
      {suspendedBy && (
        <Alert sx={{ mb: 3 }} severity="error">
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={700} />,
            }}
          >
            {t(`providerRead.suspendedAlert.${suspendedBy}`)}
          </Trans>
        </Alert>
      )}
      <Grid container>
        <Grid item xs={8}>
          <ProviderAgreementDetailsContextProvider agreement={agreement}>
            <Stack spacing={3}>
              <ProviderAgreementDetailsGeneralInfoSection />
              <ProviderAgreementDetailsAttributesSectionsList />
            </Stack>
          </ProviderAgreementDetailsContextProvider>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

const ProviderAgreementDetailsPageContentSkeleton: React.FC = () => {
  return (
    <PageContainer isLoading={true}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Stack spacing={3}>
            <ProviderAgreementDetailsGeneralInfoSectionSkeleton />
            <ProviderAgreementDetailsAttributesSectionsListSkeleton />
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ProviderAgreementDetailsPage

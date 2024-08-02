import React from 'react'
import { AgreementQueries } from '@/api/agreement'
import { PageContainer } from '@/components/layout/containers'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { Link, useParams } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'
import { Alert, Grid, Stack, Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'
import { AuthHooks } from '@/api/auth'
import {
  ConsumerAgreementDetailsGeneralInfoSection,
  ConsumerAgreementDetailsGeneralInfoSectionSkeleton,
} from './components/ConsumerAgreementDetailsGeneralInfoSection/ConsumerAgreementDetailsGeneralInfoSection'
import { ConsumerAgreementDetailsContextProvider } from './components/ConsumerAgreementDetailsContext'
import {
  ConsumerAgreementDetailsAttributesSectionsList,
  ConsumerAgreementDetailsAttributesSectionsListSkeleton,
} from './components/ConsumerAgreementDetailsAttributesSectionsList/ConsumerAgreementDetailsAttributesSectionsList'
import { useDialog } from '@/stores'
import { useGetConsumerAgreementAlertProps } from './hooks/useGetConsumerAgreementAlertProps'
import { useSuspenseQuery } from '@tanstack/react-query'

const ConsumerAgreementDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ConsumerAgreementDetailsPageContentSkeleton />}>
      <ConsumerAgreementDetailsPageContent />
    </React.Suspense>
  )
}

const ConsumerAgreementDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

  const { openDialog } = useDialog()

  const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_READ'>()
  const { data: agreement } = useSuspenseQuery(AgreementQueries.getSingle(agreementId))

  const { actions } = useGetAgreementsActions(agreement)

  const alertProps = useGetConsumerAgreementAlertProps(agreement)

  const isEserviceMine = agreement.consumer.id === agreement.producer.id
  const { hasAllCertifiedAttributes, hasAllDeclaredAttributes, hasAllVerifiedAttributes } =
    useDescriptorAttributesPartyOwnership(
      agreement.eservice.id,
      agreement.eservice.activeDescriptor?.id
    )
  const shouldDisableUpgradeButton = !hasAllCertifiedAttributes

  const handleOpenUpdateVersionDialog = () => {
    if (!agreement) return
    openDialog({
      type: 'upgradeAgreementVersion',
      agreement: agreement,
      hasMissingAttributes: !hasAllDeclaredAttributes || !hasAllVerifiedAttributes,
    })
  }

  const canBeUpgraded = isAdmin && canAgreementBeUpgraded(agreement)
  if (canBeUpgraded) {
    actions.unshift({
      label: tCommon('actions.upgrade'),
      action: handleOpenUpdateVersionDialog,
      icon: NewReleasesIcon,
      disabled: shouldDisableUpgradeButton,
      tooltip: shouldDisableUpgradeButton
        ? t('consumerRead.noCertifiedAttributesForUpgradeTooltip')
        : undefined,
    })
  }

  return (
    <PageContainer
      title={t('consumerRead.title')}
      topSideActions={actions}
      backToAction={{ label: t('backToRequestsBtn'), to: 'SUBSCRIBE_AGREEMENT_LIST' }}
      statusChip={
        agreement
          ? {
              for: 'agreement',
              agreement,
            }
          : undefined
      }
    >
      {alertProps && (
        <Alert sx={{ mb: 3 }} severity={alertProps.severity}>
          <Trans
            components={{
              1: alertProps.link ? (
                <Link
                  to={alertProps.link.to}
                  params={alertProps.link.params}
                  options={alertProps.link.options}
                />
              ) : (
                <Typography component="span" variant="inherit" />
              ),
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {alertProps.content}
          </Trans>
        </Alert>
      )}
      <Grid container>
        <Grid item xs={8}>
          <ConsumerAgreementDetailsContextProvider agreement={agreement}>
            <Stack spacing={3}>
              <ConsumerAgreementDetailsGeneralInfoSection />
              {!isEserviceMine && <ConsumerAgreementDetailsAttributesSectionsList />}
            </Stack>
          </ConsumerAgreementDetailsContextProvider>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

const ConsumerAgreementDetailsPageContentSkeleton: React.FC = () => {
  return (
    <PageContainer isLoading={true}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Stack spacing={3}>
            <ConsumerAgreementDetailsGeneralInfoSectionSkeleton />
            <ConsumerAgreementDetailsAttributesSectionsListSkeleton />
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ConsumerAgreementDetailsPage

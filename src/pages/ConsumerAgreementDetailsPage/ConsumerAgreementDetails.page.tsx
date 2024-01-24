import React from 'react'
import { AgreementQueries } from '@/api/agreement'
import { PageContainer } from '@/components/layout/containers'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useParams } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'
import { Alert, Grid, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
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
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)

  const { actions } = useGetAgreementsActions(agreement)

  const suspendedBy = React.useMemo(() => {
    if (agreement?.suspendedByProducer) return 'byProducer'
    if (agreement?.suspendedByConsumer) return 'byConsumer'
    if (agreement?.suspendedByPlatform) return 'byPlatform'
  }, [agreement])

  const isEserviceMine = agreement?.consumer.id === agreement?.producer.id
  const { hasAllCertifiedAttributes, hasAllDeclaredAttributes, hasAllVerifiedAttributes } =
    useDescriptorAttributesPartyOwnership(
      agreement?.eservice.id,
      agreement?.eservice.activeDescriptor?.id
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
      {agreement && agreement.state === 'SUSPENDED' && suspendedBy && (
        <Alert sx={{ mb: 3 }} severity="error">
          {t(`consumerRead.suspendedAlert.${suspendedBy}`)}
        </Alert>
      )}
      <Grid container>
        <Grid item xs={8}>
          <ConsumerAgreementDetailsContextProvider agreement={agreement}>
            <Stack spacing={3}>
              {agreement && <ConsumerAgreementDetailsGeneralInfoSection />}
              {agreement && !isEserviceMine && <ConsumerAgreementDetailsAttributesSectionsList />}
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

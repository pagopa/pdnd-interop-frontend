import React from 'react'
import { AgreementQueries } from '@/api/agreement'
import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { Link, useParams } from '@/router'
import { canAgreementBeUpgraded } from '@/utils/agreement.utils'
import { Alert, Grid, Stack } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import { AgreementUpgradeDrawer } from './components/AgreementUpgradeDrawer'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'
import { AuthHooks } from '@/api/auth'
import { useDrawerState } from '@/hooks/useDrawerState'
import {
  ConsumerAgreementDetailsGeneralInfoSection,
  ConsumerAgreementDetailsGeneralInfoSectionSkeleton,
} from './components/ConsumerAgreementDetailsGeneralInfoSection/ConsumerAgreementDetailsGeneralInfoSection'
import { ConsumerAgreementDetailsContextProvider } from './components/ConsumerAgreementDetailsContext'
import {
  ConsumerAgreementDetailsAttributesSectionsList,
  ConsumerAgreementDetailsAttributesSectionsListSkeleton,
} from './components/ConsumerAgreementDetailsAttributesSectionsList/ConsumerAgreementDetailsAttributesSectionsList'

const ConsumerAgreementDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ConsumerAgreementDetailsPageContentSkeleton />}>
      <ConsumerAgreementDetailsPageContent />
    </React.Suspense>
  )
}

// const ConsumerAgreementDetailsPageContent: React.FC = () => {
//   const { t } = useTranslation('agreement')
//   const { t: tCommon } = useTranslation('common')
//   const { isAdmin } = AuthHooks.useJwt()

//   const { isOpen: isAgreementUpgradeDrawerOpen, openDrawer, closeDrawer } = useDrawerState()

//   const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_READ'>()
//   const { data: agreement } = AgreementQueries.useGetSingle(agreementId)
//   const { data: agreementPurposes } = PurposeQueries.useGetConsumersList(
//     { eservicesIds: [agreement?.eservice?.id as string], limit: 50, offset: 0 },
//     { enabled: !!agreement?.eservice && agreement.state === 'ACTIVE', suspense: false }
//   )

//   const { hasAllCertifiedAttributes, hasAllDeclaredAttributes, hasAllVerifiedAttributes } =
//     useDescriptorAttributesPartyOwnership(
//       agreement?.eservice.id,
//       agreement?.eservice.activeDescriptor?.id
//     )
//   const { actions } = useGetAgreementsActions(agreement)

//   const shouldDisableUpgradeButton = !hasAllCertifiedAttributes
//   const canBeUpgraded = isAdmin && canAgreementBeUpgraded(agreement)
//   const showNoPurposeAlert = isAdmin && agreementPurposes && agreementPurposes.results.length === 0

//   if (canBeUpgraded) {
//     actions.unshift({
//       label: tCommon('actions.upgrade'),
//       action: openDrawer,
//       icon: NewReleasesIcon,
//       disabled: shouldDisableUpgradeButton,
//       tooltip: shouldDisableUpgradeButton
//         ? t('read.noCertifiedAttributesForUpgradeTooltip')
//         : undefined,
//     })
//   }

//   return (
//     <PageContainer
//       title={t('read.title')}
//       newTopSideActions={actions}
//       backToAction={{ label: t('backToRequestsBtn'), to: 'SUBSCRIBE_AGREEMENT_LIST' }}
//     >
//       {showNoPurposeAlert && agreement?.eservice && (
//         <Alert severity="info">
//           <Trans
//             components={{
//               1: (
//                 <Link
//                   to="SUBSCRIBE_PURPOSE_CREATE"
//                   options={{ urlParams: { 'e-service': agreement.eservice.id } }}
//                 />
//               ),
//             }}
//           >
//             {t('read.noPurposeAlert')}
//           </Trans>
//         </Alert>
//       )}
//       <AgreementDetails agreementId={agreementId} />
//       {canBeUpgraded && agreement && (
//         <AgreementUpgradeDrawer
//           agreement={agreement}
//           isOpen={isAgreementUpgradeDrawerOpen}
//           onClose={closeDrawer}
//           hasMissingAttributes={!hasAllDeclaredAttributes || !hasAllVerifiedAttributes}
//         />
//       )}
//     </PageContainer>
//   )
// }

// const ConsumerAgreementDetailsPageContentSkeleton: React.FC = () => {
//   const { t } = useTranslation('agreement')

//   return (
//     <PageContainer title={t('read.title')}>
//       <AgreementDetailsSkeleton />
//     </PageContainer>
//   )
// }

const ConsumerAgreementDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common')

  const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_READ'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)

  const { actions } = useGetAgreementsActions(agreement)

  const isEserviceMine = agreement?.consumer.id === agreement?.producer.id

  return (
    <PageContainer
      title={'TODO Gestisci richiesta di fruizione'}
      newTopSideActions={actions}
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
          {t(`TODO providerRead.suspendedAlert.${suspendedBy}`)}
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

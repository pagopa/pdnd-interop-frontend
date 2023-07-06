import React from 'react'
import { Grid, Stack } from '@mui/material'
import { AgreementDetailsContextProvider } from './AgreementDetailsContext'
import {
  AgreementSummarySection,
  AgreementSummarySectionSkeleton,
} from './components/AgreementSummarySection'
import { AgreementRejectedMessageSection } from './components/AgreementRejectedMessageSection'
import { AgreementUpgradeGuideSection } from './components/AgreementUpgradeGuideSection'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '../ApiInfoSection'
import { AgreementQueries } from '@/api/agreement'
import { useTranslation } from 'react-i18next'
import {
  AgreementAttributesListSections,
  AgreementAttributesListSectionsSkeleton,
} from './components/AgreementAttributesListSections'
import { AgreementAttachedDocumentsDrawer } from './components/AgreementAttachedDocumentsDrawer'

type AgreementDetailsProps = {
  agreementId: string
}

export const AgreementDetails: React.FC<AgreementDetailsProps> = ({ agreementId }) => {
  const { t } = useTranslation('common', { keyPrefix: 'idLabels' })
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)

  return (
    <AgreementDetailsContextProvider agreementId={agreementId}>
      <AgreementUpgradeGuideSection />
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <AgreementSummarySection />
        </Grid>
        <Grid item xs={5}>
          {agreement && (
            <ApiInfoSection
              ids={[
                { name: t('eserviceId'), id: agreement.eservice.id },
                { name: t('descriptorId'), id: agreement.descriptorId },
                { name: t('agreementId'), id: agreementId },
                { name: t('providerId'), id: agreement.producer.id },
                { name: t('consumerId'), id: agreement.consumer.id },
              ]}
            />
          )}
        </Grid>
      </Grid>

      <AgreementRejectedMessageSection />
      <AgreementAttributesListSections />

      <AgreementAttachedDocumentsDrawer />
    </AgreementDetailsContextProvider>
  )
}

export const AgreementDetailsSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mt: 6 }} spacing={2}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <Stack spacing={2}>
            <AgreementSummarySectionSkeleton />
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Stack spacing={2}>
            <ApiInfoSectionSkeleton />
          </Stack>
        </Grid>
      </Grid>

      <AgreementAttributesListSectionsSkeleton />
    </Stack>
  )
}

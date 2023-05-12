import React from 'react'
import { Grid, Stack } from '@mui/material'
import { AgreementDetailsContextProvider } from './AgreementDetailsContext'
import {
  AgreementGeneralInfoSection,
  AgreementGeneralInfoSectionSkeleton,
} from './components/AgreementGeneralInfoSection'
import {
  AgreementDocumentListSection,
  AgreementDocumentListSectionSkeleton,
} from './components/AgreementDocumentListSection'
import {
  AgreementCertifiedAttributesSection,
  AgreementVerifiedAttributesSection,
  AgreementDeclaredAttributesSection,
  AgreementAttributesListSectionSkeleton,
} from './components/AgreementAttributesListSections'
import { AgreementRejectedMessageSection } from './components/AgreementRejectedMessageSection'
import { AgreementConsumerMessageSection } from './components/AgreementConsumerMessageSection'
import { AgreementUpgradeGuideSection } from './components/AgreementUpgradeGuideSection'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '../ApiInfoSection'
import { AgreementQueries } from '@/api/agreement'
import { useTranslation } from 'react-i18next'

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
          <AgreementGeneralInfoSection />
          <AgreementDocumentListSection />
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
      <AgreementConsumerMessageSection />

      <AgreementCertifiedAttributesSection />
      <AgreementVerifiedAttributesSection />
      <AgreementDeclaredAttributesSection />
    </AgreementDetailsContextProvider>
  )
}

export const AgreementDetailsSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mt: 6 }} spacing={2}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <Stack spacing={2}>
            <AgreementGeneralInfoSectionSkeleton />
            <AgreementDocumentListSectionSkeleton />
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Stack spacing={2}>
            <ApiInfoSectionSkeleton />
          </Stack>
        </Grid>
      </Grid>

      <AgreementAttributesListSectionSkeleton />
      <AgreementAttributesListSectionSkeleton />
      <AgreementAttributesListSectionSkeleton />
    </Stack>
  )
}

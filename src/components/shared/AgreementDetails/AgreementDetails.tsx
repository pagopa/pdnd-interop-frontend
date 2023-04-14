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

type AgreementDetailsProps = {
  agreementId: string
}

export const AgreementDetails: React.FC<AgreementDetailsProps> = ({ agreementId }) => {
  return (
    <AgreementDetailsContextProvider agreementId={agreementId}>
      <AgreementUpgradeGuideSection />
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <AgreementGeneralInfoSection />
        </Grid>
        <Grid item xs={5}>
          <AgreementDocumentListSection />
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
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Stack spacing={2}>
            <AgreementDocumentListSectionSkeleton />
          </Stack>
        </Grid>
      </Grid>

      <AgreementAttributesListSectionSkeleton />
      <AgreementAttributesListSectionSkeleton />
      <AgreementAttributesListSectionSkeleton />
    </Stack>
  )
}

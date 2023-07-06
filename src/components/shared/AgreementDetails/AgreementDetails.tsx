import React from 'react'
import { Grid, Stack } from '@mui/material'
import { AgreementDetailsContextProvider } from './AgreementDetailsContext'
import {
  AgreementSummarySection,
  AgreementSummarySectionSkeleton,
} from './components/AgreementSummarySection'
import { AgreementRejectedMessageSection } from './components/AgreementRejectedMessageSection'
import { AgreementUpgradeGuideSection } from './components/AgreementUpgradeGuideSection'
import {
  AgreementAttributesListSections,
  AgreementAttributesListSectionsSkeleton,
} from './components/AgreementAttributesListSections'
import { AgreementAttachedDocumentsDrawer } from './components/AgreementAttachedDocumentsDrawer'

type AgreementDetailsProps = {
  agreementId: string
}

export const AgreementDetails: React.FC<AgreementDetailsProps> = ({ agreementId }) => {
  return (
    <AgreementDetailsContextProvider agreementId={agreementId}>
      <AgreementUpgradeGuideSection />
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <AgreementSummarySection />
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
          <AgreementSummarySectionSkeleton />
        </Grid>
      </Grid>

      <AgreementAttributesListSectionsSkeleton />
    </Stack>
  )
}

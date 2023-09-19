import React from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { AgreementDetailsContextProvider } from './AgreementDetailsContext'
import {
  AgreementSummarySection,
  AgreementSummarySectionSkeleton,
} from './components/AgreementSummarySection'
import { AgreementRejectedMessageSection } from './components/AgreementRejectedMessageSection'
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
    <Box sx={{ mt: 7 }}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <AgreementSummarySectionSkeleton />
        </Grid>
      </Grid>

      <AgreementAttributesListSectionsSkeleton />
    </Box>
  )
}

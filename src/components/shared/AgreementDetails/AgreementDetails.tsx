import React from 'react'
import { Grid, Stack } from '@mui/material'
import { AgreementDetailsContextProvider } from './AgreementDetailsContext'
import { AgreementGeneralInfoSection } from './components/AgreementGeneralInfoSection'
import { AgreementDocumentListSection } from './components/AgreementDocumentsListSection'
import AgreementAttributesListSections from './components/AgreementAttributesListSections'
import { AgreementRejectedMessageSection } from './components/AgreementRejectedMessageSection'
import { AgreementConsumerMessageSection } from './components/AgreementConsumerMessageSection'
import { AgreementUpgradeGuideSection } from './components/AgreementUpgradeGuideSection'
import { SectionContainerSkeleton } from '@/components/layout/containers/SectionContainer'

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
      <AgreementAttributesListSections />
    </AgreementDetailsContextProvider>
  )
}

export const AgreementDetailsSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mt: 6 }} spacing={2}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <Stack spacing={2}>
            <SectionContainerSkeleton height={190} />
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Stack spacing={2}>
            <SectionContainerSkeleton height={115} />
          </Stack>
        </Grid>
      </Grid>

      <SectionContainerSkeleton height={260} />
      <SectionContainerSkeleton height={260} />
      <SectionContainerSkeleton height={260} />
    </Stack>
  )
}

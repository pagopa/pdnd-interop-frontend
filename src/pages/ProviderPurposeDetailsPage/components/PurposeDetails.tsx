import React from 'react'
import { Grid } from '@mui/material'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from './PurposeDetailsGeneralInfoSection'
import {
  PurposeDetailsDocumentListSection,
  PurposeDetailsDocumentListSectionSkeleton,
} from './PurposeDetailsDocumentListSection'
import { PurposeDetailsLoadEstimateUpdateSection } from './PurposeDetailsLoadEstimateUpdateSection'
import { PurposeQueries } from '@/api/purpose'
import { useJwt } from '@/hooks/useJwt'

interface PurposeDetailsProps {
  purposeId: string
}

export const PurposeDetails: React.FC<PurposeDetailsProps> = ({ purposeId }) => {
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const { isAdmin } = useJwt()

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <PurposeDetailsGeneralInfoSection purposeId={purposeId} />
        </Grid>
        <Grid item xs={5}>
          <PurposeDetailsDocumentListSection purposeId={purposeId} />
        </Grid>
      </Grid>
      {purpose?.waitingForApprovalVersion && isAdmin && (
        <PurposeDetailsLoadEstimateUpdateSection purposeId={purposeId} />
      )}
    </>
  )
}

export const PurposeDetailsSkeleton: React.FC = () => {
  return (
    <Grid spacing={2} container>
      <Grid item xs={7}>
        <PurposeDetailsGeneralInfoSectionSkeleton />
      </Grid>
      <Grid item xs={5}>
        <PurposeDetailsDocumentListSectionSkeleton />
      </Grid>
    </Grid>
  )
}

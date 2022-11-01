import React from 'react'
import { Grid, Skeleton, Stack } from '@mui/material'
import { useCurrentRoute } from '@/router'
import { EServiceDetailsContextProvider } from './EServiceDetailsContext'
import { EServiceGeneralInfoSection } from './components/EServiceGeneralInfoSection'
import { EServiceVersionInfoSection } from './components/EServiceVersionInfoSection'
import { EServiceVoucherVerificationSection } from './components/EServiceVoucherVerificationSection'
import { EServiceVersionHistorySection } from './components/EServiceVersionHistorySection'
import { EServiceAttributesSections } from './components/EServiceAttributesSections'
import { EServiceDocumentsListSection } from './components/EServiceDocumentsListSection'

type EServiceContentInfoProps = {
  eserviceId: string
  descriptorId: string
}

export const EServiceContentInfo: React.FC<EServiceContentInfoProps> = ({
  eserviceId,
  descriptorId,
}) => {
  const { mode } = useCurrentRoute()

  return (
    <EServiceDetailsContextProvider eserviceId={eserviceId} descriptorId={descriptorId}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <EServiceGeneralInfoSection />
          <EServiceVersionInfoSection />
        </Grid>
        <Grid item xs={5}>
          <EServiceDocumentsListSection />
          {mode === 'provider' && <EServiceVoucherVerificationSection />}
        </Grid>
      </Grid>

      <EServiceAttributesSections />

      <Grid spacing={2} container>
        <Grid item xs={6}>
          <EServiceVersionHistorySection />
        </Grid>
      </Grid>
    </EServiceDetailsContextProvider>
  )
}

export const EServiceContentInfoSkeleton: React.FC = () => {
  const { mode } = useCurrentRoute()

  return (
    <Stack spacing={2}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={140} />
            <Skeleton variant="rectangular" height={471} />
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={150} />
            {mode === 'provider' && <Skeleton variant="rectangular" height={300} />}
          </Stack>
        </Grid>
      </Grid>

      <Skeleton variant="rectangular" height={320} />
      <Skeleton variant="rectangular" height={320} />
      <Skeleton variant="rectangular" height={320} />

      <Grid spacing={2} container>
        <Grid item xs={6}>
          <Skeleton variant="rectangular" height={150} />
        </Grid>
      </Grid>
    </Stack>
  )
}

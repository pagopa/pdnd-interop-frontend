import React from 'react'
import { Grid, Skeleton, Stack } from '@mui/material'
import { useCurrentRoute } from '@/router'
import { EServiceDetailsContextProvider } from './EServiceDetailsContext'
import { EServiceGeneralInfoSection } from './components/EServiceGeneralInfoSection'
import { EServiceVersionInfoSection } from './components/EServiceVersionInfoSection'
import { EServiceLinksSection } from './components/EServiceLinksSection'
import { EServiceVersionHistorySection } from './components/EServiceVersionHistorySection'
import { EServiceAttributesSections } from './components/EServiceAttributesSections'
import { EServiceDocumentsListSection } from './components/EServiceDocumentsListSection'
import { EServiceProviderContacts } from './components/EServiceProviderContacts'
import type {
  CatalogEServiceDescriptor,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'

type EServiceDetailsProps = {
  descriptor: CatalogEServiceDescriptor | ProducerEServiceDescriptor
}

export const EServiceDetails: React.FC<EServiceDetailsProps> = ({ descriptor }) => {
  const { mode } = useCurrentRoute()

  return (
    <EServiceDetailsContextProvider descriptor={descriptor}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <EServiceGeneralInfoSection />
          <EServiceVersionInfoSection />
        </Grid>
        <Grid item xs={5}>
          <EServiceDocumentsListSection />
          {mode === 'consumer' && <EServiceProviderContacts />}
          {mode === 'provider' && <EServiceLinksSection />}
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

export const EServiceDetailsSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mt: 2 }} spacing={2}>
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
            <Skeleton variant="rectangular" height={300} />
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

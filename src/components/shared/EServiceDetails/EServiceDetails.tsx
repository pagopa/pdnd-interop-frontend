import React from 'react'
import { Grid, Stack } from '@mui/material'
import { EServiceDetailsContextProvider } from './EServiceDetailsContext'
import { EServiceGeneralInfoSection } from './components/EServiceGeneralInfoSection'
import type {
  CatalogEServiceDescriptor,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { ReadOnlyDescriptorAttributes } from '../ReadOnlyDescriptorAttributes'

type EServiceDetailsProps = {
  descriptor: CatalogEServiceDescriptor | ProducerEServiceDescriptor
}

export const EServiceDetails: React.FC<EServiceDetailsProps> = ({ descriptor }) => {
  return (
    <EServiceDetailsContextProvider descriptor={descriptor}>
      <Grid container>
        <Grid item xs={7}>
          <EServiceGeneralInfoSection />
        </Grid>
      </Grid>

      <SectionContainer newDesign component="div">
        <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
      </SectionContainer>
    </EServiceDetailsContextProvider>
  )
}

export const EServiceDetailsSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mt: 2 }} spacing={2}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <Stack>
            <SectionContainerSkeleton height={471} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}

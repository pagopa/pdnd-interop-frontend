import React from 'react'
import { Grid } from '@mui/material'
import {
  ProviderEServiceGeneralInfoSection,
  ProviderEServiceGeneralInfoSectionSkeleton,
} from './ProviderEServiceGeneralInfoSection'
import {
  ProviderEServiceVersionInfoSection,
  ProviderEServiceVersionInfoSectionSkeleton,
} from './ProviderEServiceVersionInfoSection'
import {
  ProviderEServiceTechnicalInfoSection,
  ProviderEServiceTechnicalInfoSectionSkeleton,
} from './ProviderEServiceTechnicalInfoSection'
import {
  ProviderEServiceDescriptorAttributesSection,
  ProviderEServiceDescriptorAttributesSectionSkeleton,
} from './ProviderEServiceDescriptorAttributesSection'
import {
  ProviderEServiceSignalHubSectionSkeleton,
  ProviderEServiceSignalHubSection,
} from './ProviderEServiceSignalHubSection'

export const ProviderEserviceDetailsTab: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <React.Suspense fallback={<ProviderEServiceGeneralInfoSectionSkeleton />}>
          <ProviderEServiceGeneralInfoSection />
        </React.Suspense>
        <React.Suspense fallback={<ProviderEServiceVersionInfoSectionSkeleton />}>
          <ProviderEServiceVersionInfoSection />
        </React.Suspense>
        <React.Suspense fallback={<ProviderEServiceTechnicalInfoSectionSkeleton />}>
          <ProviderEServiceTechnicalInfoSection />
        </React.Suspense>
        <React.Suspense fallback={<ProviderEServiceSignalHubSectionSkeleton />}>
          <ProviderEServiceSignalHubSection />
        </React.Suspense>
        <React.Suspense fallback={<ProviderEServiceDescriptorAttributesSectionSkeleton />}>
          <ProviderEServiceDescriptorAttributesSection />
        </React.Suspense>
      </Grid>
    </Grid>
  )
}

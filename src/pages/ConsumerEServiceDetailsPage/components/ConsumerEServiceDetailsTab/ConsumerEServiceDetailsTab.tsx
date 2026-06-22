import { Grid } from '@mui/material'
import React from 'react'
import {
  ConsumerEServiceDescriptorAttributesSkeleton,
  ConsumerEServiceDescriptorAttributes,
} from './ConsumerEServiceDescriptorAttributes'
import {
  ConsumerEServiceGeneralInfoSectionSkeleton,
  ConsumerEServiceGeneralInfoSection,
} from './ConsumerEServiceGeneralInfoSection'
import {
  ConsumerLinkedPurposeTemplatesSection,
  ConsumerLinkedPurposeTemplatesSectionSkeleton,
} from './ConsumerEServicePurposeTemplateSection'
import {
  ConsumerEServiceSignalHubSection,
  ConsumerEServiceSignalHubSectionSkeleton,
} from './ConsumerEServiceSignalHubSection'
import { AuthHooks } from '@/api/auth'

const ConsumerEServiceDetailsTab: React.FC = () => {
  const { isReviewer } = AuthHooks.useJwt()

  return (
    <Grid container>
      <Grid item xs={8}>
        <React.Suspense fallback={<ConsumerEServiceGeneralInfoSectionSkeleton />}>
          <ConsumerEServiceGeneralInfoSection />
        </React.Suspense>
        {!isReviewer && (
          <React.Suspense fallback={<ConsumerLinkedPurposeTemplatesSectionSkeleton />}>
            <ConsumerLinkedPurposeTemplatesSection />
          </React.Suspense>
        )}
        <React.Suspense fallback={<ConsumerEServiceSignalHubSectionSkeleton />}>
          <ConsumerEServiceSignalHubSection />
        </React.Suspense>
        <React.Suspense fallback={<ConsumerEServiceDescriptorAttributesSkeleton />}>
          <ConsumerEServiceDescriptorAttributes />
        </React.Suspense>
      </Grid>
    </Grid>
  )
}

export default ConsumerEServiceDetailsTab

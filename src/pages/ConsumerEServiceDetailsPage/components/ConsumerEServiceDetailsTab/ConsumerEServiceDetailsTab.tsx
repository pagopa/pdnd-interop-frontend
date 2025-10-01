import { AuthHooks } from '@/api/auth'
import { EServiceQueries } from '@/api/eservice'
import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_CONSUMER } from '@/config/env'
import { useTrackPageViewEvent } from '@/config/tracking'
import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from '@/router'
import {
  ConsumerEServiceDescriptorAttributesSkeleton,
  ConsumerEServiceDescriptorAttributes,
} from './ConsumerEServiceDescriptorAttributes'
import { ConsumerEServiceDetailsAlerts } from './ConsumerEServiceDetailsAlerts'
import {
  ConsumerEServiceGeneralInfoSectionSkeleton,
  ConsumerEServiceGeneralInfoSection,
} from './ConsumerEServiceGeneralInfoSection'
import {
  ConsumerEServiceSignalHubSectionSkeleton,
  ConsumerEServiceSignalHubSection,
} from './ConsumerEServiceSignalHubSection'
import {
  ConsumerLinkedPurposeTemplatesSection,
  ConsumerLinkedPurposeTemplatesSectionSkeleton,
} from './ConsumerEServicePurposeTemplateSection'

const ConsumerEServiceDetailsTab: React.FC = () => {
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt } = AuthHooks.useJwt()

  const producerId = jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_CONSUMER.includes(producerId)
    : true

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  return (
    <>
      <ConsumerEServiceDetailsAlerts descriptor={descriptor} />
      <Grid container>
        <Grid item xs={8}>
          <React.Suspense fallback={<ConsumerEServiceGeneralInfoSectionSkeleton />}>
            <ConsumerEServiceGeneralInfoSection />
          </React.Suspense>
          <React.Suspense fallback={<ConsumerLinkedPurposeTemplatesSectionSkeleton />}>
            <ConsumerLinkedPurposeTemplatesSection />
          </React.Suspense>
          {isSignalHubFlagEnabled && (
            <React.Suspense fallback={<ConsumerEServiceSignalHubSectionSkeleton />}>
              <ConsumerEServiceSignalHubSection />
            </React.Suspense>
          )}
          <React.Suspense fallback={<ConsumerEServiceDescriptorAttributesSkeleton />}>
            <ConsumerEServiceDescriptorAttributes />
          </React.Suspense>
        </Grid>
      </Grid>
    </>
  )
}

export default ConsumerEServiceDetailsTab

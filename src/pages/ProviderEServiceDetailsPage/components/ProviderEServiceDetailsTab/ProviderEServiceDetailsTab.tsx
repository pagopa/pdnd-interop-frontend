import React from 'react'
import { ProviderEServiceDetailsAlerts } from './ProviderEServiceDetailsAlerts'
import { Grid } from '@mui/material'
import {
  ProviderEServiceGeneralInfoSection,
  ProviderEServiceGeneralInfoSectionSkeleton,
} from './ProviderEServiceGeneralInfoSection'
import {
  ProviderEServiceTechnicalInfoSection,
  ProviderEServiceTechnicalInfoSectionSkeleton,
} from './ProviderEServiceTechnicalInfoSection'
import {
  ProviderEServiceDescriptorAttributes,
  ProviderEServiceDescriptorAttributesSkeleton,
} from './ProviderEServiceDescriptorAttributes'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import {
  ProviderEServiceSignalHubSectionSkeleton,
  ProviderEServiceSignalHubSection,
} from './ProviderEServiceSignalHubSection'
import { AuthHooks } from '@/api/auth'
import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_PRODUCER } from '@/config/env'

export const ProviderEserviceDetailsTab: React.FC = () => {
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  return (
    <>
      <ProviderEServiceDetailsAlerts descriptor={descriptor} />
      <Grid container>
        <Grid item xs={8}>
          <React.Suspense fallback={<ProviderEServiceGeneralInfoSectionSkeleton />}>
            <ProviderEServiceGeneralInfoSection />
          </React.Suspense>
          <React.Suspense fallback={<ProviderEServiceTechnicalInfoSectionSkeleton />}>
            <ProviderEServiceTechnicalInfoSection />
          </React.Suspense>
          {isSignalHubFlagEnabled && (
            <React.Suspense fallback={<ProviderEServiceSignalHubSectionSkeleton />}>
              <ProviderEServiceSignalHubSection />
            </React.Suspense>
          )}
          <React.Suspense fallback={<ProviderEServiceDescriptorAttributesSkeleton />}>
            <ProviderEServiceDescriptorAttributes />
          </React.Suspense>
        </Grid>
      </Grid>
    </>
  )
}

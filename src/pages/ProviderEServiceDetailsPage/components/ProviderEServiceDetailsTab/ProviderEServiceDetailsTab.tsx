import React from 'react'
import { ProviderEServiceDetailsAlerts } from './ProviderEServiceDetailsAlerts'
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
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import {
  ProviderEServiceSignalHubSectionSkeleton,
  ProviderEServiceSignalHubSection,
} from './ProviderEServiceSignalHubSection'

type ProviderEserviceDetailsTabProps = {
  onViewKeychains?: VoidFunction
}

export const ProviderEserviceDetailsTab: React.FC<ProviderEserviceDetailsTabProps> = ({
  onViewKeychains,
}) => {
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  return (
    <>
      <ProviderEServiceDetailsAlerts descriptor={descriptor} onViewKeychains={onViewKeychains} />
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
    </>
  )
}

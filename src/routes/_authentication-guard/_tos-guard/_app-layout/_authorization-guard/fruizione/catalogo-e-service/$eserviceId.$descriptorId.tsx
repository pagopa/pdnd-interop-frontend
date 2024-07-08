import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { getDescriptorCatalogQueryOptions } from '@/api/eservice'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTrackPageViewEvent } from '@/config/tracking'
import { PageContainer, PageContainerSkeleton } from '@/components/layout/containers'
import { ConsumerEServiceDetailsAlerts } from '@/pages/ConsumerEServiceDetailsPage/components/ConsumerEServiceDetailsAlerts'
import { Grid } from '@mui/material'
import {
  ConsumerEServiceGeneralInfoSection,
  ConsumerEServiceGeneralInfoSectionSkeleton,
} from '@/pages/ConsumerEServiceDetailsPage/components/ConsumerEServiceGeneralInfoSection'
import {
  ConsumerEServiceDescriptorAttributes,
  ConsumerEServiceDescriptorAttributesSkeleton,
} from '@/pages/ConsumerEServiceDetailsPage/components/ConsumerEServiceDescriptorAttributes'

export const Route = createFileRoute(
  '/_authentication-guard/_tos-guard/_app-layout/_authorization-guard/fruizione/catalogo-e-service/$eserviceId/$descriptorId'
)({
  staticData: {
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security', 'api'],
  },
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(getDescriptorCatalogQueryOptions(params))
  },
  component: ConsumerEServiceCatalogDetailsPage,
  pendingComponent: ConsumerEServiceCatalogDetailsPageSkeleton,
  wrapInSuspense: true,
})

function ConsumerEServiceCatalogDetailsPage() {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const params = Route.useParams()
  const { data: descriptor } = useSuspenseQuery(getDescriptorCatalogQueryOptions(params))

  // const { actions } = useGetEServiceConsumerActions(descriptor?.eservice, descriptor)

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      topSideActions={[]}
      isLoading={!descriptor}
      statusChip={descriptor ? { for: 'eservice', state: descriptor?.state } : undefined}
      backToAction={{
        label: t('actions.backToCatalogLabel'),
        to: 'SUBSCRIBE_CATALOG_LIST',
      }}
    >
      <ConsumerEServiceDetailsAlerts descriptor={descriptor} />
      <Grid container>
        <Grid item xs={8}>
          <ConsumerEServiceGeneralInfoSection descriptor={descriptor} />
          <ConsumerEServiceDescriptorAttributes descriptor={descriptor} />
        </Grid>
      </Grid>
    </PageContainer>
  )
}

function ConsumerEServiceCatalogDetailsPageSkeleton() {
  return (
    <PageContainerSkeleton>
      <Grid container>
        <Grid item xs={8}>
          <ConsumerEServiceGeneralInfoSectionSkeleton />
          <ConsumerEServiceDescriptorAttributesSkeleton />
        </Grid>
      </Grid>
    </PageContainerSkeleton>
  )
}

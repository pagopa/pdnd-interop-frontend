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
  '/_private-routes/fruizione/catalogo-e-service/$eserviceId/$descriptorId'
)({
  staticData: {
    authLevels: ['admin', 'support', 'security', 'api'],
    routeKey: 'SUBSCRIBE_CATALOG_VIEW',
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

  const { actions } = useGetEServiceConsumerActions(descriptor?.eservice, descriptor)

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  return (
    <PageContainer
      title={descriptor.eservice.name}
      topSideActions={actions}
      statusChip={{ for: 'eservice', state: descriptor.state }}
      backToAction={{
        label: t('actions.backToCatalogLabel'),
        to: '/fruizione/catalogo-e-service',
      }}
      breadcrumbPaths={['/erogazione', '/fruizione/catalogo-e-service']}
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
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })

  return (
    <PageContainerSkeleton
      backToAction={{
        label: t('actions.backToCatalogLabel'),
        to: '/fruizione/catalogo-e-service',
      }}
      breadcrumbPaths={['/erogazione', '/fruizione/catalogo-e-service']}
    >
      <Grid container>
        <Grid item xs={8}>
          <ConsumerEServiceGeneralInfoSectionSkeleton />
          <ConsumerEServiceDescriptorAttributesSkeleton />
        </Grid>
      </Grid>
    </PageContainerSkeleton>
  )
}

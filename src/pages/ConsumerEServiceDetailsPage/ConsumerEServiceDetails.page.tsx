import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsAlerts'
import { Grid } from '@mui/material'
import {
  ConsumerEServiceDescriptorAttributes,
  ConsumerEServiceDescriptorAttributesSkeleton,
} from './components/ConsumerEServiceDescriptorAttributes'
import {
  ConsumerEServiceGeneralInfoSection,
  ConsumerEServiceGeneralInfoSectionSkeleton,
} from './components/ConsumerEServiceGeneralInfoSection'
import { useTrackPageViewEvent } from '@/config/tracking'

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(eserviceId, descriptorId, {
    suspense: false,
  })

  const { actions } = useGetEServiceConsumerActions(descriptor?.eservice, descriptor)

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      topSideActions={actions}
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
          <React.Suspense fallback={<ConsumerEServiceGeneralInfoSectionSkeleton />}>
            <ConsumerEServiceGeneralInfoSection />
          </React.Suspense>
          <React.Suspense fallback={<ConsumerEServiceDescriptorAttributesSkeleton />}>
            <ConsumerEServiceDescriptorAttributes />
          </React.Suspense>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ConsumerEServiceDetailsPage

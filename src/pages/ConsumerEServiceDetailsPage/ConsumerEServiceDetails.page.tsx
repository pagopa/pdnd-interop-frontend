import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { Link, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsAlerts'
import {
  ConsumerEServiceDetails,
  ConsumerEServiceDetailsSkeleton,
} from './components/ConsumerEServiceDetails'
import { Grid } from '@mui/material'
import {
  ConsumerEServiceDescriptorAttributes,
  ConsumerEServiceDescriptorAttributesSkeleton,
} from './components/ConsumerEServiceDescriptorAttributes'

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(eserviceId, descriptorId, {
    suspense: false,
  })

  const { actions } = useGetEServiceConsumerActions(descriptor?.eservice, descriptor)

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      newTopSideActions={actions}
      isLoading={!descriptor}
      statusChip={descriptor ? { for: 'eservice', state: descriptor?.state } : undefined}
    >
      <ConsumerEServiceDetailsAlerts descriptor={descriptor} />
      <Grid container>
        <Grid item xs={8}>
          <React.Suspense fallback={<ConsumerEServiceDetailsSkeleton />}>
            <ConsumerEServiceDetails />
          </React.Suspense>
          <React.Suspense fallback={<ConsumerEServiceDescriptorAttributesSkeleton />}>
            <ConsumerEServiceDescriptorAttributes />
          </React.Suspense>
        </Grid>
      </Grid>

      <PageBottomActionsContainer>
        <Link as="button" to="SUBSCRIBE_CATALOG_LIST" variant="outlined">
          {t('read.actions.backToCatalogLabel')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerEServiceDetailsPage

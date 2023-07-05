import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { PageContainerSkeleton } from '@/components/layout/containers/PageContainer'
import { EServiceDetails, EServiceDetailsSkeleton } from '@/components/shared/EServiceDetails'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { Link, useParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import { useTranslation } from 'react-i18next'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsAlerts'

const ConsumerEServiceDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ConsumerEServiceDetailsPageContentSkeleton />}>
      <ConsumerEServiceDetailsPageContent />
    </React.Suspense>
  )
}

const ConsumerEServiceDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(eserviceId, descriptorId)
  const { actions } = useGetEServiceConsumerActions(descriptor?.eservice, descriptor)

  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      description={descriptor?.eservice.description || ''}
      topSideActions={topSideActions}
    >
      <ConsumerEServiceDetailsAlerts descriptor={descriptor} />

      {descriptor && <EServiceDetails descriptor={descriptor} />}
      {!descriptor && <EServiceDetailsSkeleton />}

      <PageBottomActionsContainer>
        <Link as="button" to="SUBSCRIBE_CATALOG_LIST" variant="outlined">
          {t('read.actions.backToCatalogLabel')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const ConsumerEServiceDetailsPageContentSkeleton = () => {
  const { t } = useTranslation('eservice')

  return (
    <PageContainerSkeleton>
      <EServiceDetailsSkeleton />
      <PageBottomActionsContainer>
        <Link as="button" to="SUBSCRIBE_CATALOG_LIST" variant="outlined">
          {t('read.actions.backToCatalogLabel')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainerSkeleton>
  )
}

export default ConsumerEServiceDetailsPage

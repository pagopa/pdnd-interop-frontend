import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { PageContainerSkeleton } from '@/components/layout/containers/PageContainer'
import { EServiceDetails, EServiceDetailsSkeleton } from '@/components/shared/EServiceDetails'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { Link, useParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import { Alert, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
  const { actions, isMine, isSubscribed, hasAgreementDraft } = useGetEServiceConsumerActions(
    descriptor?.eservice,
    descriptor
  )

  const topSideActions = formatTopSideActions(actions)

  // Only show missing certified attributes alert when...
  const shouldShowMissingCertifiedAttributesAlert =
    // ...the e-service is not owned by the active party...
    !isMine &&
    // ... the party doesn't own all the certified attributes required...
    !descriptor?.eservice.hasCertifiedAttributes &&
    // ... the e-service'slatest active descriptor is the actual descriptor the user is viewing...
    descriptor?.eservice.activeDescriptor?.id === descriptor?.id &&
    /// ... and it is not archived.
    descriptor?.state !== 'ARCHIVED'

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      description={descriptor?.eservice.name}
      topSideActions={topSideActions}
    >
      <Stack spacing={2}>
        {isMine && <Alert severity="info">{t('read.alert.youAreTheProvider')}</Alert>}
        {shouldShowMissingCertifiedAttributesAlert && (
          <Alert severity="info">{t('read.alert.missingCertifiedAttributes')}</Alert>
        )}
        {isSubscribed && <Alert severity="info">{t('read.alert.alreadySubscribed')}</Alert>}
        {hasAgreementDraft && <Alert severity="info">{t('read.alert.hasAgreementDraft')}</Alert>}
      </Stack>

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

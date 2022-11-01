import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { PageContainerSkeleton, TopSideActions } from '@/components/layout/containers/PageContainer'
import {
  EServiceContentInfo,
  EServiceContentInfoSkeleton,
} from '@/components/shared/EServiceDetails'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { RouterLink, useRouteParams } from '@/router'
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
  const { eserviceId, descriptorId } = useRouteParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { data: eservice } = EServiceQueries.useGetSingle(eserviceId, descriptorId)
  const { actions, canCreateAgreementDraft, isMine, isSubscribed, hasDraft } =
    useGetEServiceConsumerActions(eserviceId, descriptorId)

  const topSideActions: TopSideActions | undefined =
    actions.length > 0
      ? {
          buttons: [actions[0]],
          actionMenu: actions.slice(1).length > 0 ? actions.slice(1) : undefined,
        }
      : undefined

  return (
    <PageContainer
      title={eservice?.name || ''}
      description={eservice?.description}
      topSideActions={topSideActions}
    >
      <Stack spacing={2}>
        {isMine && <Alert severity="info">{t('read.alert.youAreTheProvider')}</Alert>}
        {!isMine && !canCreateAgreementDraft && eservice?.state === 'PUBLISHED' && (
          <Alert severity="info">{t('read.alert.missingCertifiedAttributes')}</Alert>
        )}
        {isSubscribed && <Alert severity="info">{t('read.alert.alreadySubscribed')}</Alert>}
        {hasDraft && <Alert severity="info">{t('read.alert.hasDraft')}</Alert>}
      </Stack>

      <EServiceContentInfo eserviceId={eserviceId} descriptorId={descriptorId} />

      <PageBottomActionsContainer>
        <RouterLink as="button" to="SUBSCRIBE_CATALOG_LIST" variant="outlined">
          {t('read.actions.backToCatalogLabel')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const ConsumerEServiceDetailsPageContentSkeleton = () => {
  const { t } = useTranslation('eservice')

  return (
    <PageContainerSkeleton>
      <EServiceContentInfoSkeleton />
      <PageBottomActionsContainer>
        <RouterLink as="button" to="SUBSCRIBE_CATALOG_LIST" variant="outlined">
          {t('read.actions.backToCatalogLabel')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainerSkeleton>
  )
}

export default ConsumerEServiceDetailsPage

import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { PageContainerSkeleton, TopSideActions } from '@/components/layout/containers/PageContainer'
import {
  EServiceContentInfo,
  EServiceContentInfoSkeleton,
} from '@/components/shared/EServiceDetails'
import useGetEServiceProviderActions from '@/hooks/useGetEServiceProviderActions'
import { RouterLink, useRouteParams } from '@/router'
import { useActiveTab } from '@/router/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Skeleton, Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServicePurposesTable, EServicePurposesTableSkeleton } from './components'

const ProviderEServiceDetailsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<ProviderEServiceDetailsPageContentSkeleton />}>
      <ProviderEServiceDetailsPageContent />
    </React.Suspense>
  )
}

const ProviderEServiceDetailsPageContent: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useRouteParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { data: eservice } = EServiceQueries.useGetSingle(eserviceId, descriptorId)
  const _ = EServiceQueries.useGetSingleFlat(eserviceId, descriptorId)

  const { actions } = useGetEServiceProviderActions({
    eserviceId,
    descriptorId,
    state: eservice?.viewingDescriptor?.state,
  })

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
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('manage.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('manage.tabs.details')} value="details" />
          <Tab label={t('manage.tabs.purposeAwaitingApproval')} value="purposeAwaitingApproval" />
        </TabList>

        <TabPanel value="details" sx={{ p: 0 }}>
          <EServiceContentInfo eserviceId={eserviceId} descriptorId={descriptorId} />
        </TabPanel>
        <TabPanel value="purposeAwaitingApproval" sx={{ px: 0 }}>
          <React.Suspense fallback={<EServicePurposesTableSkeleton />}>
            <EServicePurposesTable eserviceId={eserviceId} />
          </React.Suspense>
        </TabPanel>
      </TabContext>

      <PageBottomActionsContainer>
        <RouterLink as="button" to="PROVIDE_ESERVICE_LIST" variant="outlined">
          {t('read.actions.backToListLabel')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const ProviderEServiceDetailsPageContentSkeleton = () => {
  const { t } = useTranslation('eservice')

  return (
    <PageContainerSkeleton>
      <Skeleton sx={{ mb: 2 }} variant="rectangular" height={48} />
      <EServiceContentInfoSkeleton />
      <PageBottomActionsContainer>
        <RouterLink as="button" to="PROVIDE_ESERVICE_LIST" variant="outlined">
          {t('read.actions.backToListLabel')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainerSkeleton>
  )
}

export default ProviderEServiceDetailsPage

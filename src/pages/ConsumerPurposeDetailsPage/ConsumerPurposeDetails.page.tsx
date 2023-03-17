import { PurposeQueries } from '@/api/purpose'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import useGetConsumerPurposesActions from '@/hooks/useGetConsumerPurposesActions'
import { RouterLink, useRouteParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeClientsTab } from './components/PurposeClientsTab'
import { PurposeDetailsTab, PurposeDetailsTabSkeleton } from './components/PurposeDetailsTab'

const ConsumerPurposeDetailsPage: React.FC = () => {
  const { purposeId } = useRouteParams<'SUBSCRIBE_PURPOSE_DETAILS'>()
  const { t } = useTranslation('purpose')

  const { data: purpose, isLoading } = PurposeQueries.useGetSingle(purposeId, { suspense: false })
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { actions } = useGetConsumerPurposesActions(purpose)
  const topSideActions = formatTopSideActions(actions)

  const isPurposeArchived = purpose?.currentVersion?.state === 'ARCHIVED'

  return (
    <PageContainer
      title={purpose?.title}
      description={purpose?.description}
      isLoading={isLoading}
      topSideActions={topSideActions}
    >
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('view.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('view.tabs.details')} value="details" />
          <Tab label={t('view.tabs.clients')} value="clients" />
        </TabList>

        <TabPanel value="details">
          <React.Suspense fallback={<PurposeDetailsTabSkeleton />}>
            <PurposeDetailsTab purposeId={purposeId} />
          </React.Suspense>
        </TabPanel>

        <TabPanel value="clients">
          <PurposeClientsTab purposeId={purposeId} isPurposeArchived={isPurposeArchived} />
        </TabPanel>
      </TabContext>
      <PageBottomActionsContainer>
        <RouterLink variant="outlined" to="SUBSCRIBE_PURPOSE_LIST" as="button">
          {t('backToPurposeListBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerPurposeDetailsPage

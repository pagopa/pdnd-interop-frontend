import { EServiceQueries } from '@/api/eservice'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { EServiceDetails, EServiceDetailsSkeleton } from '@/components/shared/EServiceDetails'
import useGetEServiceProviderActions from './hooks/useGetEServiceProviderActions'
import { RouterLink, useRouteParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { formatTopSideActions } from '@/utils/common.utils'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServicePurposesTable, EServicePurposesTableSkeleton } from './components'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eserviceId, descriptorId } = useRouteParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { data: descriptor, isLoading: isLoadingDescriptor } =
    EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, { suspense: false })

  const { actions } = useGetEServiceProviderActions(descriptor)

  const topSideActions = formatTopSideActions(actions)

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      description={descriptor?.eservice?.description}
      topSideActions={topSideActions}
      isLoading={isLoadingDescriptor}
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
          {descriptor && <EServiceDetails descriptor={descriptor} />}
          {(!descriptor || isLoadingDescriptor) && <EServiceDetailsSkeleton />}
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

export default ProviderEServiceDetailsPage

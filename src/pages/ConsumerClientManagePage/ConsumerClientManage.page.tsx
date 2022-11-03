import { ClientQueries } from '@/api/client'
import { PageContainer } from '@/components/layout/containers'
import { PageContainerSkeleton } from '@/components/layout/containers/PageContainer'
import { useRouteParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from './hooks/useClientKind'

const ConsumerClientManagePage: React.FC = () => {
  return (
    <React.Suspense fallback={<ConsumerClientManagePageSkeleton />}>
      <ConsumerClientManagePageContent />
    </React.Suspense>
  )
}

const ConsumerClientManagePageContent: React.FC = () => {
  const { t } = useTranslation('client', { keyPrefix: 'edit.tabs' })
  const { clientId } = useRouteParams<
    'SUBSCRIBE_CLIENT_EDIT' | 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'
  >()
  const { activeTab, updateActiveTab } = useActiveTab('voucher')
  const { data: client } = ClientQueries.useGetSingle(clientId)

  return (
    <PageContainer title={client?.name ?? ''} description={client?.description}>
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('ariaLabel')} variant="fullWidth">
          <Tab label={t('voucher')} value="voucher" />
          <Tab label={t('clientMembers')} value="clientMembers" />
          <Tab label={t('publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="voucher"></TabPanel>

        <TabPanel value="clientMembers"></TabPanel>

        <TabPanel value="publicKeys"></TabPanel>
      </TabContext>
    </PageContainer>
  )
}

const ConsumerClientManagePageSkeleton: React.FC = () => {
  return <PageContainerSkeleton>todo</PageContainerSkeleton>
}

export default ConsumerClientManagePage

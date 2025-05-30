import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DelegationsGrantedTab } from './DelegationsGrantedTab/DelegationsGrantedTab'
import { DelegationsReceivedTab } from './components/DelegationsReceivedTab/DelegationsReceivedTab'
import { DelegationsAvailabilityTab } from './DelegationsAvailabilityTab/DelegationAvailabilityTab'

export const DelegationsPage: React.FC = () => {
  const { t: tPages } = useTranslation('pages', { keyPrefix: 'delegations' })
  const { t } = useTranslation('party', { keyPrefix: 'delegations' })
  const { activeTab, updateActiveTab } = useActiveTab('delegationsGranted')

  return (
    <PageContainer title={tPages('title')} description={tPages('description')}>
      <TabContext value={activeTab}>
        <TabList
          sx={{ mt: 4 }}
          onChange={updateActiveTab}
          aria-label={t('tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('tabs.delegationsGranted')} value="delegationsGranted" />
          <Tab label={t('tabs.delegationsReceived')} value="delegationsReceived" />
          <Tab label={t('tabs.availability')} value="availability" />
        </TabList>

        <TabPanel value="delegationsGranted">
          <DelegationsGrantedTab />
        </TabPanel>

        <TabPanel value="delegationsReceived">
          <DelegationsReceivedTab />
        </TabPanel>

        <TabPanel value="availability">
          <DelegationsAvailabilityTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

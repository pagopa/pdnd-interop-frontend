import { PageContainer } from '@/components/layout/containers'
import React from 'react'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { ManageAttributesTab } from './components/ManageAttributesTab/ManageAttributesTab'
import { useTranslation } from 'react-i18next'

const TenantCertifierPage: React.FC = () => {
  const { t: tPages } = useTranslation('pages', { keyPrefix: 'tenantCertifier' })
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier' })
  const { activeTab, updateActiveTab } = useActiveTab('manage')

  return (
    <PageContainer title={tPages('title')} description={tPages('description')}>
      <TabContext value={activeTab}>
        <TabList
          sx={{ mt: 4 }}
          onChange={updateActiveTab}
          aria-label={t('tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('tabs.manage')} value="manage" />
          <Tab label={t('tabs.assign')} value="assign" />
        </TabList>

        <TabPanel value="manage">
          <ManageAttributesTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default TenantCertifierPage

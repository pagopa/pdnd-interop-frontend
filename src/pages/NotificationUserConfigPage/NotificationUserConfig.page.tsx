import React from 'react'
import { PageContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { EmailNotificationUserConfigTab } from './components/EmailNotificationUserConfigTab'
import { InAppNotificationUserConfigTab } from './components/InAppNotificationUserConfigTab'
import { useTranslation } from 'react-i18next'
import { NotificationQueries } from '@/api/notification'
import { useSuspenseQuery } from '@tanstack/react-query'

const NotificationUserConfigPage: React.FC = () => {
  const { activeTab, updateActiveTab } = useActiveTab('inApp')
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage' })

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      // backToAction={{
      //   label: 'TODO',
      //   to: '',
      // }}
    >
      <React.Suspense fallback={<NotificationUserConfigPageSkeleton />}>
        <NotificationUserConfigTabs activeTab={activeTab} updateActiveTab={updateActiveTab} />
      </React.Suspense>
    </PageContainer>
  )
}

const NotificationUserConfigTabs: React.FC<{ activeTab: string; updateActiveTab: any }> = ({
  activeTab,
  updateActiveTab,
}) => {
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage' })

  const { data } = useSuspenseQuery({
    ...NotificationQueries.getUserNotificationConfiguration(),
  })
  return (
    <TabContext value={activeTab}>
      <TabList sx={{ mt: 3 }} onChange={updateActiveTab} variant="fullWidth">
        <Tab label={t('inAppTabTitle')} value="inApp" />
        <Tab label={t('emailTabTitle')} value="email" />
      </TabList>

      <TabPanel value="inApp">
        {data?.inAppConfig && <InAppNotificationUserConfigTab inAppConfig={data.inAppConfig} />}
      </TabPanel>
      <TabPanel value="email">
        {data?.emailConfig && <EmailNotificationUserConfigTab emailConfig={data.emailConfig} />}{' '}
      </TabPanel>
    </TabContext>
  )
}

export const NotificationUserConfigPageSkeleton = () => {
  return (
    <SectionContainerSkeleton
      data-testid="notification-page-skeleton"
      sx={{ mt: 4 }}
      height={200}
    />
  )
}

export default NotificationUserConfigPage

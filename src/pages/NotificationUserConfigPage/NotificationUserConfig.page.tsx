import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { EmailNotificationUserConfigTab } from './components/EmailNotificationUserConfigTab'
import { InAppNotificationUserConfigTab } from './components/InAppNotificationUserConfigTab'
import { useTranslation } from 'react-i18next'

const NotificationUserConfigPage: React.FC = () => {
  const { activeTab, updateActiveTab } = useActiveTab('notificationConfig')
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
      <TabContext value={activeTab}>
        <TabList sx={{ mt: 3 }} onChange={updateActiveTab} variant="fullWidth">
          <Tab label={t('inAppTabTitle')} value="inApp" />
          <Tab label={t('emailTabTitle')} value="email" />
        </TabList>

        <TabPanel value="inApp">
          <InAppNotificationUserConfigTab />
        </TabPanel>
        <TabPanel value="email">
          <EmailNotificationUserConfigTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default NotificationUserConfigPage

import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { EmailNotificationUserConfigTab } from './components/EmailNotificationUserConfigTab'
import { InAppNotificationUserConfigTab } from './components/InAppNotificationUserConfigTab'
import { useTranslation } from 'react-i18next'
import { NotificationQueries } from '@/api/notification'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const NotificationUserConfigPage: React.FC = () => {
  const { activeTab, updateActiveTab } = useActiveTab('notificationConfig')
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage' })

  const { data } = useQuery({
    ...NotificationQueries.getUserNotificationConfiguration(),
    placeholderData: keepPreviousData,
  })

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
          {/* TODO: Put load skeleton here  */}
          {data?.inAppConfig && <InAppNotificationUserConfigTab inAppConfig={data.inAppConfig} />}
        </TabPanel>
        <TabPanel value="email">
          {data?.emailConfig && <EmailNotificationUserConfigTab emailConfig={data.emailConfig} />}{' '}
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default NotificationUserConfigPage

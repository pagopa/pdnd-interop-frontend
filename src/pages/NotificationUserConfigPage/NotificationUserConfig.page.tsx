import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { EmailNotificationUserConfigTab } from './components/EmailNotificationUserConfigTab'
import { InAppNotificationUserConfigTab } from './components/InAppNotificationUserConfigTab'

const NotificationUserConfigPage: React.FC = () => {
  const { activeTab, updateActiveTab } = useActiveTab('notificationConfig')
  return (
    <PageContainer
      title="Configuazioni notifiche utente"
      description="Gestisci le tue impostazioni di notifica in app e via email personale"
      // backToAction={{
      //   label: 'TODO',
      //   to: '',
      // }}
    >
      <TabContext value={activeTab}>
        <TabList
          sx={{ mt: 3 }}
          onChange={updateActiveTab}
          aria-label="lab API tabs"
          variant="fullWidth"
        >
          <Tab label="Notifiche in-app" value="inApp" />
          <Tab label="Email" value="email" />
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

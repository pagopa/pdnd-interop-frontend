import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'

const NotificationConfigPage: React.FC = () => {
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
          <div>Notifiche in app</div>
        </TabPanel>
        <TabPanel value="email">
          <div>Notifhe email</div>
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default NotificationConfigPage

import React from 'react'
import { PageContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { NotificationConfigUserTab } from './components/NotificationUserConfigTab'
import { useTranslation } from 'react-i18next'
import { NotificationMutations, NotificationQueries } from '@/api/notification'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { UserNotificationConfig } from '@/api/api.generatedTypes'
import {
  type NotificationConfig,
  type UserNotificationConfigUpdateSeed,
} from '@/api/api.generatedTypes'
import omit from 'lodash/omit'

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

const NotificationUserConfigTabs: React.FC<{
  activeTab: string
  updateActiveTab: (_: unknown, newTab: string) => void
}> = ({ activeTab, updateActiveTab }) => {
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage' })

  const { data } = useSuspenseQuery({
    ...NotificationQueries.getUserNotificationConfigs(),
  })

  const { mutate: updateUserNotificationConfigs } =
    NotificationMutations.useUpdateNotificationUserConfigs()

  const handleUpdateNotificationConfigEmail = (
    notificationConfig: NotificationConfig,
    preferenceChoice: UserNotificationConfig['emailNotificationPreference']
  ) => {
    const emailConfigSeed = omit(notificationConfig, 'preferenceChoice')
    const notificationConfigSeed: UserNotificationConfigUpdateSeed = {
      inAppNotificationPreference: data?.inAppNotificationPreference,
      inAppConfig: data?.inAppConfig,
      emailConfig: emailConfigSeed,
      emailNotificationPreference: preferenceChoice,
    }

    updateUserNotificationConfigs(notificationConfigSeed)
  }

  const handleUpdateNotificationConfigInApp = (
    notificationConfig: NotificationConfig,
    preferenceChoice: UserNotificationConfig['inAppNotificationPreference']
  ) => {
    const inAppConfigSeed = omit(notificationConfig, 'preferenceChoice')

    const notificationConfigSeed: UserNotificationConfigUpdateSeed = {
      inAppNotificationPreference: preferenceChoice,
      inAppConfig: inAppConfigSeed,
      emailNotificationPreference: data?.emailNotificationPreference,
      emailConfig: data?.emailConfig,
    }

    updateUserNotificationConfigs(notificationConfigSeed)
  }

  return (
    <TabContext value={activeTab}>
      <TabList sx={{ mt: 3 }} onChange={updateActiveTab} variant="fullWidth">
        <Tab label={t('inAppTabTitle')} value="inApp" />
        <Tab label={t('emailTabTitle')} value="email" />
      </TabList>

      {data && (
        <>
          <TabPanel value="inApp">
            <NotificationConfigUserTab
              type="inApp"
              notificationConfig={{
                ...data.inAppConfig,
                preferenceChoice: data.inAppNotificationPreference,
              }}
              handleUpdateNotificationConfigs={(notification, type, preferenceChoice) =>
                handleUpdateNotificationConfigInApp(
                  notification,
                  preferenceChoice as UserNotificationConfig['inAppNotificationPreference']
                )
              }
            />
          </TabPanel>
          <TabPanel value="email">
            <NotificationConfigUserTab
              type="email"
              notificationConfig={{
                ...data.emailConfig,
                preferenceChoice: data.emailNotificationPreference,
              }}
              handleUpdateNotificationConfigs={(notification, type, preferenceChoice) => {
                handleUpdateNotificationConfigEmail(
                  notification,
                  preferenceChoice as UserNotificationConfig['emailNotificationPreference']
                )
              }}
            />
          </TabPanel>
        </>
      )}
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

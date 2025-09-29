import React from 'react'
import { PageContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { NotificationConfigUserTab } from './components/NotificationUserConfigTab'
import { useTranslation } from 'react-i18next'
import { NotificationMutations, NotificationQueries } from '@/api/notification'
import { useSuspenseQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import type { UserNotificationConfig } from '@/api/api.generatedTypes'
import {
  type NotificationConfig,
  type UserNotificationConfigUpdateSeed,
} from '@/api/api.generatedTypes'
import type { NotificationConfigType } from './types'

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

  const handleUpdate = (
    notificationConfig: NotificationConfig,
    type: NotificationConfigType,
    preferenceChoice:
      | UserNotificationConfig['emailNotificationPreference']
      | UserNotificationConfig['inAppNotificationPreference']
  ) => {
    const unnecessaryKeys = ['inAppNotificationPreference', 'emailNotificationPreference']
    const removeUnnecessaryKeys = (config: NotificationConfig) => {
      return Object.fromEntries(
        Object.entries(config).filter(([key]) => !unnecessaryKeys.includes(key))
      ) as NotificationConfig
    }

    const notificationConfigSeed = match(type)
      .with(
        'inApp',
        () =>
          ({
            inAppNotificationPreference: preferenceChoice,
            inAppConfig: removeUnnecessaryKeys(notificationConfig),
            emailNotificationPreference: data?.emailNotificationPreference,
            emailConfig: data?.emailConfig as NotificationConfig,
          }) as UserNotificationConfigUpdateSeed
      )
      .with(
        'email',
        () =>
          ({
            inAppNotificationPreference: data.inAppNotificationPreference,
            inAppConfig: data?.inAppConfig as NotificationConfig,
            emailConfig: removeUnnecessaryKeys(notificationConfig),
            emailNotificationPreference: preferenceChoice,
          }) as UserNotificationConfigUpdateSeed
      )
      .exhaustive()

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
                handleUpdate(notification, type, preferenceChoice)
              }
            />
          </TabPanel>
          <TabPanel value="email">
            <NotificationConfigUserTab
              type="email"
              notificationConfig={{
                ...data.inAppConfig,
                preferenceChoice: data.inAppNotificationPreference,
              }}
              handleUpdateNotificationConfigs={(notification, type, preferenceChoice) =>
                handleUpdate(notification, type, preferenceChoice)
              }
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

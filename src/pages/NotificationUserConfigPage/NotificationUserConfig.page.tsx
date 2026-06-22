import React from 'react'
import { PageContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Link, Tab } from '@mui/material'
import { NotificationConfigUserTab } from './components/NotificationUserConfigTab'
import { Trans, useTranslation } from 'react-i18next'
import { NotificationMutations, NotificationQueries } from '@/api/notification'
import { useQuery } from '@tanstack/react-query'
import {
  type NotificationConfig,
  type UserNotificationConfigUpdateSeed,
} from '@/api/api.generatedTypes'
import omit from 'lodash/omit'
import { notificationGuideLink } from '@/config/constants'

const NotificationUserConfigPage: React.FC = () => {
  const { activeTab, updateActiveTab } = useActiveTab('inApp')
  const { t } = useTranslation('notification', { keyPrefix: 'notifications.configurationPage' })

  return (
    <PageContainer
      title={t('title')}
      description={
        <Trans
          components={{
            1: <Link underline="hover" href={notificationGuideLink} target="_blank" />,
          }}
        >
          {t('description')}
        </Trans>
      }
    >
      <NotificationUserConfigTabs activeTab={activeTab} updateActiveTab={updateActiveTab} />
    </PageContainer>
  )
}

const NotificationUserConfigTabs: React.FC<{
  activeTab: string
  updateActiveTab: (_: unknown, newTab: string) => void
}> = ({ activeTab, updateActiveTab }) => {
  const { t } = useTranslation('notification', { keyPrefix: 'notifications.configurationPage' })

  const { data } = useQuery(NotificationQueries.getUserNotificationConfigs())

  const { mutate: updateUserNotificationConfigs } =
    NotificationMutations.useUpdateNotificationUserConfigs()

  const handleUpdateNotificationConfigEmail = (
    notificationConfig: NotificationConfig,
    emailNotificationPreference: boolean,
    emailDigestPreference: boolean
  ) => {
    if (!data) return
    const emailConfigSeed = omit(notificationConfig, [
      'emailDigestPreference',
      'emailNotificationPreference',
      'inAppNotificationPreference',
    ]) as NotificationConfig

    const notificationConfigSeed: UserNotificationConfigUpdateSeed = {
      inAppNotificationPreference: data?.inAppNotificationPreference,
      inAppConfig: data?.inAppConfig,
      emailConfig: emailConfigSeed,
      emailNotificationPreference,
      emailDigestPreference,
    }

    updateUserNotificationConfigs(notificationConfigSeed)
  }

  const handleUpdateNotificationConfigInApp = (
    notificationConfig: NotificationConfig,
    inAppNotificationPreference: boolean
  ) => {
    if (!data) return
    const inAppConfigSeed = omit(notificationConfig, [
      'emailDigestPreference',
      'emailNotificationPreference',
      'inAppNotificationPreference',
    ]) as NotificationConfig

    const notificationConfigSeed: UserNotificationConfigUpdateSeed = {
      inAppNotificationPreference,
      inAppConfig: inAppConfigSeed,
      emailNotificationPreference: data?.emailNotificationPreference,
      emailDigestPreference: data?.emailDigestPreference,
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

      <>
        <TabPanel value="inApp">
          {!data && <NotificationUserConfigPageSkeleton />}
          {data && (
            <NotificationConfigUserTab
              type="inApp"
              notificationConfig={{
                ...data.inAppConfig,
                inAppNotificationPreference: data.inAppNotificationPreference,
                emailDigestPreference: data.emailDigestPreference,
                emailNotificationPreference: data.emailNotificationPreference,
              }}
              handleUpdateNotificationConfigs={(notification, inAppNotificationPreference) => {
                handleUpdateNotificationConfigInApp(notification, inAppNotificationPreference)
              }}
            />
          )}
        </TabPanel>
        <TabPanel value="email">
          {!data && <NotificationUserConfigPageSkeleton />}
          {data && (
            <NotificationConfigUserTab
              type="email"
              notificationConfig={{
                ...data.emailConfig,
                inAppNotificationPreference: data.inAppNotificationPreference,
                emailDigestPreference: data.emailDigestPreference,
                emailNotificationPreference: data.emailNotificationPreference,
              }}
              handleUpdateNotificationConfigs={(
                notification,
                _inAppNotificationPreference,
                emailNotificationPreference,
                emailDigestPreference
              ) => {
                handleUpdateNotificationConfigEmail(
                  notification,
                  emailNotificationPreference,
                  emailDigestPreference
                )
              }}
            />
          )}
        </TabPanel>
      </>
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

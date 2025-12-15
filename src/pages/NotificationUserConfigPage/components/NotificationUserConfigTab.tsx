import React from 'react'
import { FormProvider } from 'react-hook-form'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Stack, Typography, Alert } from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useGetNotificationConfigSchema } from '../hooks/useGetNotificationConfigSchema'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import type { NotificationConfigFormValues, NotificationConfigType } from '../types'
import { match } from 'ts-pattern'
import { AuthHooks } from '@/api/auth'
import { NotificationConfigSection } from './NotificationConfigSection'
import { useNotificationConfigForm } from '../hooks/useNotificationConfigForm'

type NotificationConfigUserTabProps = {
  notificationConfig: NotificationConfigFormValues
  handleUpdateNotificationConfigs: (
    notificationConfig: NotificationConfig,
    inAppNotificationPreference: boolean,
    emailNotificationPreference: boolean,
    emailDigestPreference: boolean
  ) => void
  type: NotificationConfigType
}

export const NotificationConfigUserTab: React.FC<NotificationConfigUserTabProps> = ({
  notificationConfig,
  handleUpdateNotificationConfigs,
  type,
}) => {
  const { t: tConfiguration } = useTranslation('notification', {
    keyPrefix: 'notifications.configurationPage',
  })
  const { t } = useTranslation('notification', {
    keyPrefix: `notifications.configurationPage.${type}`,
  })
  const { userEmail } = AuthHooks.useJwt()

  const {
    formMethods,
    inAppNotificationPreference,
    emailNotificationPreference,
    emailDigestPreference,
    valuesChanged,
  } = useNotificationConfigForm({
    handleUpdateNotificationConfigs,
    notificationConfig,
    type,
  })

  const { notificationSchema, sectionComponentKeysMap } = useGetNotificationConfigSchema(type)

  const onClickEnableAllSectionSwitch = (sectionName: string, value: boolean) => {
    sectionComponentKeysMap[sectionName].forEach((inAppConfigKey: string) => {
      formMethods.setValue(inAppConfigKey as keyof NotificationConfig, value, {
        shouldDirty: true,
      })
    })
  }

  const getSwitchBySections = (sectionName: string) => {
    return sectionComponentKeysMap[sectionName].filter(
      (item) => !valuesChanged[item as keyof NotificationConfig]
    )
  }

  const isEnabledShowPreferencesSwitch = match(type)
    .with('email', () => !!emailNotificationPreference)
    .with('inApp', () => !!inAppNotificationPreference)
    .exhaustive()

  return (
    <FormProvider {...formMethods}>
      <SectionContainer sx={{ px: 4, pt: 4 }} title={t('title')} description={t('description')}>
        {type === 'email' ? (
          <EmailConfigHeader userEmail={userEmail} emailDigestPreference={emailDigestPreference} />
        ) : (
          <InAppConfigHeader />
        )}
        {/* {inAppNotificationPreference !== 'DIGEST' && ( */}
        <Alert sx={{ mt: 2 }} severity="info">
          {tConfiguration('infoAlert')}
        </Alert>
        {/* )} */}
        <Box sx={{ ml: 2, mt: 2 }}>
          {isEnabledShowPreferencesSwitch &&
            Object.keys(notificationSchema).map((sectionName) => {
              const isAllSwitchWithinSectionDisabled = getSwitchBySections(sectionName).length <= 0

              return (
                <NotificationConfigSection
                  key={sectionName}
                  notificationSchema={notificationSchema[sectionName]}
                  type={type}
                  name={sectionName}
                  onClickEnableAllSectionSwitch={onClickEnableAllSectionSwitch}
                  isAllSwitchWithinSectionDisabled={isAllSwitchWithinSectionDisabled}
                />
              )
            })}
        </Box>
      </SectionContainer>
    </FormProvider>
  )
}

type EmailConfigHeaderProps = {
  userEmail: string | undefined
  emailDigestPreference: boolean
}
const EmailConfigHeader = ({ userEmail, emailDigestPreference }: EmailConfigHeaderProps) => {
  const { t } = useTranslation('notification', {
    keyPrefix: `notifications.configurationPage.email`,
  })
  return (
    <>
      <Stack direction="row" spacing={8} sx={{ mb: 2 }}>
        <Typography data-testid="test-email">{t('mailLabel')}</Typography>
        <Typography fontWeight={600}>{userEmail}</Typography>
      </Stack>
      {/* Need to understand whats the link should point to */}
      {/* <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
        {t('linkLabel')}
      </Link> */}

      <RHFSwitch
        sx={{ pl: 2 }}
        key="emailDigestPreference"
        name="emailDigestPreference"
        label={
          <SwitchLabelDescription
            label={t('digestSwitch.label')}
            description={t('digestSwitch.description')}
          />
        }
      />
      <RHFSwitch
        sx={{ pl: 2 }}
        key="emailNotificationPreference"
        name="emailNotificationPreference"
        label={
          <SwitchLabelDescription
            label={t('customNotificationSwitch.label')}
            description={t('customNotificationSwitch.description')}
          />
        }
      />

      {/* {emailDigestPreference && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('digestInfoDescription')}
        </Alert>
      )} */}
    </>
  )
}

const InAppConfigHeader = () => {
  const { t } = useTranslation('notification', {
    keyPrefix: `notifications.configurationPage.inApp`,
  })
  return (
    <>
      {/* Need to understand whats the link should point to */}
      {/* <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
        {t('manualLinkLabel')}
      </Link> */}
      <Box sx={{ ml: 2, mt: 2 }}>
        <RHFSwitch
          name="inAppNotificationPreference"
          label={
            <SwitchLabelDescription
              label={t('enableAllNotifications.label')}
              description={t('enableAllNotifications.description')}
            />
          }
        />
      </Box>
    </>
  )
}

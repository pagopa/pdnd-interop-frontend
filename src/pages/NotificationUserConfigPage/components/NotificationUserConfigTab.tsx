import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Controller, FormProvider } from 'react-hook-form'
import { SectionContainer } from '@/components/layout/containers'
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useGetNotificationConfigSchema } from '../hooks/useGetNotificationConfigSchema'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import type { NotificationConfigType, NotificationPreferenceChoiceType } from '../types'
import { match } from 'ts-pattern'
import { AuthHooks } from '@/api/auth'
import { NotificationConfigSection } from './NotificationConfigSection'
import { useNotificationConfigForm } from '../hooks/useNotificationConfigForm'

type NotificationConfigFormValues = NotificationConfig & {
  preferenceChoice: NotificationPreferenceChoiceType
}
type NotificationConfigUserTabProps = {
  notificationConfig: NotificationConfigFormValues
  handleUpdateNotificationConfigs: (
    notificationConfig: NotificationConfig,
    type: NotificationConfigType,
    preferenceChoice: NotificationPreferenceChoiceType
  ) => void
  type: NotificationConfigType
}

export const NotificationConfigUserTab: React.FC<NotificationConfigUserTabProps> = ({
  notificationConfig,
  handleUpdateNotificationConfigs,
  type,
}) => {
  const { t: tConfiguration } = useTranslation('notification', { keyPrefix: 'configurationPage' })
  const { t } = useTranslation('notification', { keyPrefix: `configurationPage.${type}` })
  const { userEmail } = AuthHooks.useJwt()

  const { formMethods, preferenceChoice, valuesChanged } = useNotificationConfigForm({
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
    .with('email', () => preferenceChoice === 'ENABLED')
    .with('inApp', () => !!preferenceChoice)
    .exhaustive()

  return (
    <FormProvider {...formMethods}>
      <SectionContainer sx={{ px: 4, pt: 4 }} title={t('title')} description={t('description')}>
        {type === 'email' ? (
          <EmailConfigHeader
            formMethods={formMethods}
            userEmail={userEmail}
            preferenceChoice={preferenceChoice}
          />
        ) : (
          <InAppConfigHeader />
        )}
        {preferenceChoice !== 'DIGEST' && (
          <Alert sx={{ mt: 2 }} severity="info">
            {tConfiguration('infoAlert')}
          </Alert>
        )}
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
  formMethods: UseFormReturn<NotificationConfigFormValues>
  preferenceChoice: NotificationPreferenceChoiceType
}
const EmailConfigHeader = ({
  userEmail,
  formMethods,
  preferenceChoice,
}: EmailConfigHeaderProps) => {
  const { t } = useTranslation('notification', { keyPrefix: `configurationPage.email` })
  return (
    <>
      <Stack direction="row" spacing={8} sx={{ mb: 2 }}>
        <Typography data-testid="test-email">Indirizzo email</Typography>
        <Typography fontWeight={600}>{userEmail}</Typography>
      </Stack>
      {/* Need to understand whats the link should point to */}
      {/* <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
        {t('linkLabel')}
      </Link> */}
      <Controller
        name="preferenceChoice"
        control={formMethods.control}
        render={({ field }) => (
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="emailPreferenceLabel">{t('emailPreferencesLabel')}</InputLabel>
            <Select
              labelId="emailPreferenceLabel"
              id="preferenceChoice"
              label={t('emailPreferencesLabel')}
              {...field}
            >
              <MenuItem value="DISABLED">{t('notSend')}</MenuItem>
              <MenuItem value="DIGEST">{t('digest')}</MenuItem>
              <MenuItem value="ENABLED">{t('customize')}</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {/* <RHFSwitch // Need for next features
        sx={{ pl: 2 }}
        name={'digest'}
        label={
          <SwitchLabelDescription
            label={t('digestSwitch.label')}
            description={t('digestSwitch.description')}
          />
        }
      />
      <RHFSwitch
        sx={{ pl: 2 }}
        key="customNotificationSwitch"
        name={'customNotificationSwitch'}
        label={
          <SwitchLabelDescription
            label={t('customNotificationSwitch.label')}
            description={t('customNotificationSwitch.description')}
          />
        }
      /> */}

      {preferenceChoice === 'DIGEST' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('digestInfoDescription')}
        </Alert>
      )}
    </>
  )
}

const InAppConfigHeader = () => {
  const { t } = useTranslation('notification', { keyPrefix: `configurationPage.inApp` })
  return (
    <>
      {/* Need to understand whats the link should point to */}
      {/* <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
        {t('manualLinkLabel')}
      </Link> */}
      <Box sx={{ ml: 2, mt: 2 }}>
        <RHFSwitch
          name="preferenceChoice"
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

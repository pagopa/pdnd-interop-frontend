import React, { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NotificationConfigSection } from './NotificationConfigSection'
import { SectionContainer } from '@/components/layout/containers'
import {
  Box,
  Card,
  Link,
  Stack,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useNotificationConfigHook } from '../hooks/useNotificationConfigHook'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import { debounce } from 'lodash'
import type {
  NotificationSubSectionSchema,
  NotificationConfigType,
  NotificationPreferenceChoiceType,
} from '../types'
import { match } from 'ts-pattern'
import { AuthHooks } from '@/api/auth'

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

  const { notificationSchema, sectionComponentKeysMap } = useNotificationConfigHook(type)
  const { userEmail } = AuthHooks.useJwt()

  const formMethods = useForm<
    NotificationConfig & {
      preferenceChoice: NotificationPreferenceChoiceType
    }
  >({
    defaultValues: { ...notificationConfig, preferenceChoice: notificationConfig.preferenceChoice },
  })
  const valueChanged = formMethods.watch()
  const preferenceChoice = formMethods.getValues('preferenceChoice')

  const debouncedUpdate = React.useMemo(
    () =>
      debounce((data: NotificationConfigFormValues) => {
        const preferenceChoice = formMethods.getValues('preferenceChoice')
        handleUpdateNotificationConfigs(data, type, preferenceChoice)
      }, 1000),
    [handleUpdateNotificationConfigs, formMethods, type]
  )

  useEffect(() => {
    const subscription = formMethods.watch((value) => {
      debouncedUpdate(value as NotificationConfigFormValues)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [formMethods, formMethods.watch, formMethods.formState.isDirty, debouncedUpdate])

  const onClickEnableAllSectionSwitch = (sectionName: string, value: boolean) => {
    sectionComponentKeysMap[sectionName].forEach((inAppConfigKey: string) => {
      formMethods.setValue(inAppConfigKey as keyof NotificationConfig, value, {
        shouldDirty: true,
      })
    })
  }

  const getSwitchBySections = (sectionName: string) => {
    return sectionComponentKeysMap[sectionName].filter(
      (item) => !valueChanged[item as keyof NotificationConfig]
    )
  }

  const isEnabledShowPreferencesSwitch = (): boolean => {
    return match(type)
      .with('email', () => {
        return preferenceChoice === 'ENABLED'
      })
      .with('inApp', () => {
        return !!preferenceChoice
      })
      .exhaustive()
  }

  const InAppConfigHeader = () => (
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

  const EmailConfigHeader = () => (
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
      {preferenceChoice === 'DIGEST' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('digestInfoDescription')}
        </Alert>
      )}
    </>
  )

  return (
    <FormProvider {...formMethods}>
      <SectionContainer sx={{ px: 4, pt: 4 }} title={t('title')} description={t('description')}>
        {type === 'email' ? <EmailConfigHeader /> : <InAppConfigHeader />}
        {preferenceChoice !== 'DIGEST' && (
          <Alert sx={{ mt: 2 }} severity="info">
            {tConfiguration('infoAlert')}
          </Alert>
        )}
        <Box sx={{ ml: 2, mt: 2 }}>
          {isEnabledShowPreferencesSwitch() &&
            Object.keys(notificationSchema).map((sectionName) => {
              const isAllSwitchWithinSectionDisabled = getSwitchBySections(sectionName).length <= 0
              const SectionIcon = notificationSchema[sectionName].icon

              return (
                <Box key={sectionName} data-testid={`config-section-${sectionName}`}>
                  <Card sx={{ ml: -2, px: 3, mb: 2 }} variant="outlined">
                    <Box
                      display="flex"
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 4, mt: 3 }}
                    >
                      <Stack alignItems="center" direction="row" gap={1}>
                        <SectionIcon />
                        <Typography variant="button">
                          {notificationSchema[sectionName].title}
                        </Typography>
                      </Stack>
                      <Button
                        data-testid={`enableSectionAllNotifications-${sectionName}`}
                        variant="naked"
                        sx={{ mr: 3 }}
                        onClick={() =>
                          onClickEnableAllSectionSwitch(
                            sectionName,
                            !isAllSwitchWithinSectionDisabled
                          )
                        }
                      >
                        {isAllSwitchWithinSectionDisabled
                          ? t('disableSectionAllNotifications')
                          : t('enableSectionAllNotifications')}
                      </Button>
                    </Box>

                    {notificationSchema[sectionName].subsections.map(
                      (subsection: NotificationSubSectionSchema) => {
                        return (
                          <NotificationConfigSection
                            data-testid={sectionName}
                            key={sectionName}
                            subsection={subsection}
                          />
                        )
                      }
                    )}
                  </Card>
                </Box>
              )
            })}
        </Box>
      </SectionContainer>
    </FormProvider>
  )
}

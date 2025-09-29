import React, { useCallback, useEffect, useRef } from 'react'
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
  SelectChangeEvent,
} from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useNotificationConfigHook } from '../hooks/useNotificationConfigHook'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import { debounce, isEqual } from 'lodash'
import type {
  NotificationSubSectionSchema,
  NotificationConfigType,
  NotificationPreferenceChoiceType,
} from '../types'
import { match } from 'ts-pattern'

type NotificationConfigUserTabProps = {
  notificationConfig: NotificationConfig & {
    preferenceChoice: NotificationPreferenceChoiceType
  }
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
  const { t } = useTranslation('notification', { keyPrefix: `configurationPage.${type}` })

  const { notificationSchema, sectionComponentKeysMap } = useNotificationConfigHook(type)

  const userEmail = 'pippo@mail.com' // TODO: Should be available with api

  const formMethods = useForm<
    NotificationConfig & {
      preferenceChoice: NotificationPreferenceChoiceType
    }
  >({
    defaultValues: { ...notificationConfig, preferenceChoice: notificationConfig.preferenceChoice },
  })

  const valueChanged = formMethods.watch()
  const valuesRef = useRef<NotificationConfig>(valueChanged)
  const previousValuesRef = useRef<NotificationConfig | null>(null)

  valuesRef.current = valueChanged
  const preferenceChoice = formMethods.getValues('preferenceChoice')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(
    debounce(() => {
      previousValuesRef.current = valuesRef.current
      const preferenceChoice = formMethods.getValues('preferenceChoice')
      handleUpdateNotificationConfigs(valuesRef.current, type, preferenceChoice)
    }, 1000),
    []
  )

  useEffect(() => {
    if (
      formMethods.formState.isDirty &&
      valueChanged &&
      !isEqual(valueChanged, previousValuesRef.current)
    ) {
      debounceFn()
    }
  }, [debounceFn, valueChanged, formMethods.formState.isDirty])

  const onClickEnableAllSectionSwitch = (sectionName: string, value: boolean) => {
    sectionComponentKeysMap[sectionName].forEach((inAppConfigKey: string) => {
      formMethods.setValue(inAppConfigKey as keyof NotificationConfig, value, {
        shouldDirty: true,
      })
    })
  }

  const getSwitchBySections = (sectionName: string) => {
    return sectionComponentKeysMap[sectionName].filter(
      (item) => !valuesRef.current[item as keyof NotificationConfig]
    )
  }

  const isEnabledShowPreferencesSwitch = (): boolean => {
    const preferenceChoice = formMethods.getValues('preferenceChoice')
    return match(type)
      .with('email', () => {
        return preferenceChoice === 'ENABLED'
      })
      .with('inApp', () => {
        return preferenceChoice ? true : false
      })
      .exhaustive()
  }

  return (
    <FormProvider {...formMethods}>
      <SectionContainer sx={{ px: 4, pt: 4 }} title={t('title')} description={t('description')}>
        {type === 'inApp' && (
          <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
            {t('manualLinkLabel')}
          </Link>
        )}

        {type === 'email' && (
          <>
            <Stack direction="row" spacing={8} sx={{ mb: 2 }}>
              <Typography data-testid="test-email">Indirizzo email</Typography>
              <Typography fontWeight={600}>{userEmail}</Typography>
            </Stack>
            <Link
              href="https://docs.pagopa.it/interoperabilita-1"
              underline="none"
              variant="button"
            >
              {t('linkLabel')}
            </Link>
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
            {preferenceChoice === 'DIGEST' && type === 'email' && (
              <Alert severity="info" sx={{ mt: 3 }}>
                {t('digestInfoDescription')}
              </Alert>
            )}
          </>
        )}

        <Box sx={{ ml: 2, mt: 2 }}>
          {type === 'inApp' && (
            <RHFSwitch
              name="preferenceChoice"
              label={
                <SwitchLabelDescription
                  label={t('enableAllNotifications.label')}
                  description={t('enableAllNotifications.description')}
                />
              }
            />
          )}

          {isEnabledShowPreferencesSwitch() &&
            Object.keys(notificationSchema).map((sectionName) => {
              const isAllSwitchWithinSectionDisabled = getSwitchBySections(sectionName).length <= 0

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
                        <MenuBookIcon />
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

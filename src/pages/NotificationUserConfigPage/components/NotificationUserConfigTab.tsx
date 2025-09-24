import React, { useCallback, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useNotificationConfigHook } from '../hooks/useNotificationConfigHook'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import { debounce, isEqual } from 'lodash'
import type { NotificationSubSectionSchema, NotificationConfigType } from '../types'
import { match } from 'ts-pattern'

type NotificationConfigUserTabProps = {
  notificationConfig: NotificationConfig
  handleUpdateNotificationConfigs: (
    notificationConfig: NotificationConfig,
    type: NotificationConfigType
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
  const [emailPreferencesChoice, setPreferencesChoices] = React.useState<
    'notSend' | 'digest' | 'customize'
  >('customize')

  const userEmail = 'pippo@mail.com' // TODO: Should be available with api

  const formMethods = useForm<NotificationConfig & { enableAllNotification: boolean }>({
    defaultValues: { ...notificationConfig, enableAllNotification: true },
  })

  const valueChanged = formMethods.watch()
  const valuesRef = useRef<NotificationConfig>(valueChanged)
  const previousValuesRef = useRef<NotificationConfig | null>(null)

  valuesRef.current = valueChanged

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(
    debounce(() => {
      previousValuesRef.current = valuesRef.current
      handleUpdateNotificationConfigs(valuesRef.current, type)
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
    return match(type)
      .with('email', () => {
        return emailPreferencesChoice === 'customize'
      })
      .with('inApp', () => {
        return valueChanged.enableAllNotification
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
          </>
        )}

        {type === 'email' && (
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel id="demo-simple-select-label">{t('emailPreferencesLabel')}</InputLabel>
            <Select
              labelId="emailPrefefences"
              id="emailPreferences"
              value={emailPreferencesChoice}
              label={t('emailPreferencesLabel')}
              onChange={(event) =>
                setPreferencesChoices(event.target.value as 'notSend' | 'digest' | 'customize')
              }
            >
              <MenuItem value="notSend">{t('notSend')}</MenuItem>
              <MenuItem value="digest">{t('digest')}</MenuItem>
              <MenuItem value="customize">{t('customize')}</MenuItem>
            </Select>
          </FormControl>
        )}

        {emailPreferencesChoice === 'digest' && type === 'email' && (
          <Alert severity="info" sx={{ mt: 3 }}>
            {t('digestInfoDescription')}
          </Alert>
        )}

        <Box sx={{ ml: 2, mt: 2 }}>
          {type === 'inApp' && (
            <RHFSwitch
              data-testid="enableAllNotification"
              name="enableAllNotification"
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

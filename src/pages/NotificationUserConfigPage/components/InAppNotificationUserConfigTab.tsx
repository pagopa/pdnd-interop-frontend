import React, { useCallback, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { NotificationConfigSection } from './NotificationConfigSection'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Card, Link, Stack, Typography } from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useNotificationInAppConfigForm } from '../hooks/useNotificationInAppConfigForm'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import { debounce } from 'lodash'

type InAppNotificationUserConfigTabProps = {
  inAppConfig: NotificationConfig
}
export type NotificationSubSectionSchema = {
  name: string
  title: string
  components: {
    key: string
    title: string
    description: string
  }[]
}
export type NotificationSectionSchema = {
  title: string
  subsections: NotificationSubSectionSchema[]
}
export type NotificationConfigSchema = {
  [key: string]: NotificationSectionSchema
}

export const InAppNotificationUserConfigTab: React.FC<InAppNotificationUserConfigTabProps> = ({
  inAppConfig,
}) => {
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage.inAppTab' })

  const { notificationSchema } = useNotificationInAppConfigForm()

  const formMethods = useForm<NotificationConfig & { enableAllNotification: boolean }>({
    defaultValues: { ...inAppConfig, enableAllNotification: false },
  })

  const valueChanged = formMethods.watch()
  const valuesRef = useRef(valueChanged)
  valuesRef.current = valueChanged

  const debounceFn = useCallback(
    debounce(() => {
      console.log('value has been changed: call API', valuesRef.current)
      //TODO: Dedcide timing in ms
    }, 1000),
    []
  )

  useEffect(() => {
    if (valueChanged) debounceFn()
  }, [debounceFn, valueChanged])

  return (
    <FormProvider {...formMethods}>
      <SectionContainer sx={{ px: 4, pt: 4 }} title={t('title')} description={t('description')}>
        <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
          Dubbi? Vai al manuale (TODO TRANSLATE)
        </Link>
        <Box sx={{ px: 3, mt: 2 }}>
          <RHFSwitch
            name="enableAllNotification"
            label={
              <SwitchLabelDescription
                label={t('enableAllNotifications.label')}
                description={t('enableAllNotifications.description')}
              />
            }
          />

          {valueChanged.enableAllNotification &&
            Object.keys(notificationSchema).map((sectionName) => {
              return (
                <Box key={sectionName}>
                  <Card sx={{ ml: -2, px: 3, mb: 2 }} variant="outlined">
                    <Box
                      display="flex"
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 4 }}
                    >
                      <Stack alignItems="center" direction="row" gap={1}>
                        <MenuBookIcon />
                        <Typography variant="button">
                          {notificationSchema[sectionName].title}
                        </Typography>
                      </Stack>

                      <RHFSwitch sx={{ width: 'auto' }} name="toBeDefined" label="Abilita tutto" />
                    </Box>

                    {notificationSchema[sectionName].subsections.map((subsection) => (
                      <NotificationConfigSection key={sectionName} subsection={subsection} />
                    ))}
                  </Card>
                </Box>
              )
            })}
        </Box>
      </SectionContainer>
    </FormProvider>
  )
}

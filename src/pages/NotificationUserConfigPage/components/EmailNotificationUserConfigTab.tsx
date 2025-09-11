import type { NotificationConfig } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { Box, Card, Link, Stack, Typography, Button } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { NotificationConfigSection } from './NotificationConfigSection'
import { useNotificationEmailConfigForm } from '../hooks/useNotificationEmailConfigForm'
import { useCallback, useEffect, useRef } from 'react'
import { debounce } from 'lodash'

type EmailNotificationUserConfigTabProps = {
  emailConfig: NotificationConfig
}

export const EmailNotificationUserConfigTab: React.FC<EmailNotificationUserConfigTabProps> = ({
  emailConfig,
}) => {
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage.emailTab' })
  const formMethods = useForm<NotificationConfig & { enableAllNotification: boolean }>({
    defaultValues: { ...emailConfig, enableAllNotification: false },
  })
  const { notificationSchema } = useNotificationEmailConfigForm()
  const userMail = 'pippo@mail.com'

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

  const onClickEnableAllSectionSwitch = (sectionName: string) => {
    const sectionComponentsKeys = notificationSchema[sectionName].subsections.flatMap((s) =>
      s.components.map((c) => c.key)
    )

    sectionComponentsKeys.map((inAppConfigKey) => {
      formMethods.setValue(inAppConfigKey as keyof NotificationConfig, true)
    })
  }

  return (
    <FormProvider {...formMethods}>
      <SectionContainer sx={{ px: 4, pt: 4 }} title={t('title')} description={t('description')}>
        <Stack direction="row" spacing={8} sx={{ mb: 2 }}>
          <Typography>Indirizzo email</Typography>
          <Typography fontWeight={600}>{userMail}</Typography>
        </Stack>
        <Link
          href="https://docs.pagopa.it/interoperabilita-1"
          fontWeight={600}
          underline="none"
          variant="button"
        >
          {t('linkLabel')}
        </Link>
        <Box sx={{ px: 3, mt: 2 }}>
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
          {valueChanged.enableAllNotification &&
            Object.keys(notificationSchema).map((sectionName) => {
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
                        variant="naked"
                        sx={{ mr: 3 }}
                        onClick={() => onClickEnableAllSectionSwitch(sectionName)}
                      >
                        {t('enableSectionAllNotifications')}
                      </Button>
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

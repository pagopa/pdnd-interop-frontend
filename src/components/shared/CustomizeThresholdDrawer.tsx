import React, { useEffect } from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { Drawer } from '@/components/shared/Drawer'
import { Alert, Stack, Button, Typography } from '@mui/material'
import { RHFTextField } from './react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { type DescriptorAttribute } from '@/api/api.generatedTypes'
import { type AttributeKey } from '@/types/attribute.types'
import { WarningAmber } from '@mui/icons-material'

export type CustomizeThresholdDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  attribute?: DescriptorAttribute
  attributeKey?: AttributeKey
  attributeGroupIndex?: number
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  onSubmit: (threshold: number) => void
}

type CustomizeThresholdFormValues = {
  threshold: number
}

export const CustomizeThresholdDrawer: React.FC<CustomizeThresholdDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  attribute,
  attributeKey,
  dailyCallsPerConsumer,
  dailyCallsTotal,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.step2.attributes.customizeThresholdDrawer',
  })
  const formMethods = useForm<CustomizeThresholdFormValues>({
    defaultValues: {
      threshold: attribute?.dailyCallsPerConsumer,
    },
  })

  const handleFormSubmit: SubmitHandler<CustomizeThresholdFormValues> = (values) => {
    onSubmit(values.threshold)
  }

  useEffect(() => {
    if (isOpen) {
      formMethods.reset({
        threshold: attribute?.dailyCallsPerConsumer,
      })
    }
  }, [isOpen, formMethods, attribute])
  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        title={t('title')}
        subtitle={t('subtitle', { type: attributeKey, name: attribute?.name })}
        onTransitionExited={formMethods.reset}
        onClose={onClose}
      >
        <Stack
          justifyContent={'space-between'}
          sx={{ height: '100%', pb: 5 }}
          component={'form'}
          noValidate
          onSubmit={formMethods.handleSubmit(handleFormSubmit)}
          id="threshold-form"
        >
          <Stack spacing={5}>
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              name="threshold"
              label={t('field.placeholder')}
              infoLabel={t('field.info')}
              type="number"
              rules={{
                required: true,
                min: 1,
              }}
            />
            <Alert icon={false} color="info">
              <Stack>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('limitAlert.title')}
                </Typography>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography
                    sx={{
                      fontSize: 16,
                    }}
                  >
                    {t('limitAlert.totalLimit')}
                  </Typography>
                  {dailyCallsTotal ? (
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {t('limitAlert.label', { threshold: dailyCallsTotal })}
                    </Typography>
                  ) : (
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <WarningAmber color="warning" />
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {t('limitAlert.toInsert')}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography
                    sx={{
                      fontSize: 16,
                    }}
                  >
                    {t('limitAlert.consumerLimit')}
                  </Typography>
                  {dailyCallsPerConsumer ? (
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {t('limitAlert.label', { threshold: dailyCallsPerConsumer })}
                    </Typography>
                  ) : (
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <WarningAmber color="warning" />
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {t('limitAlert.toInsert')}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Alert>
          </Stack>
          <Stack spacing={5}>
            <Alert severity="info">{t('alert')}</Alert>
            <Button type={'submit'} form="threshold-form" variant="contained">
              {t('submitBtnLabel')}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

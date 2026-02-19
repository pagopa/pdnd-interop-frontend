import React, { useEffect } from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { Drawer } from '@/components/shared/Drawer'
import { Alert, Stack, Button, Typography } from '@mui/material'
import { RHFTextField } from './react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { type DescriptorAttribute } from '@/api/api.generatedTypes'
import { WarningAmber } from '@mui/icons-material'
import { create } from 'zustand'
import isEmpty from 'lodash/isEmpty'

export type CustomizeThresholdDrawerProps = {
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  onSubmit: (threshold: number) => void
}

type CustomizeThresholdDrawerStore = {
  isOpen: boolean
  open: (attribute: DescriptorAttribute, attributeGroupIndex: number) => void
  close: VoidFunction
  attribute?: DescriptorAttribute
  attributeGroupIndex?: number
}

export const useCustomizeThresholdDrawer = create<CustomizeThresholdDrawerStore>((set) => ({
  isOpen: false,
  open: (attribute, attributeGroupIndex) => set({ attribute, attributeGroupIndex, isOpen: true }),
  close: () => set({ isOpen: false, attribute: undefined, attributeGroupIndex: undefined }),
}))

type CustomizeThresholdFormValues = {
  threshold: number
}

export const CustomizeThresholdDrawer: React.FC<CustomizeThresholdDrawerProps> = ({
  onSubmit,
  dailyCallsPerConsumer,
  dailyCallsTotal,
}) => {
  const { isOpen, close, attribute } = useCustomizeThresholdDrawer()
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
        subtitle={t('subtitle', { name: attribute?.name })}
        onTransitionExited={formMethods.reset}
        onClose={close}
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
                <Typography variant="overline">{t('limitAlert.title')}</Typography>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  gap={2}
                >
                  <Typography variant="caption">{t('limitAlert.totalLimit')}</Typography>
                  {dailyCallsTotal !== undefined ? (
                    <Typography variant="caption-semibold">
                      {t('limitAlert.label', { threshold: dailyCallsTotal })}
                    </Typography>
                  ) : (
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <WarningAmber color="warning" />
                      <Typography variant="caption-semibold">{t('limitAlert.toInsert')}</Typography>
                    </Stack>
                  )}
                </Stack>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  gap={2}
                >
                  <Typography variant="caption">{t('limitAlert.consumerLimit')}</Typography>
                  {dailyCallsPerConsumer !== undefined ? (
                    <Typography variant="caption-semibold">
                      {t('limitAlert.label', { threshold: dailyCallsPerConsumer })}
                    </Typography>
                  ) : (
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <WarningAmber color="warning" />
                      <Typography variant="caption-semibold">{t('limitAlert.toInsert')}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Alert>
          </Stack>
          <Stack spacing={5}>
            <Alert severity="info">{t('alert')}</Alert>
            <Button
              type={'submit'}
              form="threshold-form"
              variant="contained"
              color={isEmpty(formMethods.formState.errors) ? 'primary' : 'error'}
            >
              {t('submitBtnLabel')}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

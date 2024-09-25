import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateThresholdsFormValues = {
  voucherLifespan: number
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
}

type ProviderEServiceUpdateThresholdsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceUpdateThresholdsDrawer: React.FC<
  ProviderEServiceUpdateThresholdsDrawerProps
> = ({ isOpen, onClose, descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.updateThresholdsDrawer' })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateVersion } = EServiceMutations.useUpdateVersion()

  const defaultValues = {
    voucherLifespan: descriptor.voucherLifespan ? secondsToMinutes(descriptor.voucherLifespan) : 1,
    dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer ?? 1,
    dailyCallsTotal: descriptor.dailyCallsTotal ?? 1,
  }

  const formMethods = useForm<UpdateThresholdsFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      voucherLifespan: descriptor.voucherLifespan
        ? secondsToMinutes(descriptor.voucherLifespan)
        : 1,
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer ?? 1,
      dailyCallsTotal: descriptor.dailyCallsTotal ?? 1,
    })
  }, [descriptor, formMethods])

  const onSubmit = (values: UpdateThresholdsFormValues) => {
    updateVersion(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        voucherLifespan: minutesToSeconds(values.voucherLifespan),
        dailyCallsPerConsumer: values.dailyCallsPerConsumer,
        dailyCallsTotal: values.dailyCallsTotal,
      },
      { onSuccess: onClose }
    )
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          label: tCommon('actions.upgrade'),
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Stack spacing={4}>
          <Box component="form" noValidate>
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              focusOnMount
              name="voucherLifespan"
              label={t('voucherLifespanField.label')}
              infoLabel={t('voucherLifespanField.infoLabel')}
              type="number"
              rules={{
                required: true,
                min: 1,
              }}
            />
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              name="dailyCallsPerConsumer"
              label={t('dailyCallsPerConsumerField.label')}
              infoLabel={t('dailyCallsPerConsumerField.infoLabel')}
              type="number"
              rules={{
                required: true,
                min: 1,
              }}
            />
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              name="dailyCallsTotal"
              label={t('dailyCallsTotalField.label')}
              infoLabel={t('dailyCallsTotalField.infoLabel')}
              type="number"
              rules={{
                required: true,
                min: 1,
              }}
            />
          </Box>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

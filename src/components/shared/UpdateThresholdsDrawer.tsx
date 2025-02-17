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

type UpdateThresholdsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  descriptorId?: string
  subtitle?: string
  dailyCallsPerConsumerLabel?: string
  dailyCallsTotalLabel?: string
  voucherLifespan: number
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  versionId?: string
  onSubmit: (
    id: string,
    voucherLifespan: number,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    descriptorId?: string,
    versionId?: string
  ) => void
}

export const UpdateThresholdsDrawer: React.FC<UpdateThresholdsDrawerProps> = ({
  isOpen,
  onClose,
  id,
  descriptorId,
  subtitle,
  dailyCallsPerConsumerLabel,
  dailyCallsTotalLabel,
  voucherLifespan,
  dailyCallsPerConsumer,
  dailyCallsTotal,
  versionId,
  onSubmit,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.updateThresholdsDrawer' })
  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    voucherLifespan: voucherLifespan ? secondsToMinutes(voucherLifespan) : 1,
    dailyCallsPerConsumer: dailyCallsPerConsumer ?? 1,
    dailyCallsTotal: dailyCallsTotal ?? 1,
  }

  const formMethods = useForm<UpdateThresholdsFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      voucherLifespan: voucherLifespan ? secondsToMinutes(voucherLifespan) : 1,
      dailyCallsPerConsumer: dailyCallsPerConsumer ?? 1,
      dailyCallsTotal: dailyCallsTotal ?? 1,
    })
  }, [descriptorId, versionId, id, formMethods])

  const handleSubmit = (values: UpdateThresholdsFormValues) => {
    if (descriptorId) {
      onSubmit(
        id,
        minutesToSeconds(values.voucherLifespan),
        values.dailyCallsPerConsumer,
        values.dailyCallsTotal,
        descriptorId
      )
    }
    if (versionId) {
      //TODO
      onSubmit(
        id,
        minutesToSeconds(values.voucherLifespan),
        values.dailyCallsPerConsumer,
        values.dailyCallsTotal,
        versionId
      )
    } else {
      onSubmit(
        id,
        minutesToSeconds(values.voucherLifespan),
        values.dailyCallsPerConsumer,
        values.dailyCallsTotal
      )
    }
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
        subtitle={subtitle || t('subtitle')}
        buttonAction={{
          label: tCommon('actions.upgrade'),
          action: formMethods.handleSubmit(handleSubmit),
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
              label={dailyCallsPerConsumerLabel || t('dailyCallsPerConsumerField.label')}
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
              label={dailyCallsTotalLabel || t('dailyCallsTotalField.label')}
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

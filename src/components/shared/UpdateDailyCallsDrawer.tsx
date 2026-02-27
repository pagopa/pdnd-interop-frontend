import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type UpdateDailyCallsFormValues = {
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
}

type UpdateDailyCallsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  subtitle: string
  dailyCallsPerConsumerLabel: string
  dailyCallsTotalLabel: string
  dailyCallsPerConsumer: number | undefined
  dailyCallsTotal: number | undefined
  /** @description  This field is used to represent the version of specific item: it could be for an EService (descriptorId) or
   *  for a EServiceTemplate (TemplateVersionId) */
  versionId?: string
  onSubmit: (
    id: string,
    dailyCallsPerConsumer: number,
    dailyCallsTotal: number,
    versionId?: string
  ) => void
}

export const UpdateDailyCallsDrawer: React.FC<UpdateDailyCallsDrawerProps> = ({
  isOpen,
  onClose,
  id,
  subtitle,
  dailyCallsPerConsumerLabel,
  dailyCallsTotalLabel,
  dailyCallsPerConsumer,
  dailyCallsTotal,
  versionId,
  onSubmit,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDailyCallsDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    dailyCallsPerConsumer: dailyCallsPerConsumer ?? 1,
    dailyCallsTotal: dailyCallsTotal ?? 1,
  }

  const formMethods = useForm<UpdateDailyCallsFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      dailyCallsPerConsumer: dailyCallsPerConsumer ?? 1,
      dailyCallsTotal: dailyCallsTotal ?? 1,
    })
  }, [versionId, id, formMethods, dailyCallsPerConsumer, dailyCallsTotal])

  const handleSubmit = (values: UpdateDailyCallsFormValues) => {
    if (versionId) {
      onSubmit(id, values.dailyCallsPerConsumer, values.dailyCallsTotal, versionId)
    } else {
      onSubmit(id, values.dailyCallsPerConsumer, values.dailyCallsTotal)
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
        subtitle={subtitle}
        buttonAction={{
          label: tCommon('actions.saveEdits'),
          action: formMethods.handleSubmit(handleSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Typography variant="body2">
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {t('summary', {
              dailyCallsPerConsumer,
              dailyCallsTotal,
            })}
          </Trans>
        </Typography>
        <Stack spacing={4}>
          <Box component="form" noValidate>
            <RHFTextField
              sx={{ mt: 4, mb: 0 }}
              name="dailyCallsPerConsumer"
              label={dailyCallsPerConsumerLabel}
              infoLabel={t('dailyCallsPerConsumerField.infoLabel')}
              type="number"
              rules={{
                required: true,
                min: 1,
              }}
            />
            <RHFTextField
              sx={{ mt: 5, mb: 0 }}
              name="dailyCallsTotal"
              label={dailyCallsTotalLabel}
              infoLabel={t('dailyCallsTotalField.infoLabel')}
              type="number"
              rules={{
                required: true,
                validate: (value) => {
                  const minValue = formMethods.getValues('dailyCallsPerConsumer') + 1
                  return value >= minValue || t('dailyCallsTotalField.validation.min')
                },
              }}
            />
          </Box>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

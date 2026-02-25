import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, Stack, Typography } from '@mui/material'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type UpdateVoucherFormValues = {
  voucherLifespan: number
}

type UpdateVoucherDrawerProps = {
  isEserviceFromTemplate?: boolean
  isOpen: boolean
  onClose: VoidFunction
  id: string
  subtitle: string
  voucherLifespan: number
  /** @description  This field is used to represent the version of specific item: it could be for an EService (descriptorId) or
   *  for a EServiceTemplate (TemplateVersionId) */
  versionId?: string
  onSubmit: (id: string, voucherLifespan: number, versionId?: string) => void
}

export const UpdateVoucherDrawer: React.FC<UpdateVoucherDrawerProps> = ({
  isOpen,
  onClose,
  id,
  subtitle,
  voucherLifespan,
  versionId,
  onSubmit,
  isEserviceFromTemplate,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateVoucherDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const defaultValues = {
    voucherLifespan: voucherLifespan ? secondsToMinutes(voucherLifespan) : 1,
  }

  const formMethods = useForm<UpdateVoucherFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      voucherLifespan: voucherLifespan ? secondsToMinutes(voucherLifespan) : 1,
    })
  }, [versionId, id, formMethods, voucherLifespan])

  const handleSubmit = (values: UpdateVoucherFormValues) => {
    if (versionId) {
      onSubmit(id, minutesToSeconds(values.voucherLifespan), versionId)
    } else {
      onSubmit(id, minutesToSeconds(values.voucherLifespan))
    }
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  const minutes = secondsToMinutes(voucherLifespan)

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
            {minutes === 1
              ? t('summary', {
                  voucherLifespan: secondsToMinutes(voucherLifespan),
                })
              : t('summary_plural', {
                  voucherLifespan: secondsToMinutes(voucherLifespan),
                })}
          </Trans>
        </Typography>
        <Stack spacing={4}>
          <Box component="form" noValidate>
            <RHFTextField
              sx={{ mt: 4, mb: 0 }}
              focusOnMount
              name="voucherLifespan"
              label={t('voucherLifespanField.label')}
              infoLabel={t('voucherLifespanField.infoLabel')}
              type="number"
              rules={{
                required: true,
                min: 1,
                ...(voucherLifespan !== undefined && {
                  max: {
                    value: 1440,
                    message: t('voucherLifespanField.error'),
                  },
                }),
              }}
              disabled={isEserviceFromTemplate}
            />
          </Box>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

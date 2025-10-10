import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDialog } from '@/stores'
import type { DialogTenantKindPurposeTemplateProps } from '@/types/dialog.types'
import { RHFAutocompleteSingle, RHFRadioGroup } from '../shared/react-hook-form-inputs'
import { FormProvider, useForm } from 'react-hook-form'
import type { PurposeTemplateSeed, TenantKind } from '@/api/api.generatedTypes'

export const DialogTenantKindPurposeTemplate: React.FC<DialogTenantKindPurposeTemplateProps> = ({
  onConfirm,
}) => {
  const ariaLabelId = React.useId()

  const { closeDialog } = useDialog()
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogPurposeTemplatesTenantKind',
  })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const handleCancel = () => {
    closeDialog()
  }

  const formMethods = useForm<{ tenantKind: TenantKind }>({
    defaultValues: {
      tenantKind: 'PA',
    },
  })

  const onSubmit = formMethods.handleSubmit(({ tenantKind }) => {
    const params: PurposeTemplateSeed = {
      targetDescription: '',
      targetTenantKind: tenantKind,
      purposeTitle: '',
      purposeDescription: '',
      purposeIsFreeOfCharge: true,
    }
    onConfirm(params)
    closeDialog()
  })

  const options: Array<{ label: string; value: TenantKind }> = [
    {
      label: t('content.options.labelPA'),
      value: 'PA',
    },
    {
      label: t('content.options.labelNotPA'),
      value: 'PRIVATE',
    },
  ]

  const optionsPersonalData: Array<{ label: string; value: string }> = [
    {
      label: t('content.personalDataRadioBtn.options.true'),
      value: 'true',
    },
    {
      label: t('content.personalDataRadioBtn.options.false'),
      value: 'false',
    },
  ]

  return (
    <Dialog
      open
      onClose={handleCancel}
      aria-labelledby={ariaLabelId}
      maxWidth={'md'}
      fullWidth
      data-testid="create-purpose-modal"
    >
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body1">{t('content.description')}</Typography>
              <RHFAutocompleteSingle
                sx={{ my: 0 }}
                name="tenantKind"
                options={options}
                label={t('content.label')}
                rules={{ required: true }}
              />
              <RHFRadioGroup
                name="personalData"
                options={optionsPersonalData}
                label={t('content.personalDataRadioBtn.label')}
                rules={{ required: true }}
                row
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="outlined" onClick={handleCancel}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {tCommon('confirm')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}

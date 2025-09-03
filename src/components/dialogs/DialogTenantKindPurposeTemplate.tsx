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
import { RHFAutocompleteSingle } from '../shared/react-hook-form-inputs'
import { FormProvider, useForm } from 'react-hook-form'
import type { TenantKind } from '@/api/api.generatedTypes'

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
    onConfirm(tenantKind)
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

  return (
    <Dialog open onClose={handleCancel} aria-labelledby={ariaLabelId} maxWidth={'md'} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body1">{t('content.description')}</Typography>
              <RHFAutocompleteSingle
                sx={{ my: 0 }}
                name="tenantKind"
                options={options}
                label={t('content.label')}
                rules={{ required: true }}
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

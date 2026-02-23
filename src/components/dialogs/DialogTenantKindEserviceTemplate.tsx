import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDialog } from '@/stores'
import type { DialogTenantKindEserviceTemplateProps } from '@/types/dialog.types'
import { RHFRadioGroup } from '../shared/react-hook-form-inputs'
import { FormProvider, useForm } from 'react-hook-form'
import type { TenantKind } from '@/api/api.generatedTypes'

export const DialogTenantKindEserviceTemplate: React.FC<DialogTenantKindEserviceTemplateProps> = ({
  onConfirm,
}) => {
  const ariaLabelId = React.useId()

  const { closeDialog } = useDialog()
  const { t: tTemplate } = useTranslation('eserviceTemplate', {
    keyPrefix: 'create.step2.tenantKindDialog',
  })
  const { t } = useTranslation('shared-components', { keyPrefix: 'create.stepPurpose' })
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
      label: t('riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelPA'),
      value: 'PA',
    },
    {
      label: t(
        'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelNotPA'
      ),
      value: 'PRIVATE',
    },
  ]

  return (
    <Dialog open onClose={handleCancel} aria-labelledby={ariaLabelId} maxWidth={false}>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <DialogTitle id={ariaLabelId}>{tTemplate('title')}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{tTemplate('description')}</Typography>
          </DialogContent>
          <RHFRadioGroup
            name="tenantKind"
            options={options}
            rules={{ required: true }}
            sx={{ mb: 3, mt: 1 }}
          />
          <DialogActions>
            <Button type="button" variant="outlined" onClick={handleCancel}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {tCommon('select')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}

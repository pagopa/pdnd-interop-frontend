import React from 'react'
import {
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

export const DialogTenantKindEserviceTemplate: React.FC<DialogTenantKindEserviceTemplateProps> = ({
  onConfirm,
}) => {
  const ariaLabelId = React.useId()

  const { closeDialog } = useDialog()
  const { t: tTemplate } = useTranslation('template', {
    keyPrefix: 'create.step2.tenantKindDialog',
  })
  const { t } = useTranslation('shared-components', { keyPrefix: 'create.stepPurpose' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const [tenantKind, setTenantKind] = React.useState('PA')

  const handleCancel = () => {
    closeDialog()
  }

  const handleConfirm = () => {
    onConfirm(tenantKind)
    closeDialog()
  }

  const methods = useForm()

  return (
    <Dialog open onClose={handleCancel} aria-labelledby={ariaLabelId} maxWidth={false}>
      <DialogTitle id={ariaLabelId}>{tTemplate('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{tTemplate('description')}</Typography>
      </DialogContent>
      <FormProvider {...methods}>
        <RHFRadioGroup
          name="tenantKind"
          options={[
            {
              label: t(
                'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelPA'
              ),
              value: 'PA',
            },
            {
              label: t(
                'riskAnalysis.riskAnalysisSection.eserviceTemplateRiskAnalysis.tenantKind.labelNotPA'
              ),
              value: 'PRIVATE',
            },
          ]}
          rules={{ required: true }}
          sx={{ mb: 3, mt: 1 }}
          defaultValue={'PA'}
          value={tenantKind}
          onValueChange={(value) => setTenantKind(value)}
        />
      </FormProvider>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          {tCommon('select')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

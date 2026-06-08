import { PurposeMutations } from '@/api/purpose'
import { useNavigate } from '@/router'
import { useDialog } from '@/stores'
import type { DialogRejectRiskAnalysisProps } from '@/types/dialog.types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RequiredTextLabel } from '../shared/RequiredTextLabel'
import { FormProvider, useForm } from 'react-hook-form'
import type { RiskAnalysisRejectionSeed } from '@/api/api.generatedTypes'
import { RHFTextField } from '../shared/react-hook-form-inputs'

export const DialogRejectRiskAnalysis: React.FC<DialogRejectRiskAnalysisProps> = ({
  purposeId,
}) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogRejectRiskAnalysis',
  })
  const { closeDialog } = useDialog()
  const navigate = useNavigate()
  const { mutate: rejectRiskAnalysis, isPending } = PurposeMutations.useRejectRiskAnalysis()

  const formMethods = useForm<RiskAnalysisRejectionSeed>({
    defaultValues: { rejectionReason: '' },
  })

  const handleCloseDialog = () => {
    if (!isPending) {
      closeDialog()
    }
  }

  const onSubmit = ({ rejectionReason }: RiskAnalysisRejectionSeed) => {
    rejectRiskAnalysis(
      { purposeId, rejectionReason },
      {
        onSuccess() {
          navigate('SUBSCRIBE_RISK_ANALYSIS_REJECTION_SUCCESS', {
            params: { purposeId },
          })
          handleCloseDialog()
        },
      }
    )
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={handleCloseDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId} sx={{ pb: 1 }}>
            {t('title')}
          </DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 4, mt: 1 }}>
              {t('description')}
            </Typography>
            <RequiredTextLabel />
            <RHFTextField
              name="rejectionReason"
              label={t('reasonField.label')}
              infoLabel={t('reasonField.infoLabel')}
              focusOnMount
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          </DialogContent>

          <DialogActions>
            <Button
              type="button"
              variant="outlined"
              onClick={handleCloseDialog}
              disabled={isPending}
            >
              {t('actions.cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={isPending}>
              {t('actions.confirm')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}

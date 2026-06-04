import { PurposeMutations } from '@/api/purpose'
import { useNavigate } from '@/router'
import { useDialog } from '@/stores'
import type { DialogApproveRiskAnalysisProps } from '@/types/dialog.types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const DialogApproveRiskAnalysis: React.FC<DialogApproveRiskAnalysisProps> = ({
  purposeId,
}) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogApproveRiskAnalysis',
  })
  const { closeDialog } = useDialog()
  const navigate = useNavigate()
  const { mutate: signRiskAnalysis, isPending } = PurposeMutations.useSignRiskAnalysis()

  const handleCloseDialog = () => {
    if (!isPending) {
      closeDialog()
    }
  }

  const onProceed = () => {
    signRiskAnalysis(
      { purposeId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_RISK_ANALYSIS_APPROVAL_SUCCESS', {
            params: { purposeId },
          })
          handleCloseDialog()
        },
      }
    )
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={handleCloseDialog} fullWidth>
      <DialogTitle id={ariaLabelId} sx={{ pb: 1 }}>
        {t('title')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {t('description')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button type="button" variant="outlined" onClick={handleCloseDialog} disabled={isPending}>
          {t('actions.cancel')}
        </Button>
        <Button variant="contained" onClick={onProceed} disabled={isPending}>
          {t('actions.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

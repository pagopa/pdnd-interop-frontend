import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { useDialog } from '@/stores'
import type { DialogRequestPurposeApprovalProps } from '@/types/dialog.types'

export const DialogRequestPurposeApproval: React.FC<DialogRequestPurposeApprovalProps> = ({
  reviewer,
  onConfirm,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  const { closeDialog } = useDialog()
  const { t } = useTranslation('purpose', {
    keyPrefix: 'edit.stepRiskAnalysis.requestApprovalDialog',
  })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const reviewerName = `${reviewer.name} ${reviewer.familyName}`.trim()

  const handleConfirm = () => {
    onConfirm()
    closeDialog()
  }

  return (
    <Dialog
      open
      onClose={closeDialog}
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent>
        <Typography id={ariaDescriptionId} variant="body2">
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {t('description', { reviewerName })}
          </Trans>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          {t('proceedLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

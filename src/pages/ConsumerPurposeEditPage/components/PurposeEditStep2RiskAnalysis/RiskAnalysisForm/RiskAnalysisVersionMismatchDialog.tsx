import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type RiskAnalysisVersionMismatchDialogProps = {
  onProceed: VoidFunction
  onRefuse: VoidFunction
}

export const RiskAnalysisVersionMismatchDialog: React.FC<
  RiskAnalysisVersionMismatchDialogProps
> = ({ onProceed, onRefuse }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit.step2.versionMismatchDialog' })
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  return (
    <Dialog open aria-labelledby={ariaLabelId} aria-describedby={ariaDescriptionId}>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent aria-describedby={ariaDescriptionId}>{t('description')}</DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onRefuse}>
          {t('cancelButtonLabel')}
        </Button>
        <Button variant="contained" onClick={onProceed}>
          {t('proceedButtonLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

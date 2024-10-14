import { SELFCARE_BASE_URL } from '@/config/env'
import { useDialog } from '@/stores'
import type { DialogDeleteOperatorProps } from '@/types/dialog.types'
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

export const DialogDeleteOperator: React.FC<DialogDeleteOperatorProps> = ({
  selfcareId,
  userId,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogDeleteOperator' })

  const selfcareUserPageUrl = `${SELFCARE_BASE_URL}/dashboard/${selfcareId}/users/${userId}`

  const handleCancel = () => {
    closeDialog()
  }

  const handleProceed = () => {
    window.location.assign(selfcareUserPageUrl)
    closeDialog()
  }

  return (
    <Dialog
      open
      onClose={handleCancel}
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent id={ariaDescriptionId}>
        <Typography variant="body1">{t('description')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" onClick={handleProceed}>
          {tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

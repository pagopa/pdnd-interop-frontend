import React from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import type { DialogBasicProps } from '@/types/dialog.types'
import { useDialog } from '@/stores'

export const DialogBasic: React.FC<DialogBasicProps> = ({
  title = 'Conferma azione',
  description,
  onProceed,
  onCancel,
  proceedLabel,
  disabled = false,
  maxWidth,
  checkbox,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const handleCancel = () => {
    onCancel?.()
    closeDialog()
  }

  const handleProceed = () => {
    onProceed()
    closeDialog()
  }

  const [isCheckboxChecked, setIsCheckboxChecked] = React.useState<boolean>(false)

  const handleCheckBoxChange = () => {
    setIsCheckboxChecked((prev) => {
      return !prev
    })
  }

  return (
    <Dialog
      open
      onClose={handleCancel}
      aria-labelledby={ariaLabelId}
      {...(description ? { 'aria-describedby': ariaDescriptionId } : {})}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{title}</DialogTitle>

      {description && (
        <DialogContent id={ariaDescriptionId}>
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {description}
          </Trans>
        </DialogContent>
      )}
      {checkbox && (
        <FormControlLabel
          key={'confirmationCheckbox'}
          value={isCheckboxChecked}
          onChange={handleCheckBoxChange}
          control={<Checkbox />}
          label={checkbox}
          sx={{ mx: 1 }}
        />
      )}

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {tCommon('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleProceed}
          disabled={disabled || (!!checkbox && !isCheckboxChecked)}
        >
          {proceedLabel ?? tCommon('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

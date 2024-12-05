import { useDialog } from '@/stores'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type DialogDelegationsProps = {
  onConfirm: () => void
}

export const DialogDelegations: React.FC<DialogDelegationsProps> = ({ onConfirm }) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('party', {
    keyPrefix: 'delegations.create.dialog',
  })

  const { closeDialog } = useDialog()

  const [isCheckboxChecked, setIsCheckboxChecked] = React.useState<boolean>(false)

  const handleCheckBoxChange = () => {
    setIsCheckboxChecked((prev) => {
      return !prev
    })
  }

  const onSubmit = () => {
    onConfirm()
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="sm">
      <Box>
        <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

        <DialogContent>
          <Typography variant="body1">{t('description')}</Typography>
        </DialogContent>
        <FormControlLabel
          key={'confirmationCheckbox'}
          value={isCheckboxChecked}
          onChange={handleCheckBoxChange}
          control={<Checkbox />}
          label={t('checkboxLabel')}
          sx={{ mx: 1 }}
        />

        <DialogActions>
          <Button type="button" variant="outlined" onClick={closeDialog}>
            {t('cancelLabel')}
          </Button>
          <Button variant="contained" onClick={onSubmit} disabled={!isCheckboxChecked}>
            {t('proceedLabel')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

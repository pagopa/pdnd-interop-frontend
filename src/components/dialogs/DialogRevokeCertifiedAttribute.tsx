import { AttributeMutations } from '@/api/attribute'
import { useDialog } from '@/stores'
import type { DialogRevokeCertifiedAttributeProps } from '@/types/dialog.types'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const DialogRevokeCertifiedAttribute: React.FC<DialogRevokeCertifiedAttributeProps> = ({
  attribute,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogRevokeCertifiedAttribute' })

  const [isConfirmCheckboxChecked, setIsConfirmCheckboxChecked] = React.useState<boolean>(false)

  const { mutate: revokeCertifiedAttribute } = AttributeMutations.useRevokeCertifiedAttribute()

  const handleCheckBoxChange = () => {
    setIsConfirmCheckboxChecked((prev) => {
      return !prev
    })
  }

  const handleCancel = () => {
    closeDialog()
  }

  const handleRevoke = () => {
    revokeCertifiedAttribute(
      { tenantId: attribute.tenantId, attributeId: attribute.attributeId },
      { onSuccess: closeDialog }
    )
  }

  return (
    <Dialog
      open
      onClose={handleCancel}
      aria-labelledby={ariaLabelId}
      {...{ 'aria-describedby': ariaDescriptionId }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent aria-describedby={ariaDescriptionId}>
        <Stack spacing={3}>
          <Typography variant="body1">
            {t('content.description', {
              attributeName: attribute.attributeName,
              tenantName: attribute.tenantName,
            })}
          </Typography>
          <FormControlLabel
            key={'confirmationCheckbox'}
            value={isConfirmCheckboxChecked}
            onChange={handleCheckBoxChange}
            control={<Checkbox />}
            label={t('content.checkbox')}
            sx={{ mx: 1 }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" disabled={!isConfirmCheckboxChecked} onClick={handleRevoke}>
          {tCommon('revoke')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

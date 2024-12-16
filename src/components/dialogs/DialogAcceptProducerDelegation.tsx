import { DelegationMutations } from '@/api/delegation'
import { useDialog } from '@/stores'
import type { DialogAcceptProducerDelegationProps } from '@/types/dialog.types'
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

export const DialogAcceptProducerDelegation: React.FC<DialogAcceptProducerDelegationProps> = ({
  delegationId,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAcceptProducerDelegation',
  })

  const { closeDialog } = useDialog()
  const { mutate: acceptDelegation } = DelegationMutations.useApproveProducerDelegation()

  const [isConfirmCheckboxChecked, setIsConfirmCheckboxChecked] = React.useState<boolean>(false)

  const handleCheckBoxChange = () => {
    setIsConfirmCheckboxChecked((prev) => {
      return !prev
    })
  }

  const handleAccept = () => {
    acceptDelegation({ delegationId })
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {t('content.description')}
          </Typography>

          <FormControlLabel
            key={'confirmationCheckbox'}
            value={isConfirmCheckboxChecked}
            onChange={handleCheckBoxChange}
            control={<Checkbox />}
            label={t('content.confirmationLabel')}
            sx={{ mx: 1 }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button type="button" variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" disabled={!isConfirmCheckboxChecked} onClick={handleAccept}>
          {t('actions.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

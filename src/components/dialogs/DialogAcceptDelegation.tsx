import { DelegationMutations } from '@/api/delegation'
import { useDialog } from '@/stores'
import type { DialogAcceptDelegationProps } from '@/types/dialog.types'
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
import { match } from 'ts-pattern'

export const DialogAcceptDelegation: React.FC<DialogAcceptDelegationProps> = ({
  delegationId,
  delegationKind,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAcceptDelegation',
  })

  const { closeDialog } = useDialog()
  const { mutate: acceptProducerDelegation } = DelegationMutations.useApproveProducerDelegation()
  const { mutate: acceptConsumerDelegation } = DelegationMutations.useApproveConsumerDelegation()

  const acceptDelegation = match(delegationKind)
    .with('DELEGATED_PRODUCER', () => acceptProducerDelegation)
    .with('DELEGATED_CONSUMER', () => acceptConsumerDelegation)
    .exhaustive()

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

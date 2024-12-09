import { DelegationMutations } from '@/api/delegation'
import { useDialog } from '@/stores'
import type { DialogRevokeProducerDelegationProps } from '@/types/dialog.types'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const DialogRevokeProducerDelegation: React.FC<DialogRevokeProducerDelegationProps> = ({
  delegationId,
  eserviceName,
}) => {
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogRevokeProducerDelegation' })

  const [isConfirmCheckboxChecked, setIsConfirmCheckboxChecked] = React.useState<boolean>(false)

  const { mutate: revokeDelegation } = DelegationMutations.useRevokeProducerDelegation()

  const handleCheckBoxChange = () => {
    setIsConfirmCheckboxChecked((prev) => {
      return !prev
    })
  }

  const handleRevoke = () => {
    revokeDelegation({ delegationId })
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body2">
            <Trans
              components={{
                1: <Link underline="hover" href={'TODO right link'} target="_blank" />,
                strong: <Typography component="span" variant="inherit" fontWeight={600} />,
              }}
            >
              {t('content.description', {
                eserviceName: eserviceName,
              })}
            </Trans>
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
        <Button variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button variant="contained" disabled={!isConfirmCheckboxChecked} onClick={handleRevoke}>
          {tCommon('revoke')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

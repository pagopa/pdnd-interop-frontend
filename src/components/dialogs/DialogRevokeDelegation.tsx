import { DelegationMutations } from '@/api/delegation'
import { delegationGuideLink } from '@/config/constants'
import { useDialog } from '@/stores'
import type { DialogRevokeDelegationProps } from '@/types/dialog.types'
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
import { match } from 'ts-pattern'

export const DialogRevokeDelegation: React.FC<DialogRevokeDelegationProps> = ({
  delegationId,
  eserviceName,
  delegationKind,
}) => {
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: `dialogRevokeDelegation.${
      delegationKind === 'DELEGATED_PRODUCER' ? 'producer' : 'consumer'
    }`,
  })

  const [isConfirmCheckboxChecked, setIsConfirmCheckboxChecked] = React.useState<boolean>(false)

  const { mutate: revokeProducerDelegation } = DelegationMutations.useRevokeProducerDelegation()
  const { mutate: revokeConsumerDelegation } = DelegationMutations.useRevokeConsumerDelegation()

  const handleCheckBoxChange = () => {
    setIsConfirmCheckboxChecked((prev) => {
      return !prev
    })
  }

  const revokeDelegation = match(delegationKind)
    .with('DELEGATED_PRODUCER', () => revokeProducerDelegation)
    .with('DELEGATED_CONSUMER', () => revokeConsumerDelegation)
    .exhaustive()

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
                1: <Link underline="hover" href={delegationGuideLink} target="_blank" />,
                strong: <Typography variant="inherit" component="span" fontWeight={600} />,
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
          {t('actions.revoke')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

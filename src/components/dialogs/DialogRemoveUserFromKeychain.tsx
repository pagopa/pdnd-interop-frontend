import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { useNavigate } from '@/router'
import { useDialog } from '@/stores'
import type { DialogRemoveUserFromKeychainProps } from '@/types/dialog.types'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const DialogRemoveUserFromKeychain: React.FC<DialogRemoveUserFromKeychainProps> = ({
  keychainId,
  userId,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const navigate = useNavigate()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogRemoveUserFromKeychain' })
  const { mutate: removeUserFromKeychain } = KeychainMutations.useRemoveUserFromProducerKeychain()

  const handleCancel = () => {
    closeDialog()
  }

  const handleProceed = () => {
    removeUserFromKeychain(
      { producerKeychainId: keychainId, userId },
      {
        onSuccess: () =>
          navigate('PROVIDE_KEYCHAIN_DETAILS', {
            params: { keychainId },
            urlParams: { tab: 'members' },
          }),
      }
    )
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
        <Trans
          components={{
            1: <Link underline="hover" href={'TODO'} target="_blank" />,
          }}
        >
          {t('description')}
        </Trans>
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

import { ClientMutations } from '@/api/client'
import { clientKeyGuideLink } from '@/config/constants'
import { useDialog } from '@/stores'
import type { DialogRemoveOperatorFromClientProps } from '@/types/dialog.types'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const DialogRemoveOperatorFromClient: React.FC<DialogRemoveOperatorFromClientProps> = ({
  clientId,
  userId,
}) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()
  const { closeDialog } = useDialog()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', { keyPrefix: 'DialogRemoveOperatorFromClient' })
  const { mutate: removeOperatorFromClient } = ClientMutations.useRemoveOperator()

  const handleCancel = () => {
    closeDialog()
  }

  const handleProceed = () => {
    removeOperatorFromClient({ clientId, userId })
    closeDialog()
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
        <Trans
          components={{
            1: <Link underline="hover" href={clientKeyGuideLink} target="_blank" />,
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

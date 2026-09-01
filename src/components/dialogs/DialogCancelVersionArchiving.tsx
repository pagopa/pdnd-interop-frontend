import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogCancelVersionArchivingProps } from '@/types/dialog.types'
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
import { useIsActionDisabledBySupport } from '@/hooks/useIsActionDisabledBySupport'

export const DialogCancelVersionArchiving: React.FC<DialogCancelVersionArchivingProps> = ({
  eserviceId,
  descriptorId,
}) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCancelVersionArchiving',
  })

  const { closeDialog } = useDialog()
  const { mutate: cancelArchive } = EServiceMutations.useCancelDescriptorArchiving()
  const isConfirmDisabled = useIsActionDisabledBySupport()

  const handleKeepArchive = () => {
    closeDialog()
  }

  const handleCancelArchive = () => {
    cancelArchive({ eserviceId, descriptorId }, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('description')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleKeepArchive}>
          {t('actions.keepArchiving')}
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={isConfirmDisabled}
          onClick={handleCancelArchive}
          sx={{ color: 'common.white' }}
        >
          {t('actions.cancelArchiving')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

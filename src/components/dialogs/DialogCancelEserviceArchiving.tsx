import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogCancelEserviceArchivingProps } from '@/types/dialog.types'
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

const DialogCancelEserviceArchiving: React.FC<DialogCancelEserviceArchivingProps> = ({
  eserviceId,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCancelEserviceArchiving',
  })

  const { closeDialog } = useDialog()
  const { mutate: cancelArchive } = EServiceMutations.useCancelEserviceArchiving()

  const handleKeepArchive = () => {
    closeDialog()
  }

  const handleCancelArchive = () => {
    cancelArchive({ eserviceId }, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('description')}</Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleKeepArchive}>
          {tCommon('cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancelArchive}
          sx={{ color: 'common.white' }}
        >
          {t('actions.cancelArchiving')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCancelEserviceArchiving

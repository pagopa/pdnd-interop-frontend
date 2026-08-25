import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogCancelEserviceArchivingProps } from '@/types/dialog.types'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { Alert } from '@mui/material'
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
  isDelegate,
  delegatorName,
  archivingApproved,
  archivingDate,
}) => {
  const ariaLabelId = React.useId()

  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCancelEserviceArchiving',
  })

  const { closeDialog } = useDialog()
  const { mutate: cancelArchive } = EServiceMutations.useCancelEserviceArchiving()
  const { mutate: cancelArchiveRequest } = EServiceMutations.useCancelDelegatedArchivingRequest()

  const handleKeepArchive = () => {
    closeDialog()
  }

  const handleCancelArchive = () => {
    cancelArchive({ eserviceId }, { onSuccess: closeDialog })
  }

  const handleCancelArchiveRequest = () => {
    cancelArchiveRequest({ eserviceId }, { onSuccess: closeDialog })
  }

  const isApprovedDelegateArchiving = Boolean(isDelegate && archivingApproved)
  const isPendingDelegateArchiving = Boolean(isDelegate && !archivingApproved)
  const formattedArchivingDate = archivingDate ? formatDateStringNumeric(archivingDate) : '-'

  const titleKey = isApprovedDelegateArchiving
    ? 'titleDelegateApproved'
    : isDelegate
      ? 'titleDelegate'
      : 'title'

  const descriptionKey = isApprovedDelegateArchiving
    ? 'descriptionDelegateApproved'
    : isDelegate
      ? 'descriptionDelegate'
      : 'description'

  const cancelArchivingKey = isApprovedDelegateArchiving
    ? 'actions.closeApproved'
    : isDelegate
      ? 'actions.cancelArchivingDelegate'
      : 'actions.cancelArchiving'

  const keepArchivingLabel = isApprovedDelegateArchiving
    ? t('actions.cancelApproved')
    : isDelegate
      ? t('actions.keepArchivingDelegate')
      : tCommon('cancel')

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle id={ariaLabelId}>{t(titleKey)}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {t(descriptionKey, { name: delegatorName, date: formattedArchivingDate })}
        </Typography>

        {isPendingDelegateArchiving && (
          <Alert severity="info" sx={{ mt: 4 }}>
            {t('alertDelegate')}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleKeepArchive}>
          {keepArchivingLabel}
        </Button>
        <Button
          variant="contained"
          color={isDelegate ? 'primary' : 'error'}
          onClick={
            isApprovedDelegateArchiving
              ? closeDialog
              : isDelegate
                ? handleCancelArchiveRequest
                : handleCancelArchive
          }
          sx={{ color: 'common.white' }}
        >
          {t(cancelArchivingKey)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCancelEserviceArchiving

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Link,
  Alert,
  Button,
} from '@mui/material'
import { useDialog } from '@/stores'
import { useTranslation, Trans } from 'react-i18next'
import { EServiceMutations } from '@/api/eservice'
import { calculateArchivableOn } from '@/utils/eservice.utils'
import { formatDateStringNumeric } from '@/utils/format.utils'
import type { DialogDelegatorConfirmArchivingProps } from '@/types/dialog.types'

const DialogDelegatorConfirmArchiving: React.FC<DialogDelegatorConfirmArchivingProps> = ({
  eserviceId,
  descriptorId,
  delegatedName,
  gracePeriodDays,
}) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })

  const { closeDialog } = useDialog()
  const { mutate: approveEServiceRequest } =
    EServiceMutations.useApproveDelegatedArchivingEServiceRequest({ days: gracePeriodDays })

  const { mutate: approveVersionRequest } =
    EServiceMutations.useApproveDelegatedArchivingVersionRequest({ days: gracePeriodDays })
  const archivingDate = formatDateStringNumeric(calculateArchivableOn(new Date(), gracePeriodDays))

  const handleApprove = () => {
    if (descriptorId) {
      approveVersionRequest({ eserviceId, descriptorId }, { onSuccess: closeDialog })
    } else {
      approveEServiceRequest({ eserviceId }, { onSuccess: closeDialog })
    }
  }

  const title = descriptorId
    ? t('dialogConfirmArchivingDelegated.version.title')
    : t('dialogConfirmArchivingDelegated.eservice.title')

  const firstParagraph = descriptorId
    ? t('dialogConfirmArchivingDelegated.version.firstParagraph', { entity: delegatedName })
    : t('dialogConfirmArchivingDelegated.eservice.firstParagraph', {
        entity: delegatedName,
      })

  const secondParagraph = descriptorId
    ? t('dialogConfirmArchivingDelegated.version.secondParagraph', {
        date: archivingDate,
      })
    : t('dialogConfirmArchivingDelegated.eservice.secondParagraph', {
        date: archivingDate,
      })

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack gap={3}>
          <Typography>{firstParagraph}</Typography>
          <Typography>{secondParagraph}</Typography>
          <Alert severity="info">
            <Trans
              components={{
                // TODO: Add documentation link
                1: <Link href={''} target="_blank" />,
              }}
            >
              {t('dialogConfirmArchivingDelegated.alert')}
            </Trans>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={closeDialog}>
          {t('dialogConfirmArchivingDelegated.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{
            color: 'common.white',
          }}
          onClick={handleApprove}
        >
          {' '}
          {t('dialogConfirmArchivingDelegated.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogDelegatorConfirmArchiving

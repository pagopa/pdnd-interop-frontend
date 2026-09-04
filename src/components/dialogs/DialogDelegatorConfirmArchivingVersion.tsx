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
import type { DialogDelegatorConfirmArchivingVersionProps } from '@/types/dialog.types'
import { useTranslation, Trans } from 'react-i18next'
import { EServiceMutations } from '@/api/eservice'
import { calculateArchivableOn } from '@/utils/eservice.utils'
import { formatDateStringNumeric } from '@/utils/format.utils'

const DialogDelegatorConfirmArchivingVersion: React.FC<
  DialogDelegatorConfirmArchivingVersionProps
> = ({ eserviceId, descriptorId, delegatedName, gracePeriodDays }) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })

  const { closeDialog } = useDialog()
  const { mutate: approveVersionRequest } =
    EServiceMutations.useApproveDelegatedArchivingVersionRequest({ days: gracePeriodDays })

  const archivingDate = formatDateStringNumeric(calculateArchivableOn(new Date(), gracePeriodDays))

  const handleApprove = () => {
    approveVersionRequest({ eserviceId, descriptorId }, { onSuccess: closeDialog })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <DialogTitle>{t('dialogConfirmArchivingDelegated.version.title')}</DialogTitle>
      <DialogContent>
        <Stack gap={3}>
          <Typography>
            {t('dialogConfirmArchivingDelegated.version.firstParagraph', { entity: delegatedName })}
          </Typography>
          <Typography>
            {t('dialogConfirmArchivingDelegated.version.secondParagraph', {
              date: archivingDate,
            })}
          </Typography>
          <Alert severity="info">
            <Trans
              components={{
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

export default DialogDelegatorConfirmArchivingVersion

import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogSuspendArchivingDescriptorProps } from '@/types/dialog.types'

export const DialogSuspendArchivingDescriptor: React.FC<DialogSuspendArchivingDescriptorProps> = ({
  eserviceId,
  descriptorId,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.dialogSuspendArchivingDescriptor' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { closeDialog } = useDialog()
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  const { mutate: suspend } = EServiceMutations.useSuspendVersion({ skipConfirmation: true })

  const handleProceed = () => suspend({ eserviceId, descriptorId }, { onSuccess: closeDialog })

  return (
    <Dialog
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      open
      onClose={closeDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

      <DialogContent id={ariaDescriptionId}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {t('intro')}
        </Typography>
        <Box component="ul" sx={{ pl: 3, my: 0 }}>
          <li>{t('bullets.suspended')}</li>
          <li>
            <Trans
              t={t}
              i18nKey="bullets.archivingNotAffected"
              components={{
                strong: <Typography component="span" variant="inherit" fontWeight={600} />,
              }}
            />
          </li>
          <li>{t('bullets.archivedAfterNotice')}</li>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleProceed}
          sx={{ color: 'common.white' }}
        >
          {tCommon('suspend')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

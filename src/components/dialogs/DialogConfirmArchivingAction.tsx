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
import { useTranslation } from 'react-i18next'
import { useDialog } from '@/stores'

type DialogConfirmArchivingActionProps = {
  title: string
  intro: string
  primaryBulletText: string
  archivingNotAffectedBullet: React.ReactNode
  archivedAfterNoticeText: string
  confirmLabel: string
  confirmColor?: 'error' | 'primary'
  onConfirm: () => void
}

export const DialogConfirmArchivingAction: React.FC<DialogConfirmArchivingActionProps> = ({
  title,
  intro,
  primaryBulletText,
  archivingNotAffectedBullet,
  archivedAfterNoticeText,
  confirmLabel,
  confirmColor = 'primary',
  onConfirm,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { closeDialog } = useDialog()
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  return (
    <Dialog
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      open
      onClose={closeDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id={ariaLabelId}>{title}</DialogTitle>

      <DialogContent id={ariaDescriptionId}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {intro}
        </Typography>
        <Box component="ul" sx={{ pl: 3, my: 0 }}>
          <li>{primaryBulletText}</li>
          <li>{archivingNotAffectedBullet}</li>
          <li>{archivedAfterNoticeText}</li>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={closeDialog}>
          {tCommon('cancel')}
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          sx={confirmColor === 'error' ? { color: 'common.white' } : undefined}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

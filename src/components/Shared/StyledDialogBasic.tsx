import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogBasicProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './LoadingTranslations'

export const StyledDialogBasic: FunctionComponent<DialogBasicProps> = ({
  title = 'Conferma azione',
  description,
  proceedCallback,
  proceedLabel = 'Conferma',
  disabled = false,
  maxWidth,
}) => {
  const { t, ready } = useTranslation('shared-components', {
    keyPrefix: 'styledDialogBasic',
    useSuspense: false,
  })
  const { closeDialog } = useCloseDialog()

  if (!ready) {
    return <LoadingTranslations />
  }

  return (
    <Dialog
      open
      onClose={closeDialog}
      aria-describedby={t('ariaDescribedBy')}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      {description && <DialogContent>{description}</DialogContent>}

      <DialogActions>
        <StyledButton variant="outlined" onClick={closeDialog}>
          {t('actions.cancelLabel')}
        </StyledButton>
        <StyledButton variant="contained" onClick={proceedCallback} disabled={disabled}>
          {proceedLabel}
        </StyledButton>
      </DialogActions>
    </Dialog>
  )
}

import React, { FunctionComponent } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogAttributeDetailsProps, DialogBasicProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './LoadingTranslations'

export const StyledDialogAttributeDetails: FunctionComponent<DialogAttributeDetailsProps> = ({
  attribute,
}) => {
  const { closeDialog } = useCloseDialog()

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <DialogTitle>{attribute.name}</DialogTitle>

      <DialogContent>{attribute.description}</DialogContent>

      <DialogActions>
        <StyledButton variant="contained" onClick={closeDialog}>
          Close
        </StyledButton>
      </DialogActions>
    </Dialog>
  )
}

import { Dialog, DialogProps } from '@mui/material'
import React from 'react'
import DialogErrorBoundary from './DialogErrorBoundary'

export const DialogContainer: React.FC<DialogProps> = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogErrorBoundary>{children}</DialogErrorBoundary>
    </Dialog>
  )
}

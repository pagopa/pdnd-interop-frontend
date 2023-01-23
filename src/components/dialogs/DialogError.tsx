import useResolveError from '@/hooks/useResolveError'
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useDialog } from '@/contexts'

export const DialogError: React.FC<FallbackProps> = (fallbackProps) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  const { title, description, content } = useResolveError(fallbackProps)
  const { closeDialog } = useDialog()

  return (
    <Dialog
      aria-labelledby={ariaLabelId}
      aria-describedby={ariaDescriptionId}
      open
      onClose={closeDialog}
      fullWidth
    >
      <DialogTitle id={ariaLabelId}>{title}</DialogTitle>
      <DialogContent>
        <Typography id={ariaDescriptionId} sx={{ mb: 2 }}>
          {description}
        </Typography>
        {content}
      </DialogContent>
    </Dialog>
  )
}

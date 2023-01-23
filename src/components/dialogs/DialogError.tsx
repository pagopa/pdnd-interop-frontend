import useResolveError from '@/hooks/useResolveError'
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useDialog } from '@/contexts'

export const DialogError: React.FC<FallbackProps> = (fallbackProps) => {
  const { title, description, content } = useResolveError(fallbackProps)
  const { closeDialog } = useDialog()

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>{description}</Typography>
        {content}
      </DialogContent>
    </Dialog>
  )
}

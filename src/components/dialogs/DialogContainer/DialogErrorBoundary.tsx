import useResolveError from '@/hooks/useResolveError'
import { DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const DialogErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={DialogErrorComponent}>{children}</ErrorBoundary>
}

const DialogErrorComponent: React.FC<FallbackProps> = (fallbackProps) => {
  const { title, description, content } = useResolveError(fallbackProps)

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>{description}</Typography>
        {content}
      </DialogContent>
    </>
  )
}
export default DialogErrorBoundary

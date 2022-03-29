import { Backdrop } from '@mui/material'
import React from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'

type LoadingOverlayProps = {
  loadingText: string
}

export function LoadingOverlay({ loadingText }: LoadingOverlayProps) {
  return (
    <Backdrop open sx={{ zIndex: 1 }}>
      <LoadingWithMessage label={loadingText} />
    </Backdrop>
  )
}

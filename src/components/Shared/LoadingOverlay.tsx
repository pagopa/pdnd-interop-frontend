import { Backdrop } from '@mui/material'
import React from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'

type LoadingOverlayProps = {
  loadingText: string
}

export function LoadingOverlay({ loadingText }: LoadingOverlayProps) {
  return (
    <Backdrop open>
      <LoadingWithMessage label={loadingText} />
    </Backdrop>
  )
}

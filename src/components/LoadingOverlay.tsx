import React from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'
import { Overlay } from './Overlay'

type LoadingOverlayProps = {
  loadingText: string
}

export function LoadingOverlay({ loadingText }: LoadingOverlayProps) {
  return (
    <Overlay>
      <LoadingWithMessage label={loadingText} />
    </Overlay>
  )
}

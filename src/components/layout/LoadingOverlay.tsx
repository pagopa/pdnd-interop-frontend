import React from 'react'
import { useLoadingOverlayStore } from '@/stores'
import { Backdrop, Paper } from '@mui/material'
import { Spinner } from '@pagopa/interop-fe-commons'

const _LoadingOverlay: React.FC = () => {
  const isLoadingOverlayShown = useLoadingOverlayStore((state) => state.isShown)
  const loadingOverlayMessage = useLoadingOverlayStore((state) => state.message)

  if (!isLoadingOverlayShown) return null

  return (
    <Backdrop open sx={{ zIndex: 99999 }}>
      <Paper sx={{ p: 3 }}>
        <Spinner label={loadingOverlayMessage} />
      </Paper>
    </Backdrop>
  )
}
export const LoadingOverlay = React.memo(_LoadingOverlay)

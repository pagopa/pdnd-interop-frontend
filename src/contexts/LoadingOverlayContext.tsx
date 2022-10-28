import React from 'react'
import noop from 'lodash/noop'
import { createSafeContext } from './utils'
import { Backdrop, Paper } from '@mui/material'
import { Spinner } from '@/components/shared/Spinner'

type LoadingOverlayContextType = {
  showOverlay: (message: string) => void
  hideOverlay: () => void
}

const { useContext, Provider } = createSafeContext<LoadingOverlayContextType>(
  'LoadingOverlayContext',
  {
    showOverlay: noop,
    hideOverlay: noop,
  }
)

const _LoadingOverlay: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Backdrop open sx={{ zIndex: 999 }}>
      <Paper sx={{ p: 3 }}>
        <Spinner label={message} />
      </Paper>
    </Backdrop>
  )
}

const LoadingOverlay = React.memo(_LoadingOverlay)

const LoadingOverlayContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overlayState, setOverlayState] = React.useState({
    isShown: false,
    message: '',
  })

  const showOverlay = React.useCallback((message: string) => {
    setOverlayState({ isShown: true, message })
  }, [])

  const hideOverlay = React.useCallback(() => {
    setOverlayState((prev) => ({ ...prev, isShown: false }))
  }, [])

  const value = React.useMemo(() => ({ showOverlay, hideOverlay }), [showOverlay, hideOverlay])

  return (
    <Provider value={value}>
      {children}
      {overlayState.isShown && <LoadingOverlay message={overlayState.message} />}
    </Provider>
  )
}

export { useContext as useLoadingOverlay, LoadingOverlayContextProvider }

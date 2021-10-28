import React, { useEffect, useState } from 'react'
import { DialogProps, ToastContentWithOutcome, ToastProps } from '../../types'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { DialogContext, LoaderContext, ToastContext } from '../lib/context'
import { logAction } from '../lib/action-log'
import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'
import { StyledToast } from './Shared/StyledToast'
import { StyledDialog } from './Shared/StyledDialog'
import { LoadingOverlay } from './Shared/LoadingOverlay'
import { MainNav } from './MainNav'
import { Layout } from './Shared/Layout'
import { Box } from '@mui/system'
import { isInPlatform } from '../lib/router-utils'

export function BodyLogger() {
  const [toast, setToast] = useState<ToastProps | null>(null)
  const [dialog, setDialog] = useState<DialogProps | null>(null)
  const [loadingText, setLoadingText] = useState<string | null>(null)
  const location = useLocation()

  /*
   * Handle toast
   */
  useEffect(() => {
    // Avoid still showing the toast from last page
    if (toast) {
      setToast(null)
    }

    // If there is explicitly a new toast to show on this page, display it
    if (!isEmpty(location.state) && !isEmpty((location.state as any).toast)) {
      const toastContent = (location.state as any).toast as ToastContentWithOutcome
      setToast({
        ...toastContent,
        onClose: () => {
          setToast(null)
        },
      })
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * Handle data logging (now console.log, in the future might be Analytics)
   */
  useEffect(() => {
    logAction('Route change', location)
  }, [location])

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      <DialogContext.Provider value={{ dialog, setDialog }}>
        <LoaderContext.Provider value={{ loadingText, setLoadingText }}>
          <Header />
          <Layout>
            {isInPlatform(location) ? (
              <Box sx={{ display: 'flex' }}>
                <MainNav />
                <Box sx={{ py: '5rem', px: '2rem' }}>
                  <Main />
                </Box>
              </Box>
            ) : (
              <Box sx={{ py: '5rem', px: '2rem' }}>
                <Main />
              </Box>
            )}
          </Layout>
          <Footer />
          {toast && <StyledToast {...toast} />}
          {dialog && <StyledDialog {...dialog} />}
          {loadingText && <LoadingOverlay loadingText={loadingText} />}
        </LoaderContext.Provider>
      </DialogContext.Provider>
    </ToastContext.Provider>
  )
}

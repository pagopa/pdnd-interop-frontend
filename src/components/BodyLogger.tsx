import React, { useContext, useEffect, useState } from 'react'
import { DialogProps, ToastContentWithOutcome, ToastProps } from '../../types'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { DialogContext, LoaderContext, ToastContext, UserContext } from '../lib/context'
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
import { MEDIUM_MAX_WIDTH } from '../lib/constants'

export function BodyLogger() {
  const { user } = useContext(UserContext)
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
          {isInPlatform(location) ? (
            <Box sx={{ flexGrow: 1 }}>
              <Layout sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', height: '100%' }}>
                  {user && <MainNav />}
                  <Box sx={{ py: 10, pl: 4, flexGrow: 1 }}>
                    <Main />
                  </Box>
                </Box>
              </Layout>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  m: 'auto',
                  py: 10,
                  px: 4,
                  maxWidth: MEDIUM_MAX_WIDTH,
                  width: '100%',
                }}
              >
                <Layout>
                  <Main />
                </Layout>
              </Box>
            </Box>
          )}
          <Footer />
          {toast && <StyledToast {...toast} />}
          {dialog && <StyledDialog {...dialog} />}
          {loadingText && <LoadingOverlay loadingText={loadingText} />}
        </LoaderContext.Provider>
      </DialogContext.Provider>
    </ToastContext.Provider>
  )
}

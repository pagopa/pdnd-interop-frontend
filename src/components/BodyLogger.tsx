import React, { useEffect, useState } from 'react'
import { DialogProps, ToastContentWithOutcome, ToastProps } from '../../types'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { DialogContext, LoaderContext, ToastContext } from '../lib/context'
import { logAction } from '../lib/action-log'
import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'
import { StyledToast } from './StyledToast'
import { StyledDialog } from './StyledDialog'
import { LoadingOverlay } from './LoadingOverlay'

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
          <Main />
          <Footer />
          {toast && <StyledToast {...toast} />}
          {dialog && <StyledDialog {...dialog} />}
          {loadingText && <LoadingOverlay loadingText={loadingText} />}
        </LoaderContext.Provider>
      </DialogContext.Provider>
    </ToastContext.Provider>
  )
}

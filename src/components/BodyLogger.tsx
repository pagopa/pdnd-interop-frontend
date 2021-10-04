import React, { useEffect, useState } from 'react'
import { ToastContentWithOutcome, ToastProps } from '../../types'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { ToastContext } from '../lib/context'
import { logAction } from '../lib/action-log'
import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'
import { StyledToast } from './StyledToast'

export function BodyLogger() {
  const [toast, setToast] = useState<ToastProps | null>(null)
  const location = useLocation()

  /*
   * Handle toast
   */
  useEffect(() => {
    if (!isEmpty(location.state) && !isEmpty((location.state as any).toast)) {
      const toastContent = (location.state as any).toast as ToastContentWithOutcome
      setToast({
        ...toastContent,
        onClose: () => {
          setToast(null)
        },
      })
    }
  }, [location])

  /*
   * Handle data logging (now console.log, in the future might be Analytics)
   */
  useEffect(() => {
    logAction('Route change', 'Router', location)
  }, [location])

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      <Header />
      <Main />
      <Footer />
      {toast && <StyledToast {...toast} />}
    </ToastContext.Provider>
  )
}

import React, { FunctionComponent, useEffect, useState } from 'react'
import { DialogProps, ToastContentWithOutcome, ToastProps } from '../../types'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { DialogContext, LoaderContext, TableActionMenuContext, ToastContext } from '../lib/context'
import { logAction } from '../lib/action-log'
import { Main } from './Main'
import { StyledToast } from './Shared/StyledToast'
import { StyledDialog } from './Shared/StyledDialog'
import { LoadingOverlay } from './Shared/LoadingOverlay'
import { MainNav } from './MainNav'
import { useRoute } from '../hooks/useRoute'
import { useLogin } from '../hooks/useLogin'
import { HeaderWrapper } from './HeaderWrapper'
import { FooterWrapper } from './FooterWrapper'
import { Stack, Box } from '@mui/material'
import { useRebuildI18N } from '../hooks/useRebuildI18n'
import { useTOSAgreementLocalStorage } from '../hooks/useTOSAgreementLocalStorage'
import TOSAgreement from '../views/TOSAgreement'
import { LIGHT_GRAY } from '../lib/constants'

export const WhitePanel: FunctionComponent = ({ children }) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        flexGrow: 1,
        position: 'relative',
        '::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: 0,
          bgcolor: 'background.default',
          width: 10000,
          height: '100%',
          transform: 'translate(100%, 0)',
        },
      }}
      bgcolor={LIGHT_GRAY}
    >
      {children}
    </Box>
  )
}

export function BodyLogger() {
  const { doesRouteAllowTwoColumnsLayout } = useRoute()
  const location = useLocation()
  const { isRouteProtected } = useRoute()
  const { isTOSAccepted, acceptTOS } = useTOSAgreementLocalStorage()
  const [toast, setToast] = useState<ToastProps | null>(null)
  const [dialog, setDialog] = useState<DialogProps | null>(null)
  const [loadingText, setLoadingText] = useState<string | null>(null)
  const [tableActionMenu, setTableActionMenu] = useState<string | null>(null)
  useLogin()
  useRebuildI18N()

  /*
   * Handle toast
   */
  useEffect(() => {
    // Avoid still showing the toast from last page
    if (toast) {
      setToast(null)
    }

    const locationState: Record<string, unknown> = location.state as Record<string, unknown>

    // If there is explicitly a new toast to show on this page, display it
    if (!isEmpty(locationState) && !isEmpty(locationState.toast)) {
      const toastContent = locationState.toast as ToastContentWithOutcome
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

  /*
   * Makes sure that the scroll is on top when location changes
   */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isCurrentRouteProtected = isRouteProtected(location)

  return (
    <TableActionMenuContext.Provider value={{ tableActionMenu, setTableActionMenu }}>
      <ToastContext.Provider value={{ toast, setToast }}>
        <DialogContext.Provider value={{ dialog, setDialog }}>
          <LoaderContext.Provider value={{ loadingText, setLoadingText }}>
            <HeaderWrapper />

            {!isTOSAccepted && isCurrentRouteProtected ? (
              <TOSAgreement onAcceptAgreement={acceptTOS} />
            ) : doesRouteAllowTwoColumnsLayout(location) ? (
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" sx={{ height: '100%', overflowX: 'hidden' }}>
                  <MainNav />
                  <WhitePanel>
                    <Main />
                  </WhitePanel>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1 }}>
                <Main />
              </Box>
            )}

            <FooterWrapper />
            {toast && <StyledToast {...toast} />}
            {dialog && <StyledDialog {...dialog} />}
            {loadingText && <LoadingOverlay loadingText={loadingText} />}
          </LoaderContext.Provider>
        </DialogContext.Provider>
      </ToastContext.Provider>
    </TableActionMenuContext.Provider>
  )
}

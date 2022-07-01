import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { DialogProps, ToastContentWithOutcome, ToastProps } from '../../types'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import {
  DialogContext,
  LangContext,
  LoaderContext,
  TableActionMenuContext,
  ToastContext,
} from '../lib/context'
import { logAction } from '../lib/action-log'
import { Main } from './Main'
import { StyledToast } from './Shared/StyledToast'
import { StyledDialog } from './Shared/StyledDialog'
import { LoadingOverlay } from './Shared/LoadingOverlay'
import { MainNav } from './MainNav'
import { Box } from '@mui/system'
import { useRoute } from '../hooks/useRoute'
import { buildLocale } from '../lib/validation-config'
import { useLogin } from '../hooks/useLogin'
import { DEFAULT_LANG } from '../lib/constants'
import { useTranslation } from 'react-i18next'
import { HeaderWrapper } from './HeaderWrapper'
import { FooterWrapper } from './FooterWrapper'
import { Stack } from '@mui/material'

const RebuildI18N = () => {
  const { loginAttempt } = useLogin()
  const { lang } = useContext(LangContext)
  const { i18n, t, ready } = useTranslation('common', { useSuspense: false })
  const { setLoadingText } = useContext(LoaderContext)

  // Rebuild config if starting language is not the default one
  useEffect(() => {
    if (lang !== DEFAULT_LANG && ready) {
      i18n.changeLanguage(lang)
      buildLocale(t)
    }
  }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function asyncLoginAttempt() {
      setLoadingText(t('loading.sessionToken.label'))
      await loginAttempt()
      setLoadingText(null)
    }

    if (ready) {
      asyncLoginAttempt()
    }
  }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

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
      bgcolor="#FAFAFA"
    >
      {children}
    </Box>
  )
}

export function BodyLogger() {
  const { doesRouteAllowTwoColumnsLayout } = useRoute()
  const history = useHistory()
  const [toast, setToast] = useState<ToastProps | null>(null)
  const [dialog, setDialog] = useState<DialogProps | null>(null)
  const [loadingText, setLoadingText] = useState<string | null>(null)
  const [tableActionMenu, setTableActionMenu] = useState<string | null>(null)

  /*
   * Handle toast
   */
  useEffect(() => {
    // Avoid still showing the toast from last page
    if (toast) {
      setToast(null)
    }

    const locationState: Record<string, unknown> = history.location.state as Record<string, unknown>
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
  }, [history.location]) // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * Handle data logging (now console.log, in the future might be Analytics)
   */
  useEffect(() => {
    logAction('Route change', history.location)
  }, [history.location])

  return (
    <TableActionMenuContext.Provider value={{ tableActionMenu, setTableActionMenu }}>
      <ToastContext.Provider value={{ toast, setToast }}>
        <DialogContext.Provider value={{ dialog, setDialog }}>
          <LoaderContext.Provider value={{ loadingText, setLoadingText }}>
            <RebuildI18N />
            <HeaderWrapper />

            {doesRouteAllowTwoColumnsLayout(history.location) ? (
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

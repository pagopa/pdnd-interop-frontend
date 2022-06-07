import React, { FunctionComponent, useState } from 'react'
import { Router } from 'react-router-dom'
import { DialogProps, LangCode, ToastProps } from '../../types'
import {
  DialogContext,
  LangContext,
  LoaderContext,
  RoutesContext,
  TableActionMenuContext,
  ToastContext,
  TokenContext,
} from '../lib/context'
// import CssBaseline from '@mui/material/CssBaseline'
// import { ThemeProvider } from '@mui/material'
// import theme from '@pagopa/mui-italia/theme'
import { History, createMemoryHistory } from 'history'
import { getDecoratedRoutes } from '../lib/router-utils'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

type LangProviderProps = {
  defaultLang?: LangCode
}

type TokenProviderProps = {
  defaultToken?: string
}

type TableActionMenuProviderProps = {
  defaultTableActionMenu?: string
}

type ToastProviderProps = {
  defaultToast?: ToastProps
}

type DialogProviderProps = {
  defaultDialog?: DialogProps
}

type LoaderProviderProps = {
  defaultLoader?: string
}

const LangProvider: FunctionComponent<LangProviderProps> = ({ children, defaultLang = 'it' }) => {
  const [lang, setLang] = useState<LangCode>(defaultLang)
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

const RoutesProvider: FunctionComponent = ({ children }) => {
  const allRoutes = getDecoratedRoutes()
  return <RoutesContext.Provider value={{ allRoutes }}>{children}</RoutesContext.Provider>
}

const TokenProvider: FunctionComponent<TokenProviderProps> = ({ children, defaultToken }) => {
  const [token, setToken] = useState<string | null>(defaultToken || null)
  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
}

const TableActionMenuProvider: FunctionComponent<TableActionMenuProviderProps> = ({
  children,
  defaultTableActionMenu,
}) => {
  const [tableActionMenu, setTableActionMenu] = useState<string | null>(
    defaultTableActionMenu || null
  )
  return (
    <TableActionMenuContext.Provider value={{ tableActionMenu, setTableActionMenu }}>
      {children}
    </TableActionMenuContext.Provider>
  )
}

const ToastProvider: FunctionComponent<ToastProviderProps> = ({ children, defaultToast }) => {
  const [toast, setToast] = useState<ToastProps | null>(defaultToast || null)
  return <ToastContext.Provider value={{ toast, setToast }}>{children}</ToastContext.Provider>
}

const DialogProvider: FunctionComponent<DialogProviderProps> = ({ children, defaultDialog }) => {
  const [dialog, setDialog] = useState<DialogProps | null>(defaultDialog || null)
  return <DialogContext.Provider value={{ dialog, setDialog }}>{children}</DialogContext.Provider>
}

const LoaderProvider: FunctionComponent<LoaderProviderProps> = ({ children, defaultLoader }) => {
  const [loadingText, setLoadingText] = useState<string | null>(defaultLoader || null)
  return (
    <LoaderContext.Provider value={{ loadingText, setLoadingText }}>
      {children}
    </LoaderContext.Provider>
  )
}

type RouterProviderProps = {
  defaultHistory?: History<unknown>
}

export const AllTheProviders: FunctionComponent<
  LangProviderProps &
    TokenProviderProps &
    TableActionMenuProviderProps &
    ToastProviderProps &
    DialogProviderProps &
    LoaderProviderProps &
    RouterProviderProps
> = ({
  children,
  defaultLang,
  defaultToken,
  defaultTableActionMenu,
  defaultToast,
  defaultDialog,
  defaultLoader,
  defaultHistory,
}) => {
  const history = defaultHistory || createMemoryHistory()

  return (
    <LangProvider defaultLang={defaultLang}>
      <I18nextProvider i18n={i18n}>
        <RoutesProvider>
          <TokenProvider defaultToken={defaultToken}>
            <Router history={history}>
              {/* <ThemeProvider theme={theme}> */}
              {/* <CssBaseline /> */}

              <TableActionMenuProvider defaultTableActionMenu={defaultTableActionMenu}>
                <ToastProvider defaultToast={defaultToast}>
                  <DialogProvider defaultDialog={defaultDialog}>
                    <LoaderProvider defaultLoader={defaultLoader}>{children}</LoaderProvider>
                  </DialogProvider>
                </ToastProvider>
              </TableActionMenuProvider>
              {/* </ThemeProvider> */}
            </Router>
          </TokenProvider>
        </RoutesProvider>
      </I18nextProvider>
    </LangProvider>
  )
}

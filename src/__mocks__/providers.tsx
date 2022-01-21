import React, { FunctionComponent, useState } from 'react'
import { Router } from 'react-router-dom'
import { DialogProps, Party, ToastProps } from '../../types'
import {
  DialogContext,
  LoaderContext,
  PartyContext,
  TableActionMenuContext,
  ToastContext,
  TokenContext,
} from '../lib/context'
// import CssBaseline from '@mui/material/CssBaseline'
// import { ThemeProvider } from '@mui/material'
// import theme from '@pagopa/mui-italia/theme'
import { History, createMemoryHistory } from 'history'

type TokenProviderProps = {
  defaultToken?: string
}

type PartyProviderProps = {
  defaultParty?: Party
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

const TokenProvider: FunctionComponent<TokenProviderProps> = ({ children, defaultToken }) => {
  const [token, setToken] = useState<string | null>(defaultToken || null)
  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
}

const PartyProvider: FunctionComponent<PartyProviderProps> = ({ children, defaultParty }) => {
  const [party, setParty] = useState<Party | null>(defaultParty || null)
  const [availableParties, setAvailableParties] = useState<Array<Party> | null>(
    defaultParty ? [defaultParty] : null
  )
  return (
    <PartyContext.Provider value={{ party, setParty, availableParties, setAvailableParties }}>
      {children}
    </PartyContext.Provider>
  )
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
  TokenProviderProps &
    PartyProviderProps &
    TableActionMenuProviderProps &
    ToastProviderProps &
    DialogProviderProps &
    LoaderProviderProps &
    RouterProviderProps
> = ({
  children,
  defaultToken,
  defaultParty,
  defaultTableActionMenu,
  defaultToast,
  defaultDialog,
  defaultLoader,
  defaultHistory,
}) => {
  const history = defaultHistory || createMemoryHistory()

  return (
    <TokenProvider defaultToken={defaultToken}>
      <PartyProvider defaultParty={defaultParty}>
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
      </PartyProvider>
    </TokenProvider>
  )
}

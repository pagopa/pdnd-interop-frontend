import { createContext } from 'react'
import noop from 'lodash/noop'
import { DialogProps, LangCode, MappedRouteConfig, ToastProps } from '../../types'

type RoutesContextType = {
  allRoutes: Record<LangCode, Record<string, MappedRouteConfig>>
}

export const RoutesContext = createContext({ allRoutes: {} } as RoutesContextType)

type LangContextType = {
  lang: LangCode
  setLang: React.Dispatch<React.SetStateAction<LangCode>>
}

export const LangContext = createContext({ lang: 'it', setLang: noop } as LangContextType)

type TokenContextType = {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

export const TokenContext = createContext({ token: null, setToken: noop } as TokenContextType)

type ToastContextType = {
  toast: ToastProps | null
  setToast: React.Dispatch<React.SetStateAction<ToastProps | null>>
}

export const ToastContext = createContext({ toast: null, setToast: noop } as ToastContextType)

type DialogContextType = {
  dialog: DialogProps | null
  setDialog: React.Dispatch<React.SetStateAction<DialogProps | null>>
}

export const DialogContext = createContext({
  dialog: null,
  setDialog: noop,
} as DialogContextType)

type LoaderContextType = {
  loadingText: string | null
  setLoadingText: React.Dispatch<React.SetStateAction<string | null>>
}

export const LoaderContext = createContext({
  loadingText: null,
  setLoadingText: noop,
} as LoaderContextType)

type TableActionMenuContextType = {
  tableActionMenu: string | null
  setTableActionMenu: React.Dispatch<React.SetStateAction<string | null>>
}

export const TableActionMenuContext = createContext({
  tableActionMenu: null,
  setTableActionMenu: noop,
} as TableActionMenuContextType)

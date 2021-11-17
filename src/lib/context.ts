import { createContext } from 'react'
import { DialogProps, Party, ToastProps, User } from '../../types'

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext({ user: null, setUser: () => {} } as UserContextType)

type PartyContextType = {
  party: Party | null
  availableParties: Party[] | null
  setParty: React.Dispatch<React.SetStateAction<Party | null>>
  setAvailableParties: React.Dispatch<React.SetStateAction<Party[] | null>>
}

export const PartyContext = createContext({
  party: null,
  // Initially null, which means no fetch has occurred.
  // Then it may become [], which signifies that a fetch has occurred,
  // but this user has no availableParties onboarded for now
  availableParties: null,
  setParty: () => {},
  setAvailableParties: () => {},
} as PartyContextType)

type ToastContextType = {
  toast: ToastProps | null
  setToast: React.Dispatch<React.SetStateAction<ToastProps | null>>
}

export const ToastContext = createContext({ toast: null, setToast: () => {} } as ToastContextType)

type DialogContextType = {
  dialog: DialogProps | null
  setDialog: React.Dispatch<React.SetStateAction<DialogProps | null>>
}

export const DialogContext = createContext({
  dialog: null,
  setDialog: () => {},
} as DialogContextType)

type LoaderContextType = {
  loadingText: string | null
  setLoadingText: React.Dispatch<React.SetStateAction<string | null>>
}

export const LoaderContext = createContext({
  loadingText: null,
  setLoadingText: () => {},
} as LoaderContextType)

type TableActionMenuContextType = {
  tableActionMenu: string | null
  setTableActionMenu: React.Dispatch<React.SetStateAction<string | null>>
}

export const TableActionMenuContext = createContext({
  tableActionMenu: null,
  setTableActionMenu: () => {},
} as TableActionMenuContextType)

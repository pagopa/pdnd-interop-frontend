import { createContext } from 'react'
import { DialogProps, Party, ToastProps, User } from '../../types'

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext({ user: null, setUser: () => {} } as UserContextType)

type PartyContextType = {
  party: Party | null
  availableParties: Party[]
  setParty: React.Dispatch<React.SetStateAction<Party | null>>
  setAvailableParties: React.Dispatch<React.SetStateAction<Party[]>>
}

export const PartyContext = createContext({
  party: null,
  availableParties: [],
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

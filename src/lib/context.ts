import { createContext } from 'react'
import { Party, User } from '../../types'

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

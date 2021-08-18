import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { BodyLogger } from './components/BodyLogger'
import { PartyContext, UserContext } from './lib/context'
import { Party, User } from '../types'

export function App() {
  const [user, setUser] = useState<User | null>(null)
  const [party, setParty] = useState<Party | null>(null)
  const [availableParties, setAvailableParties] = useState<Party[]>([])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PartyContext.Provider value={{ party, availableParties, setParty, setAvailableParties }}>
        <BrowserRouter>
          <BodyLogger />
        </BrowserRouter>
      </PartyContext.Provider>
    </UserContext.Provider>
  )
}

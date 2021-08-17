import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { PartyContext, UserContext } from './lib/context'
import { Party, User } from '../types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [party, setParty] = useState<Party | null>(null)
  const [availableParties, setAvailableParties] = useState<Party[]>([])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PartyContext.Provider value={{ party, availableParties, setParty, setAvailableParties }}>
        <BrowserRouter>
          <Header />
          <Main />
          <Footer />
        </BrowserRouter>
      </PartyContext.Provider>
    </UserContext.Provider>
  )
}

export default App

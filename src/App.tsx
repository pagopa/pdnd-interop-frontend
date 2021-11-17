import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { BodyLogger } from './components/BodyLogger'
import { PartyContext, UserContext } from './lib/context'
import { Party, User } from '../types'
import { ThemeProvider } from '@mui/material'
import theme from '@pagopa/mui-italia/theme'

export function App() {
  const [user, setUser] = useState<User | null>(null)
  const [party, setParty] = useState<Party | null>(null)
  const [availableParties, setAvailableParties] = useState<Party[] | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PartyContext.Provider value={{ party, availableParties, setParty, setAvailableParties }}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BodyLogger />
          </ThemeProvider>
        </BrowserRouter>
      </PartyContext.Provider>
    </UserContext.Provider>
  )
}

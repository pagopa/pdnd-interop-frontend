import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { BodyLogger } from './components/BodyLogger'
import { LangContext, RoutesContext, TokenContext } from './lib/context'
import { LangCode } from '../types'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import DateAdapter from '@mui/lab/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { getDecoratedRoutes, getInitialLang } from './lib/router-utils'
import { PUBLIC_URL } from './lib/constants'

const allRoutes = getDecoratedRoutes()

export function App() {
  const [lang, setLang] = useState<LangCode>(getInitialLang())
  const [token, setToken] = useState<string | null>(null)

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <RoutesContext.Provider value={{ allRoutes }}>
        <TokenContext.Provider value={{ token, setToken }}>
          <BrowserRouter basename={PUBLIC_URL}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <BodyLogger />
              </ThemeProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </TokenContext.Provider>
      </RoutesContext.Provider>
    </LangContext.Provider>
  )
}

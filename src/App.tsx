import React, { useMemo, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { BodyLogger } from './components/BodyLogger'
import { LangContext, PartyContext, RoutesContext, TokenContext } from './lib/context'
import { Lang, Party } from '../types'
import { ThemeProvider } from '@mui/material'
import theme from '@pagopa/mui-italia/theme'
import DateAdapter from '@mui/lab/AdapterDateFns'
import { LocalizationProvider } from '@mui/lab'
import { BASIC_ROUTES } from './config/routes'
import { decorateRouteWithParents, mapRoutesToLang } from './lib/router-utils'

export function App() {
  const [lang, setLang] = useState<Lang>('it')
  const [token, setToken] = useState<string | null>(null)
  const [party, setParty] = useState<Party | null>(null)
  const [availableParties, setAvailableParties] = useState<Array<Party> | null>(null)

  const routes = useMemo(() => {
    const mappedRoutes = mapRoutesToLang(BASIC_ROUTES, lang)
    return decorateRouteWithParents(mappedRoutes)
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <RoutesContext.Provider value={{ routes }}>
        <TokenContext.Provider value={{ token, setToken }}>
          <PartyContext.Provider value={{ party, availableParties, setParty, setAvailableParties }}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <BodyLogger />
                </ThemeProvider>
              </LocalizationProvider>
            </BrowserRouter>
          </PartyContext.Provider>
        </TokenContext.Provider>
      </RoutesContext.Provider>
    </LangContext.Provider>
  )
}

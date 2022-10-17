import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { BodyLogger } from './components/BodyLogger'
import { LangContext, RoutesContext, TokenContext } from './lib/context'
import { /* ExtendedWindow, */ LangCode } from '../types'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import DateAdapter from '@mui/lab/AdapterDateFns'
import { getDecoratedRoutes, getInitialLang } from './lib/router-utils'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { PUBLIC_URL } from './lib/env'
// import './lib/onetrust'
// import { mixpanelInit } from './lib/mixpanel'

// const oneTrustTargerCookiesGroup = 'C0002' // "Cookie di prestazione" – MixPanel

const allRoutes = getDecoratedRoutes()

// declare const OneTrust: any // eslint-disable-line @typescript-eslint/no-explicit-any
// declare const OnetrustActiveGroups: string

export function App() {
  const [lang, setLang] = useState<LangCode>(getInitialLang())
  const [token, setToken] = useState<string | null>(null)

  // React.useEffect(() => {
  //   // OneTrust callback at first time
  //   ;(window as unknown as ExtendedWindow).OptanonWrapper = function () {
  //     OneTrust.OnConsentChanged(function () {
  //       const activeGroups = OnetrustActiveGroups
  //       if (activeGroups.indexOf(oneTrustTargerCookiesGroup) > -1) {
  //         mixpanelInit()
  //       }
  //     })
  //   }
  //   // check mixpanel cookie consent in cookie
  //   const OTCookieValue: string =
  //     document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || ''
  //   const checkValue = `${oneTrustTargerCookiesGroup}%3A1`
  //   if (OTCookieValue.indexOf(checkValue) > -1) {
  //     mixpanelInit()
  //   }
  // }, [])

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

import React, { FunctionComponent, useState } from 'react'
import { render } from '@testing-library/react'
import { Header } from '../Header'
import { MemoryRouter, Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { Party } from '../../../types'
import { PartyContext, TokenContext } from '../../lib/context'
import { ROUTES } from '../../config/routes'

type TokenProviderProps = {
  defaultToken?: string
}

type PartyProviderProps = {
  defaultParty?: Party
}

const TokenProvider: FunctionComponent<TokenProviderProps> = ({ children, defaultToken }) => {
  const [token, setToken] = useState<string | null>(defaultToken || null)
  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
}

const PartyProvider: FunctionComponent<PartyProviderProps> = ({ children, defaultParty }) => {
  const [party, setParty] = useState<Party | null>(defaultParty || null)
  const [availableParties, setAvailableParties] = useState<Array<Party> | null>(
    defaultParty ? [defaultParty] : null
  )
  return (
    <PartyContext.Provider value={{ party, setParty, availableParties, setAvailableParties }}>
      {children}
    </PartyContext.Provider>
  )
}

describe('Render the correct header variant', () => {
  it('Show login button if not logged in', () => {
    const { getByText } = render(
      <MemoryRouter>
        <TokenProvider>
          <Header />
        </TokenProvider>
      </MemoryRouter>
    )
    expect(getByText('Login')).toBeInTheDocument()
  })

  it('Show logout button if user logged in', () => {
    const tokenData =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImYyNmUwM2RiLWY4YjMtNDk5ZS04ZjMyLTA3MmM5M2VjZjc2MSJ9.eyJlbWFpbCI6ImNhcmxhLnJvc3NpQHRlc3QucGFnb3BhLml0IiwiZmFtaWx5X25hbWUiOiJSb3NzaSIsImZpc2NhbF9udW1iZXIiOiJJU1BYTkIzMlI4Mlk3NjZEIiwibW9iaWxlX3Bob25lIjoiMzMzMzMzMzMzIiwibmFtZSI6IkNhcmxhIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImZiMjgwNGQwLTllN2QtNGIwNC05MjVhLWNhNmY4MDJhNzI4MiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDI1ODg2ODEsImV4cCI6MTY0MjU5MjI4MSwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlNSWU1DVlAwTTA1WkFXWFdIVlJNWldBIn0.oZODSEMPduJ4ExsDOm7Ddn9m6oFgt_qtABR3RfgV26NiCPZfEAuiAHz3x23m2xz3bP5-XPSpfT4JBD6biAxZlV0C_1HV83KHOy9ylweKNeyPQZxRn_wfZ2I4taC6PC0Nc-6YJ3KrzXsEJOtQQWm3FMG4LrWnChz4Smn16gjrjQ1X3lW2UDbef9qI9nvpaZW1bUmxjxYXN2FLv5I_gkWUxtiCgCcVPD8fVfyk8dh4mM_I1-aswktX65UiGhgTZfwa6O-10enhbN03bmIKp800WRcx_xslIaD8REviBRJcTqQLDTMe5Omt0ylSLzy7XBodMpuyjghh9K-Yojr67x7KpA'

    const { getByText } = render(
      <MemoryRouter>
        <TokenProvider defaultToken={tokenData}>
          <Header />
        </TokenProvider>
      </MemoryRouter>
    )
    expect(getByText('Logout')).toBeInTheDocument()
  })

  it('Hide party select if not in platform', () => {
    const { queryByLabelText } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(queryByLabelText('party-menu-button')).toBeNull()
  })

  it('Show party select if in platform', () => {
    const partyData: Party = {
      partyId: 'dsofdm-dsfjds',
      attributes: [],
      state: 'ACTIVE',
      role: 'MANAGER',
      productInfo: {
        createdAt: '',
        id: 'interop',
        role: 'admin',
      },
      description: 'Comune di Test',
      institutionId: 'dsfjisdo-sdfdjs-sdfjsd',
      digitalAddress: 'comune@test.it',
    }

    const history = createMemoryHistory()
    history.push(ROUTES.PROVIDE.PATH)
    const { getByLabelText } = render(
      <Router history={history}>
        <PartyProvider defaultParty={partyData}>
          <Header />
        </PartyProvider>
      </Router>
    )
    expect(getByLabelText('party-menu-button')).toBeInTheDocument()
  })
})

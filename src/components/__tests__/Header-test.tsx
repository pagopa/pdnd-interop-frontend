import React, { FunctionComponent, useState } from 'react'
import { render } from '@testing-library/react'
import { Header } from '../Header'
import { MemoryRouter, Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { Party, User } from '../../../types'
import { PartyContext, UserContext } from '../../lib/context'

type UserProviderProps = {
  defaultUser?: User
}

type PartyProviderProps = {
  defaultParty?: Party
}

const UserProvider: FunctionComponent<UserProviderProps> = ({ children, defaultUser }) => {
  const [user, setUser] = useState<User | null>(defaultUser || null)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
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
        <UserProvider>
          <Header />
        </UserProvider>
      </MemoryRouter>
    )
    expect(getByText('Login')).toBeInTheDocument()
  })

  it('Show logout button if user logged in', () => {
    const userData: User = {
      name: 'Antonio',
      surname: 'Berielli',
      taxCode: 'BRLNTN67E11L405R',
      email: 'antonio.berielli@test.it',
      status: 'active',
      role: 'Manager',
      platformRole: 'admin',
    }

    const { getByText } = render(
      <MemoryRouter>
        <UserProvider defaultUser={userData}>
          <Header />
        </UserProvider>
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
      status: 'active',
      role: 'Manager',
      platformRole: 'admin',
      description: 'Comune di Test',
      institutionId: 'dsfjisdo-sdfdjs-sdfjsd',
      digitalAddress: 'comune@test.it',
    }

    const history = createMemoryHistory()
    history.push('/erogazione')
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

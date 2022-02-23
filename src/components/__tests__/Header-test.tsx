import React from 'react'
import { render } from '@testing-library/react'
import { Header } from '../Header'
import { createMemoryHistory } from 'history'
import { AllTheProviders } from '../../__mocks__/providers'
import { partyActiveManager } from '../../__mocks__/party'
import { token } from '../../__mocks__/token'
import { getDecoratedRoutes } from '../../lib/router-utils'

describe('Render the correct header variant', () => {
  it('Show login button if not logged in', () => {
    const { getByText } = render(
      <AllTheProviders>
        <Header />
      </AllTheProviders>
    )
    expect(getByText('Login')).toBeInTheDocument()
  })

  it('Show logout button if user logged in', () => {
    const { getByText } = render(
      <AllTheProviders defaultToken={token}>
        <Header />
      </AllTheProviders>
    )
    expect(getByText('Logout')).toBeInTheDocument()
  })

  it('Hide party select if not in platform', () => {
    const { queryByLabelText } = render(
      <AllTheProviders>
        <Header />
      </AllTheProviders>
    )
    expect(queryByLabelText('party-menu-button')).toBeNull()
  })

  it('Show party select if in platform', () => {
    const history = createMemoryHistory()
    const allRoutes = getDecoratedRoutes()
    const routes = allRoutes['it']

    history.push(routes.PROVIDE.PATH)
    const { getByLabelText } = render(
      <AllTheProviders defaultHistory={history} defaultParty={partyActiveManager}>
        <Header />
      </AllTheProviders>
    )
    expect(getByLabelText('party-menu-button')).toBeInTheDocument()
  })
})

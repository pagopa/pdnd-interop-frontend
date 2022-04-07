import React from 'react'
import { render } from '@testing-library/react'
import noop from 'lodash/noop'
import { createMemoryHistory } from 'history'
import { token } from '../../__mocks__/token'
import { AllTheProviders } from '../../__mocks__/providers'
import { partyActiveManager } from '../../__mocks__/party'
import { getDecoratedRoutes } from '../../lib/router-utils'
import { Header } from '../Header'
import { PartySelect } from '../PartySelect'

describe('Render the correct header variant', () => {
  it('Show login button if not logged in', () => {
    const { getByText } = render(
      <AllTheProviders>
        <Header onAssistanceClick={noop} onLogin={noop} />
      </AllTheProviders>
    )
    expect(getByText(/login/i)).toBeInTheDocument()
  })

  it('Show user profile button if user logged in', () => {
    const { getByText } = render(
      <AllTheProviders defaultToken={token}>
        <Header onAssistanceClick={noop} onLogin={noop} loggedUser={{ id: 'abc' }} />
      </AllTheProviders>
    )
    expect(getByText(/utente/i)).toBeInTheDocument()
  })

  it('Hide party select', () => {
    const { queryByLabelText } = render(
      <AllTheProviders>
        <Header onAssistanceClick={noop} onLogin={noop} showSubHeader={false} />
      </AllTheProviders>
    )
    expect(queryByLabelText('party-menu-button')).toBeNull()
  })

  it('Show party select', () => {
    const history = createMemoryHistory()
    const allRoutes = getDecoratedRoutes()
    const routes = allRoutes['it']

    history.push(routes.PROVIDE.PATH)
    const { getByLabelText } = render(
      <AllTheProviders defaultHistory={history} defaultParty={partyActiveManager}>
        <Header onAssistanceClick={noop} onLogin={noop} subHeaderRightComponent={<PartySelect />} />
      </AllTheProviders>
    )
    expect(getByLabelText('party-menu-button')).toBeInTheDocument()
  })
})

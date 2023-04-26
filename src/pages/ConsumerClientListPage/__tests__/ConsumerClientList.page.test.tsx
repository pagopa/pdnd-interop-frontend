import React from 'react'
import {
  mockUseClientKind,
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ConsumerClientListPage from '../ConsumerClientList.page'
import userEvent from '@testing-library/user-event'

mockUseCurrentRoute({ mode: 'consumer' })
mockUseClientKind('CONSUMER')

describe('ConsumerClientListPage', () => {
  it('should match the snapshot', () => {
    mockUseJwt({ isAdmin: true })
    const { baseElement } = renderWithApplicationContext(<ConsumerClientListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot as non admin', () => {
    mockUseJwt({ isAdmin: false })
    const { baseElement } = renderWithApplicationContext(<ConsumerClientListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should successfully navigate to the create client page', async () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(<ConsumerClientListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const createNewBtn = screen.getByRole('button', { name: 'createNewBtn' })
    const user = userEvent.setup()
    await user.click(createNewBtn)
    expect(screen.history.location.pathname).toEqual('/it/fruizione/client/crea')
  })
})

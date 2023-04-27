import React from 'react'
import {
  mockUseClientKind,
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ConsumerClientM2MListPage from '../ConsumerClientM2MList.page'
import userEvent from '@testing-library/user-event'

mockUseCurrentRoute({ mode: 'consumer' })
mockUseClientKind('API')

describe('ConsumerClientM2MListPage', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<ConsumerClientM2MListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot as non admin', () => {
    mockUseJwt({ isAdmin: false })
    const { baseElement } = renderWithApplicationContext(<ConsumerClientM2MListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should successfully navigate to the create client page', async () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(<ConsumerClientM2MListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const createNewBtn = screen.getByRole('button', { name: 'createNewBtn' })
    const user = userEvent.setup()
    await user.click(createNewBtn)
    expect(screen.history.location.pathname).toEqual('/it/fruizione/interop-m2m/crea')
  })
})

import React from 'react'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  mockUseCurrentRoute,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import ProviderAgreementsListPage from '../ProviderAgreementsList.page'
import { waitFor } from '@testing-library/react'

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/agreements`,
    result: {
      results: [],
      pagination: {
        limit: 10,
        offset: 0,
        totalCount: 0,
      },
    },
  },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

describe('ProviderAgreementsListPage', () => {
  it('should match snapshot', async () => {
    mockUseCurrentRoute()
    const screen = renderWithApplicationContext(<ProviderAgreementsListPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument())
    expect(screen.baseElement).toMatchSnapshot('full state')
  })
})

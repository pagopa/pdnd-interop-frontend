import React from 'react'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'
import * as useClientKindHook from '@/hooks/useClientKind'
import * as router from '@/router'
import { vi } from 'vitest'
import OperatorDetailsPage from '../OperatorDetails.page'
import { waitFor } from '@testing-library/react'

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/relationships/:relationshipId`,
    result: createMockSelfCareUser({ product: { role: 'security' } }),
  },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

const useClientKindSpy = vi.spyOn(useClientKindHook, 'useClientKind')
vi.spyOn(router, 'useRouteParams').mockReturnValue({
  clientId: 'clientId',
  operatorId: 'operatorId',
})

describe('OperatorGeneralInfoSection', () => {
  it('should match the snapshot (API)', async () => {
    useClientKindSpy.mockReturnValue('API')
    mockUseCurrentRoute({ mode: 'provider' })
    const screen = renderWithApplicationContext(<OperatorDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByRole('heading', { name: 'Mario Rossi' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })

  it('should match the snapshot (CONSUMER)', async () => {
    useClientKindSpy.mockReturnValue('CONSUMER')
    mockUseCurrentRoute({ mode: 'provider' })
    const screen = renderWithApplicationContext(<OperatorDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByRole('heading', { name: 'Mario Rossi' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })

  it("should render the 'remove from client' action if user is admin and the context is 'consumer'", async () => {
    useClientKindSpy.mockReturnValue('CONSUMER')
    mockUseCurrentRoute({ mode: 'consumer' })
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(<OperatorDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await waitFor(() => screen.getByRole('heading', { name: 'Mario Rossi' }))
    expect(screen.getByRole('button', { name: 'actions.removeFromClient' })).toBeInTheDocument()
  })

  it("should not render the 'remove from client' action if user is not admin", async () => {
    useClientKindSpy.mockReturnValue('CONSUMER')
    mockUseCurrentRoute({ mode: 'consumer' })
    mockUseJwt({ isAdmin: false })
    const screen = renderWithApplicationContext(<OperatorDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await waitFor(() => screen.getByRole('heading', { name: 'Mario Rossi' }))
    expect(
      screen.queryByRole('button', { name: 'actions.removeFromClient' })
    ).not.toBeInTheDocument()
  })

  it("should not render the 'remove from client' action if context is provider", async () => {
    useClientKindSpy.mockReturnValue('CONSUMER')
    mockUseCurrentRoute({ mode: 'provider' })
    mockUseJwt({ isAdmin: false })
    const screen = renderWithApplicationContext(<OperatorDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    await waitFor(() => screen.getByRole('heading', { name: 'Mario Rossi' }))
    expect(
      screen.queryByRole('button', { name: 'actions.removeFromClient' })
    ).not.toBeInTheDocument()
  })
})

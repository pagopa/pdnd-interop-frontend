import React from 'react'
import {
  mockUseClientKind,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import KeyDetailsPage from '../KeyDetails.page'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import * as router from '@/router'
import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { ClientQueries } from '@/api/client'

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/clients/:clientId/keys/:kid`,
    result: createMockPublicKey({ name: 'public-key-name', isOrphan: false }),
  },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

vi.spyOn(router, 'useRouteParams').mockReturnValue({ clientId: 'clientId', kid: 'kid' })

describe('KeyDetailsPage', () => {
  it('should match snapshot (API)', async () => {
    mockUseClientKind('API')

    const screen = renderWithApplicationContext(<KeyDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByRole('heading', { name: 'public-key-name' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })

  it('should match snapshot (CONSUMER)', async () => {
    mockUseClientKind('CONSUMER')

    const screen = renderWithApplicationContext(<KeyDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByRole('heading', { name: 'public-key-name' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })

  it('should show alert if key is orphan', async () => {
    mockUseClientKind('API')

    vi.spyOn(ClientQueries, 'useGetSingleKey').mockReturnValue({
      data: createMockPublicKey({ name: 'public-key-name', isOrphan: true }),
    } as unknown as ReturnType<typeof ClientQueries.useGetSingleKey>)

    const screen = renderWithApplicationContext(<KeyDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toHaveTextContent('edit.orphanAlertLabel')
  })

  it('should show alert if key is not orphan', async () => {
    mockUseClientKind('API')

    vi.spyOn(ClientQueries, 'useGetSingleKey').mockReturnValue({
      data: createMockPublicKey({ name: 'public-key-name', isOrphan: false }),
    } as unknown as ReturnType<typeof ClientQueries.useGetSingleKey>)

    const screen = renderWithApplicationContext(<KeyDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).not.toHaveTextContent('edit.orphanAlertLabel')
  })
})

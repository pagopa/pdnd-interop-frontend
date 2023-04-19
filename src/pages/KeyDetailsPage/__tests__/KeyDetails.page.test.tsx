import React from 'react'
import { renderWithApplicationContext, setupQueryServer } from '@/utils/testing.utils'
import KeyDetailsPage from '../KeyDetails.page'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import * as useClientKindHook from '@/hooks/useClientKind'
import * as router from '@/router'
import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/clients/:clientId/keys/:kid`,
    result: createMockPublicKey({ name: 'public-key-name' }),
  },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

const useClientKindSpy = vi.spyOn(useClientKindHook, 'useClientKind')
vi.spyOn(router, 'useRouteParams').mockReturnValue({ clientId: 'clientId', kid: 'kid' })

describe('KeyDetailsPage', () => {
  it('should match snapshot (API)', async () => {
    useClientKindSpy.mockReturnValue('API')

    const screen = renderWithApplicationContext(<KeyDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByRole('heading', { name: 'public-key-name' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })

  it('should match snapshot (CONSUMER)', async () => {
    useClientKindSpy.mockReturnValue('CONSUMER')

    const screen = renderWithApplicationContext(<KeyDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.getByRole('heading', { name: 'public-key-name' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })
})

import React from 'react'
import { ClientTableRow } from '../ClientTableRow'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import * as useClientKindHook from '@/hooks/useClientKind'
import * as router from '@/router'
import userEvent from '@testing-library/user-event'

mockUseJwt()
const clientMock = { id: 'client-id', name: 'name', hasKeys: false }
const useClientKindMock = vi.spyOn(useClientKindHook, 'useClientKind')
const navigateRouterFn = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateRouterFn)

afterEach(() => {
  navigateRouterFn.mockReset()
})

describe('ClientTableRow', () => {
  it('should navigate to the client edit page (API)', async () => {
    useClientKindMock.mockReturnValue('API')
    const { getByRole, history } = renderWithApplicationContext(
      <ClientTableRow client={clientMock} clientKind="API" />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(getByRole('link', { name: 'inspect' }))

    expect(history.location.pathname).toBe('/it/gestione-client/api-interop/client-id')
  })

  it('should navigate to the client edit page (CONSUMER)', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')
    const { getByRole, history } = renderWithApplicationContext(
      <ClientTableRow client={clientMock} clientKind="CONSUMER" />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(getByRole('link', { name: 'inspect' }))

    expect(history.location.pathname).toBe('/it/gestione-client/api-e-service/client-id')
  })
})

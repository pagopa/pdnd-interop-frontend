import React from 'react'
import { render } from '@testing-library/react'
import { ClientTableRow, ClientTableRowSkeleton } from '../ClientTableRow'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import * as useClientKindHook from '@/hooks/useClientKind'
import * as router from '@/router'
import userEvent from '@testing-library/user-event'

const clientMock = { id: 'client-id', name: 'name', hasKeys: false }
const useClientKindMock = vi.spyOn(useClientKindHook, 'useClientKind')
const navigateRouterFn = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateRouterFn)

afterEach(() => {
  navigateRouterFn.mockReset()
})

describe('ClientTableRow', () => {
  it('should match the snapshot', () => {
    useClientKindMock.mockReturnValue('API')
    const { container } = renderWithApplicationContext(
      <ClientTableRow client={clientMock} clientKind="API" />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(container).toMatchSnapshot()
  })

  it('should navigate to the client edit page (API)', async () => {
    useClientKindMock.mockReturnValue('API')
    const { getByRole } = renderWithApplicationContext(
      <ClientTableRow client={clientMock} clientKind="API" />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'inspect' }))

    expect(navigateRouterFn).toHaveBeenCalledWith('SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT', {
      params: { clientId: clientMock.id },
    })
  })

  it('should navigate to the client edit page (CONSUMER)', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')
    const { getByRole } = renderWithApplicationContext(
      <ClientTableRow client={clientMock} clientKind="CONSUMER" />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'inspect' }))

    expect(navigateRouterFn).toHaveBeenCalledWith('SUBSCRIBE_CLIENT_EDIT', {
      params: { clientId: clientMock.id },
    })
  })
})

describe('ClientTableRowSkeleton', () => {
  it('should match the snapshot', () => {
    const { container } = render(<ClientTableRowSkeleton />)
    expect(container).toMatchSnapshot()
  })
})

import React from 'react'
import { mockUseClientKind, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  ClientPublicKeysTableRow,
  ClientPublicKeysTableRowSkeleton,
} from '../ClientPublicKeysTableRow'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { ClientQueries } from '@/api/client'
import userEvent from '@testing-library/user-event'

const getCommonProps = (isOrphan = false) => ({
  publicKey: createMockPublicKey({ isOrphan }),
  clientId: 'clientId',
})

mockUseClientKind('API')

describe('ClientPublicKeysTableRow', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <ClientPublicKeysTableRow {...getCommonProps()} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with orphan public key', () => {
    const { baseElement } = renderWithApplicationContext(
      <ClientPublicKeysTableRow {...getCommonProps(true)} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should prefetch key on hover', async () => {
    const prefetchFn = vi.fn()
    vi.spyOn(ClientQueries, 'usePrefetchSingleKey').mockReturnValue(prefetchFn)

    const screen = renderWithApplicationContext(
      <ClientPublicKeysTableRow {...getCommonProps(true)} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()
    await user.hover(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(prefetchFn).toBeCalled()
  })

  it('should navigate to SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT if inspect button is clicked with clientKind API', async () => {
    const screen = renderWithApplicationContext(
      <ClientPublicKeysTableRow {...getCommonProps(true)} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(screen.history.location.pathname).toBe(
      '/it/fruizione/interop-m2m/clientId/chiavi/Fxod41P3BZoe2HT6BuEw3SNFlu9ufAkYgpmtBoNuVkg'
    )
  })

  it('should navigate to SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT if inspect button is clicked with clientKind API', async () => {
    mockUseClientKind('CONSUMER')
    const screen = renderWithApplicationContext(
      <ClientPublicKeysTableRow {...getCommonProps(true)} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(screen.history.location.pathname).toBe(
      '/it/fruizione/client/clientId/chiavi/Fxod41P3BZoe2HT6BuEw3SNFlu9ufAkYgpmtBoNuVkg'
    )
  })
})

describe('ClientPublicKeysTableRowSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ClientPublicKeysTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import {
  ClientOperatorsTableRow,
  type ClientOperatorsTableRowProps,
  ClientOperatorsTableRowSkeleton,
} from '../ClientOperatorsTableRow'
import { mockUseClientKind, mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ClientQueries } from '@/api/client'
import { createMockOperator } from '__mocks__/data/user.mocks'

const commonProps: ClientOperatorsTableRowProps = {
  clientId: 'clientId',
  operator: createMockOperator(),
}

describe('ClientOperatorsTableRowSkeleton', () => {
  it('should match snapshot (admin - API)', () => {
    mockUseJwt({ isAdmin: true })
    mockUseClientKind('API')
    const { baseElement } = renderWithApplicationContext(
      <ClientOperatorsTableRow {...commonProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot (not admin - CONSUMER)', () => {
    mockUseJwt({ isAdmin: false })
    mockUseClientKind('CONSUMER')
    const { baseElement } = renderWithApplicationContext(
      <ClientOperatorsTableRow {...commonProps} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should prefetch operator on hover', async () => {
    mockUseJwt({ isAdmin: true })
    mockUseClientKind('API')

    const prefetchFn = vi.fn()
    vi.spyOn(ClientQueries, 'usePrefetchSingleOperator').mockReturnValue(prefetchFn)
    const screen = renderWithApplicationContext(<ClientOperatorsTableRow {...commonProps} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    const button = screen.getByRole('button', { name: 'actions.inspect' })
    const user = userEvent.setup()
    await user.hover(button)
    expect(prefetchFn).toHaveBeenCalledWith('relationship-id')
  })
})

describe('ClientOperatorsTableRowSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ClientOperatorsTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

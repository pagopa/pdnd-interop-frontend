import React from 'react'
import { render } from '@testing-library/react'
import {
  ConsumerPurposesTableRow,
  ConsumerPurposesTableRowSkeleton,
} from '../ConsumerPurposesTableRow'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { PurposeQueries } from '@/api/purpose'

describe('ConsumerPurposesTableRow', () => {
  it('should match the snapshot', () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })

    const { baseElement } = renderWithApplicationContext(
      <ConsumerPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should navigate to the purpose details page', async () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })

    const screen = renderWithApplicationContext(
      <ConsumerPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(screen.history.location.pathname).toEqual('/it/fruizione/finalita/test-id')
  })

  it('should prefetch the purpose details', async () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })
    const prefetchFn = vi.fn()

    vi.spyOn(PurposeQueries, 'usePrefetchSingle').mockReturnValue(prefetchFn)

    const screen = renderWithApplicationContext(
      <ConsumerPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.hover(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(prefetchFn).toHaveBeenCalledWith('test-id')
  })

  it('should show the edit button if user is Admin and the current version of the purpose is in draft', async () => {
    const purposeMock = createMockPurpose({ id: 'test-id', currentVersion: { state: 'DRAFT' } })
    mockUseJwt({ isAdmin: true })

    const screen = renderWithApplicationContext(
      <ConsumerPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()

    const editButton = screen.getByRole('button', { name: 'actions.edit' })
    expect(editButton).toBeInTheDocument()
    await user.click(editButton)
    expect(screen.history.location.pathname).toEqual('/it/fruizione/finalita/test-id/modifica')
  })

  it('should not show the edit button if user is not Admin and the current version of the purpose is in draft', async () => {
    const purposeMock = createMockPurpose({ id: 'test-id', currentVersion: { state: 'DRAFT' } })
    mockUseJwt({ isAdmin: false })

    const screen = renderWithApplicationContext(
      <ConsumerPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    expect(screen.queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
  })
})

describe('ConsumerPurposesTableRowSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ConsumerPurposesTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

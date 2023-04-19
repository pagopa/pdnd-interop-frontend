import React from 'react'
import { render } from '@testing-library/react'
import {
  ProviderPurposesTableRow,
  ProviderPurposesTableRowSkeleton,
} from '../ProviderPurposesTableRow'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import * as router from '@/router'
import userEvent from '@testing-library/user-event'
import { PurposeQueries } from '@/api/purpose'

const mockUseNavigateRouter = vi.spyOn(router, 'useNavigateRouter')

describe('ProviderPurposesTableRow', () => {
  it('should match the snapshot', () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })

    const { baseElement } = renderWithApplicationContext(
      <ProviderPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should navigate to the purpose details page', async () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })
    const navigateFn = vi.fn()

    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })

    const screen = renderWithApplicationContext(
      <ProviderPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(navigateFn).toHaveBeenCalledWith('PROVIDE_PURPOSE_DETAILS', {
      params: { purposeId: 'test-id' },
    })
  })

  it('should prefetch the purpose details', async () => {
    const purposeMock = createMockPurpose({ id: 'test-id' })
    const prefetchFn = vi.fn()

    vi.spyOn(PurposeQueries, 'usePrefetchSingle').mockReturnValue(prefetchFn)

    const screen = renderWithApplicationContext(
      <ProviderPurposesTableRow purpose={purposeMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.hover(screen.getByRole('button', { name: 'actions.inspect' }))

    expect(prefetchFn).toHaveBeenCalledWith('test-id')
  })
})

describe('ProviderPurposesTableRowSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ProviderPurposesTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

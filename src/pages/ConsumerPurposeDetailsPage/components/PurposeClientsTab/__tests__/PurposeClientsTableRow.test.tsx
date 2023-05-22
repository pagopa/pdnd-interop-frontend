import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeClientsTableRow, PurposeClientsTableRowSkeleton } from '../PurposeClientsTableRow'
import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { PurposeMutations } from '@/api/purpose'
import { ClientQueries } from '@/api/client'
import userEvent from '@testing-library/user-event'

const props = {
  purposeId: 'purposeId',
  client: {
    id: 'id',
    name: 'name',
    hasKeys: true,
  },
}

describe('PurposeClientsTableRow', () => {
  it('should match snapshot', () => {
    mockUseJwt({ isAdmin: false })
    const { baseElement } = renderWithApplicationContext(<PurposeClientsTableRow {...props} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it("should render 'removeFromPurpose' action when user is admin", () => {
    mockUseJwt({ isAdmin: true })
    const removeFromClientFn = vi.fn()
    vi.spyOn(PurposeMutations, 'useRemoveClient').mockReturnValue({
      mutate: removeFromClientFn,
    } as unknown as ReturnType<typeof PurposeMutations.useRemoveClient>)

    const screen = renderWithApplicationContext(<PurposeClientsTableRow {...props} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const actionMenu = screen.getByRole('button', { name: 'iconButtonAriaLabel' })
    fireEvent.click(actionMenu)
    const removeFromClientBtn = screen.getByRole('menuitem', {
      name: 'tableClientInPurpose.actions.removeFromPurpose',
    })
    fireEvent.click(removeFromClientBtn)
    expect(removeFromClientFn).toHaveBeenCalledWith({ purposeId: 'purposeId', clientId: 'id' })
  })

  it("should call 'prefetchClient' when hovering over 'inspect' button", async () => {
    const prefetchClientFn = vi.fn()
    vi.spyOn(ClientQueries, 'usePrefetchSingle').mockReturnValue(prefetchClientFn)

    const screen = renderWithApplicationContext(<PurposeClientsTableRow {...props} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    const inspectBtn = screen.getByRole('button', { name: 'inspect' })
    const user = userEvent.setup()
    await user.hover(inspectBtn)
    expect(prefetchClientFn).toHaveBeenCalledWith('id')
  })
})

describe('PurposeClientsTableRowSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<PurposeClientsTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

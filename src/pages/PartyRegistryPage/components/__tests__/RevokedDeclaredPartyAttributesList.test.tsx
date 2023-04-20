import React from 'react'
import { createMockRemappedTenant } from '__mocks__/data/user.mocks'
import { mockGetActiveUserPartySpy } from './test.commons'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  RevokedDeclaredPartyAttributesList,
  RevokedDeclaredPartyAttributesListSkeleton,
} from '../RevokedDeclaredPartyAttributesList'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AttributeMutations } from '@/api/attribute'

describe('RevokedDeclaredPartyAttributesList', () => {
  it('should match snapshot', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())

    const { baseElement } = renderWithApplicationContext(<RevokedDeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no attributes', () => {
    mockGetActiveUserPartySpy(undefined)

    const { baseElement } = renderWithApplicationContext(<RevokedDeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should render the revoke action if user is admin', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    mockUseJwt({ isAdmin: true })

    const screen = renderWithApplicationContext(<RevokedDeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getAllByRole('button', { name: 'declareActionLabel' }).length).toBeGreaterThan(0)
  })

  it('should not render the revoke action if user is not admin', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    mockUseJwt({ isAdmin: false })

    const screen = renderWithApplicationContext(<RevokedDeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryAllByRole('button', { name: 'declareActionLabel' }).length).toBe(0)
  })

  it('should correctly call the declare action', async () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    mockUseJwt({ isAdmin: true })

    const revokeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useDeclarePartyAttribute').mockReturnValue({
      mutate: revokeFn,
    } as unknown as ReturnType<typeof AttributeMutations.useDeclarePartyAttribute>)

    const screen = renderWithApplicationContext(<RevokedDeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()
    const revokeAction = screen.getAllByRole('button', { name: 'declareActionLabel' })[0]
    await user.click(revokeAction)
    expect(revokeFn).toBeCalledWith({
      id: 'dichiarato-0w',
    })
  })
})

describe('RevokedDeclaredPartyAttributesListSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<RevokedDeclaredPartyAttributesListSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

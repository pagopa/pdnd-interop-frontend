import React from 'react'
import { createMockRemappedTenant } from '__mocks__/data/user.mocks'
import { mockGetActiveUserPartySpy } from './test.commons'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  DeclaredPartyAttributesList,
  DeclaredPartyAttributesListSkeleton,
} from '../DeclaredPartyAttributesList'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AttributeMutations } from '@/api/attribute'

describe('DeclaredPartyAttributesList', () => {
  it('should match snapshot', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())

    const { baseElement } = renderWithApplicationContext(<DeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no attributes', () => {
    mockGetActiveUserPartySpy(undefined)

    const { baseElement } = renderWithApplicationContext(<DeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should render the revoke action if user is admin', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    mockUseJwt({ isAdmin: true })

    const screen = renderWithApplicationContext(<DeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getAllByRole('button', { name: 'revokeActionLabel' }).length).toBeGreaterThan(0)
  })

  it('should not render the revoke action if user is not admin', () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    mockUseJwt({ isAdmin: false })

    const screen = renderWithApplicationContext(<DeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.queryAllByRole('button', { name: 'revokeActionLabel' }).length).toBe(0)
  })

  it('should correctly call the revoke action', async () => {
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    mockUseJwt({ isAdmin: true })

    const revokeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useRevokeDeclaredPartyAttribute').mockReturnValue({
      mutate: revokeFn,
    } as unknown as ReturnType<typeof AttributeMutations.useRevokeDeclaredPartyAttribute>)

    const screen = renderWithApplicationContext(<DeclaredPartyAttributesList />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()
    const revokeAction = screen.getAllByRole('button', { name: 'revokeActionLabel' })[0]
    await user.click(revokeAction)
    expect(revokeFn).toBeCalledWith({
      attributeId: 'dichiarato-01',
    })
  })
})

describe('DeclaredPartyAttributesListSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<DeclaredPartyAttributesListSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

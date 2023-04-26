import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ClientOperators } from '../ClientOperators'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { PartyQueries } from '@/api/party/party.hooks'
import { ClientMutations } from '@/api/client'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'

describe('ClientOperators', () => {
  it('should match snapshot', () => {
    mockUseJwt({ isAdmin: true })
    const { baseElement } = renderWithApplicationContext(<ClientOperators clientId="clientId" />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should render add operator button when user is admin', () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(<ClientOperators clientId="clientId" />, {
      withReactQueryContext: true,
    })
    expect(screen.getByRole('button', { name: 'addBtn' })).toBeInTheDocument()
  })

  it('should not render add operator button when user is not admin', () => {
    mockUseJwt({ isAdmin: false })
    const screen = renderWithApplicationContext(<ClientOperators clientId="clientId" />, {
      withReactQueryContext: true,
    })
    expect(screen.queryByRole('button', { name: 'addBtn' })).not.toBeInTheDocument()
  })

  it('should prefetch operator list on add operator button hover', async () => {
    mockUseJwt({ isAdmin: true })
    const prefetchFn = vi.fn()
    vi.spyOn(PartyQueries, 'usePrefetchUsersList').mockReturnValue(prefetchFn)

    const screen = renderWithApplicationContext(<ClientOperators clientId="clientId" />, {
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.hover(screen.getByRole('button', { name: 'addBtn' }))
    expect(prefetchFn).toHaveBeenCalled()
  })

  it('should successfully add operators', async () => {
    mockUseJwt({ isAdmin: true })
    const addOperatorFn = vi.fn()
    vi.spyOn(ClientMutations, 'useAddOperator').mockReturnValue({
      mutateAsync: addOperatorFn,
    } as unknown as ReturnType<typeof ClientMutations.useAddOperator>)

    vi.spyOn(PartyQueries, 'useGetUsersList').mockReturnValue({
      data: [
        createMockSelfCareUser({ id: '1', name: 'operator', familyName: 'one' }),
        createMockSelfCareUser({ id: '2', name: 'operator', familyName: 'two' }),
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof PartyQueries.useGetUsersList>)

    const screen = renderWithApplicationContext(<ClientOperators clientId="clientId" />, {
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'addBtn' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const operatorAutocomplete = screen.getByLabelText('content.autocompleteLabel')
    await user.click(operatorAutocomplete)
    const optionOne = screen.getByRole('option', { name: 'operator one' })
    await user.click(optionOne)
    await user.click(operatorAutocomplete)
    const optionTwo = screen.getByRole('option', { name: 'operator two' })
    await user.click(optionTwo)

    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))

    expect(addOperatorFn).toHaveBeenCalledTimes(2)
  })
})

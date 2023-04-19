import React from 'react'
import { render } from '@testing-library/react'
import { EServiceTableRow, EServiceTableRowSkeleton } from '../EServiceTableRow'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceProvider } from '__mocks__/data/eservice.mocks'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'

describe('EServiceTableRow', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <EServiceTableRow
        eservice={createMockEServiceProvider({
          activeDescriptor: { id: 'test', state: 'PUBLISHED' },
        })}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot when eservice is in draft', () => {
    mockUseJwt({ isAdmin: true })
    const { baseElement } = renderWithApplicationContext(
      <EServiceTableRow eservice={createMockEServiceProvider({ activeDescriptor: undefined })} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should go to edit page on edit button press when user is admin and e-service has no active descriptor', async () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(
      <EServiceTableRow
        eservice={createMockEServiceProvider({
          activeDescriptor: undefined,
          draftDescriptor: { id: 'id-draft-descriptor' },
          id: 'id-eservice',
        })}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    expect(screen.history.location.pathname).toBe(
      '/it/erogazione/e-service/id-eservice/id-draft-descriptor/modifica'
    )
  })

  it('should go to edit page on edit button press when user is an api operator and e-service has no active descriptor', async () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: true })
    const screen = renderWithApplicationContext(
      <EServiceTableRow
        eservice={createMockEServiceProvider({
          activeDescriptor: undefined,
          draftDescriptor: { id: 'id-draft-descriptor' },
          id: 'id-eservice',
        })}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    expect(screen.history.location.pathname).toBe(
      '/it/erogazione/e-service/id-eservice/id-draft-descriptor/modifica'
    )
  })

  it('should go to details page on inspect button press if e-service has a draft descriptor but user is not admin or api operator ', async () => {
    mockUseJwt({ isAdmin: false, isOperatorAPI: false })
    const screen = renderWithApplicationContext(
      <EServiceTableRow
        eservice={createMockEServiceProvider({
          activeDescriptor: undefined,
          draftDescriptor: { id: 'id-draft-descriptor' },
          id: 'id-eservice',
        })}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'actions.inspect' }))
    expect(screen.history.location.pathname).toBe(
      '/it/erogazione/e-service/id-eservice/id-draft-descriptor'
    )
  })

  it('should call the prefetch e-service function on button hover when e-service is editable', async () => {
    mockUseJwt({ isAdmin: true })

    const prefetchEServiceFn = vi.fn()
    vi.spyOn(EServiceQueries, 'usePrefetchSingle').mockReturnValue(prefetchEServiceFn)

    const screen = renderWithApplicationContext(
      <EServiceTableRow
        eservice={createMockEServiceProvider({
          activeDescriptor: undefined,
          draftDescriptor: { id: 'id-draft-descriptor' },
          id: 'id-eservice',
        })}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()

    await user.hover(screen.getByRole('button', { name: 'actions.edit' }))
    expect(prefetchEServiceFn).toBeCalledWith('id-eservice')
  })

  it('should call the prefetch descriptor function on button hover when e-service is not editable', async () => {
    mockUseJwt({ isAdmin: true })

    const prefetchDescriptorFn = vi.fn()
    vi.spyOn(EServiceQueries, 'usePrefetchDescriptorProvider').mockReturnValue(prefetchDescriptorFn)

    const screen = renderWithApplicationContext(
      <EServiceTableRow
        eservice={createMockEServiceProvider({
          activeDescriptor: { id: 'test-descriptor-id' },
          draftDescriptor: undefined,
          id: 'id-eservice',
        })}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const user = userEvent.setup()

    await user.hover(screen.getByRole('button', { name: 'actions.inspect' }))
    expect(prefetchDescriptorFn).toBeCalledWith('id-eservice', 'test-descriptor-id')
  })
})

describe('EServiceTableRowSkeleton', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<EServiceTableRowSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })
})

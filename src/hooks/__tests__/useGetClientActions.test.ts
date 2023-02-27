import { createMockClient } from '__mocks__/data/client.mocks'
import useGetClientActions from '../useGetClientActions'
import { renderHookWithApplicationContext } from '@/utils/testing.utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { AUTHORIZATION_PROCESS_URL } from '@/config/env'
import { act } from 'react-dom/test-utils'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { Client } from '@/types/client.types'
import { createMemoryHistory } from 'history'
import { routes } from '@/router/routes'

const server = setupServer(
  rest.delete(
    `${AUTHORIZATION_PROCESS_URL}/clients/85ceaa96-a95e-4cf9-b1f9-b85be1e09369`,
    (_, res) => {
      return res()
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

function renderUseGetClientActionsHook(clientMock?: Client) {
  const memoryHistory = createMemoryHistory()

  memoryHistory.push('/it/fruizione/client')

  if (clientMock?.kind === 'API') {
    memoryHistory.push('/it/fruizione/interop-m2m')
  }

  return renderHookWithApplicationContext(
    () => useGetClientActions(clientMock),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    },
    memoryHistory
  )
}

describe('check if useGetClientActions returns the correct actions based on the passed client', () => {
  it('shoud not return any action if no client is given', () => {
    const { result } = renderUseGetClientActionsHook()
    expect(result.current.actions).toHaveLength(0)
  })

  it('shoud return delete action if client is given with kind API', () => {
    const client = createMockClient({ kind: 'API' })
    const { result } = renderUseGetClientActionsHook(client)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('shoud return delete action if client is given with kind CONSUMER', () => {
    const client = createMockClient({ kind: 'CONSUMER' })
    const { result } = renderUseGetClientActionsHook(client)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('should navigate to SUBSCRIBE_INTEROP_M2M route after the delete action with client kind API', async () => {
    const client = createMockClient({ kind: 'API' })
    const { result, history } = renderUseGetClientActionsHook(client)
    expect(result.current.actions).toHaveLength(1)

    const deleteAction = result.current.actions[0]
    expect(deleteAction.label).toBe('delete')

    act(() => {
      deleteAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe('/it/' + routes.SUBSCRIBE_INTEROP_M2M.PATH.it)
  })

  it('should navigate to SUBSCRIBE_CLIENT_LIST route after the delete action with client kind CONSUMER', async () => {
    const client = createMockClient({ kind: 'CONSUMER' })
    const { result, history } = renderUseGetClientActionsHook(client)
    expect(result.current.actions).toHaveLength(1)

    const deleteAction = result.current.actions[0]
    expect(deleteAction.label).toBe('delete')

    act(() => {
      deleteAction.action()
    })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(history.location.pathname).toBe('/it/' + routes.SUBSCRIBE_CLIENT_LIST.PATH.it)
  })
})
